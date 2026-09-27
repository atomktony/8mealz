"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  emailOnPilotList,
  hasActiveMembership,
  insertOrder,
  insertPartner,
  insertPilotSignup,
  insertVote,
  orderCodeExists,
  setOrderStatus,
  setPartnerStatus,
  startMembership,
  voteCounts,
} from "@/lib/db";
import { notifyAdmin } from "@/lib/notify";
import { findExtra, findPackage, ORDER_STATUSES, type OrderStatus } from "@/lib/data";
import { CURRENCY, quote } from "@/lib/pricing";
import { clearAdminCookie, isAdmin, passwordMatches, setAdminCookie } from "@/lib/admin-auth";

export interface FormState {
  status: "idle" | "ok" | "error" | "duplicate";
  errors?: Record<string, string>;
  counts?: Record<string, number>;
}

const str = (max = 200) => z.string().trim().min(1).max(max);
const optStr = (max = 1000) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));
const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9 ()-]{7,20}$/);

function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of err.issues) out[String(i.path[0])] = i.code === "too_small" ? "required" : "invalid";
  return out;
}

const isBot = (fd: FormData) => String(fd.get("company_website") ?? "") !== "";

// ---------- pilot signup ----------
const pilotSchema = z.object({
  full_name: str(),
  email: z.string().trim().email(),
  whatsapp: phone,
  sender_country: str(),
  recipient_city: str(),
  relationship: str(),
  frequency: str(),
  notes: optStr(),
  source: z.enum(["modal", "home", "page"]).default("page"),
});

export async function submitPilotSignup(_: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { status: "ok" };
  const parsed = pilotSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error) };
  try {
    if (await emailOnPilotList(parsed.data.email)) return { status: "duplicate" };
    await insertPilotSignup(parsed.data);
    await notifyAdmin("New pilot signup", parsed.data);
    return { status: "ok" };
  } catch (e) {
    if ((e as { code?: string }).code === "23505") return { status: "duplicate" };
    console.error(e);
    return { status: "error", errors: { _form: "server" } };
  }
}

// ---------- partner application ----------
const partnerSchema = z.object({
  store_name: str(),
  owner_name: str(),
  neighborhood: str(),
  store_type: str(),
  whatsapp: phone,
  has_refrigeration: z
    .string()
    .optional()
    .transform((v) => v === "on"),
  notes: optStr(),
});

export async function submitPartner(_: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { status: "ok" };
  const parsed = partnerSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error) };
  try {
    await insertPartner({ ...parsed.data, status: "new" });
    await notifyAdmin("New market partner application", parsed.data);
    return { status: "ok" };
  } catch (e) {
    console.error(e);
    return { status: "error", errors: { _form: "server" } };
  }
}

// ---------- country vote ----------
const voteSchema = z.object({
  country: str(),
  diaspora_location: str(),
  email: z.string().trim().email(),
  interested_as: z.enum(["sender", "merchant", "recipient"]),
});

export async function getVoteCounts() {
  try {
    return await voteCounts();
  } catch {
    return {};
  }
}

export async function submitVote(_: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { status: "ok" };
  const parsed = voteSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error) };
  try {
    await insertVote(parsed.data);
    return { status: "ok", counts: await voteCounts() };
  } catch (e) {
    console.error(e);
    return { status: "error", errors: { _form: "server" } };
  }
}

// ---------- orders ----------
export async function checkMembership(email: string): Promise<boolean> {
  const ok = z.string().email().safeParse(email.trim());
  if (!ok.success) return false;
  try {
    return await hasActiveMembership(ok.data);
  } catch {
    return false;
  }
}

const orderSchema = z.object({
  package_id: str(50),
  extras: z.array(z.object({ id: z.string(), qty: z.number().int().min(1).max(20) })).max(20),
  sender_name: str(),
  sender_email: z.string().trim().email(),
  sender_whatsapp: phone,
  recipient_name: str(),
  recipient_whatsapp: phone,
  neighborhood: str(),
  pickup_date: z.string().trim().max(20).optional().nullable(),
  dietary_notes: z.string().trim().max(1000).optional().nullable(),
  lang: z.enum(["en", "pt"]).default("en"),
  company_website: z.string().optional(),
});

export type OrderInput = z.input<typeof orderSchema>;

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
async function newCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    let c = "8M-";
    for (let j = 0; j < 6; j++) c += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    if (!(await orderCodeExists(c))) return c;
  }
  throw new Error("Could not generate order code");
}

export async function createOrder(
  input: OrderInput
): Promise<{ ok: true; code: string } | { ok: false; errors: Record<string, string> }> {
  if (input.company_website) return { ok: false, errors: { _form: "server" } };
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const d = parsed.data;

  // Recompute every price on the server from the catalog. Never trust client totals.
  const pkg = findPackage(d.package_id);
  if (!pkg) return { ok: false, errors: { package_id: "invalid" } };
  const extras = d.extras.filter((e) => findExtra(e.id));
  const groceries = pkg.price + extras.reduce((s, e) => s + findExtra(e.id)!.price * e.qty, 0);

  try {
    const member = await hasActiveMembership(d.sender_email);
    const q = quote(groceries, !member);
    const code = await newCode();
    await insertOrder({
      code,
      sender_name: d.sender_name,
      sender_email: d.sender_email.toLowerCase(),
      sender_whatsapp: d.sender_whatsapp,
      recipient_name: d.recipient_name,
      recipient_whatsapp: d.recipient_whatsapp,
      neighborhood: d.neighborhood,
      package_id: pkg.id,
      extras,
      dietary_notes: d.dietary_notes || null,
      pickup_date: d.pickup_date || null,
      groceries_total: q.groceries,
      service_fee: q.serviceFee,
      membership_fee: q.membershipFee,
      total: q.total,
      currency: CURRENCY.code,
      status: "reserved",
      lang: d.lang,
    });
    if (!member) await startMembership(d.sender_email);
    await notifyAdmin(`New pilot order ${code}`, { ...d, code, package: pkg.name.en, extras, ...q });
    return { ok: true, code };
  } catch (e) {
    console.error(e);
    return { ok: false, errors: { _form: "server" } };
  }
}


// ---------- admin ----------
export async function adminLogin(_: FormState, fd: FormData): Promise<FormState> {
  if (!passwordMatches(String(fd.get("password") ?? ""))) return { status: "error", errors: { password: "invalid" } };
  await setAdminCookie();
  redirect("/admin");
}

export async function adminLogout() {
  await clearAdminCookie();
  redirect("/admin");
}

export async function adminSetOrderStatus(fd: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const id = String(fd.get("id"));
  const status = String(fd.get("status")) as OrderStatus;
  if (!ORDER_STATUSES.includes(status)) throw new Error("Bad status");
  await setOrderStatus(id, status);
  revalidatePath("/admin");
}

export async function adminSetPartnerStatus(fd: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const status = String(fd.get("status"));
  if (!["new", "contacted", "approved", "declined"].includes(status)) throw new Error("Bad status");
  await setPartnerStatus(String(fd.get("id")), status);
  revalidatePath("/admin");
}
