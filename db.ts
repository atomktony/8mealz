import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { OrderStatus } from "./data";

// Storage layer. Uses Supabase when env vars exist.
// Without them the site runs in demo mode: data lives in server memory and resets on redeploy.

export type Table = "pilot_signups" | "partner_applications" | "orders" | "country_votes" | "memberships";

export interface PilotSignup {
  full_name: string;
  email: string;
  whatsapp: string;
  sender_country: string;
  recipient_city: string;
  relationship: string;
  frequency: string;
  notes: string | null;
  source: string;
}

export interface PartnerApplication {
  store_name: string;
  owner_name: string;
  neighborhood: string;
  store_type: string;
  whatsapp: string;
  has_refrigeration: boolean;
  notes: string | null;
  status: string;
}

export interface OrderRow {
  code: string;
  sender_name: string;
  sender_email: string;
  sender_whatsapp: string;
  recipient_name: string;
  recipient_whatsapp: string;
  neighborhood: string;
  package_id: string;
  extras: { id: string; qty: number }[];
  dietary_notes: string | null;
  pickup_date: string | null;
  groceries_total: number;
  service_fee: number;
  membership_fee: number;
  total: number;
  currency: string;
  status: OrderStatus;
  lang: string;
}

export interface CountryVote {
  country: string;
  diaspora_location: string;
  email: string;
  interested_as: string;
}

type Row = Record<string, unknown> & { id: string; created_at: string };

let client: SupabaseClient | null | undefined;
function sb(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return client;
}

export const isDemoStorage = () => sb() === null;

// ---------- memory fallback ----------
type Mem = Record<Table, Row[]>;
const g = globalThis as unknown as { __8mealzMem?: Mem };
function mem(): Mem {
  if (!g.__8mealzMem) {
    g.__8mealzMem = { pilot_signups: [], partner_applications: [], orders: [], country_votes: [], memberships: [] };
  }
  return g.__8mealzMem;
}
const newRow = (data: object): Row => ({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...data });

// ---------- generic helpers ----------
async function insert(table: Table, data: object): Promise<Row> {
  const s = sb();
  if (!s) {
    const row = newRow(data);
    mem()[table].unshift(row);
    return row;
  }
  const { data: row, error } = await s.from(table).insert(data).select().single();
  if (error) throw Object.assign(new Error(error.message), { code: error.code });
  return row as Row;
}

export async function listTable(table: Table): Promise<Row[]> {
  const s = sb();
  if (!s) return [...mem()[table]];
  const { data, error } = await s.from(table).select("*").order("created_at", { ascending: false }).limit(1000);
  if (error) throw new Error(error.message);
  return (data ?? []) as Row[];
}

// ---------- pilot signups ----------
export async function emailOnPilotList(email: string): Promise<boolean> {
  const e = email.toLowerCase();
  const s = sb();
  if (!s) return mem().pilot_signups.some((r) => r.email === e);
  const { count } = await s.from("pilot_signups").select("id", { count: "exact", head: true }).eq("email", e);
  return (count ?? 0) > 0;
}
export const insertPilotSignup = (d: PilotSignup) => insert("pilot_signups", { ...d, email: d.email.toLowerCase() });

// ---------- partners ----------
export const insertPartner = (d: PartnerApplication) => insert("partner_applications", d);

// ---------- votes ----------
export const insertVote = (d: CountryVote) => insert("country_votes", { ...d, email: d.email.toLowerCase() });
export async function voteCounts(): Promise<Record<string, number>> {
  const rows = await listTable("country_votes");
  const out: Record<string, number> = {};
  for (const r of rows) out[r.country as string] = (out[r.country as string] ?? 0) + 1;
  return out;
}

// ---------- memberships ----------
export async function hasActiveMembership(email: string): Promise<boolean> {
  const e = email.toLowerCase();
  const now = new Date().toISOString();
  const s = sb();
  if (!s) return mem().memberships.some((m) => m.email === e && (m.expires_at as string) > now);
  const { count } = await s
    .from("memberships")
    .select("id", { count: "exact", head: true })
    .eq("email", e)
    .gt("expires_at", now);
  return (count ?? 0) > 0;
}
export async function startMembership(email: string) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  const data = { email: email.toLowerCase(), started_at: new Date().toISOString(), expires_at: expires.toISOString() };
  const s = sb();
  if (!s) {
    mem().memberships = mem().memberships.filter((m) => m.email !== data.email);
    mem().memberships.unshift(newRow(data));
    return;
  }
  await s.from("memberships").upsert(data, { onConflict: "email" });
}

// ---------- orders ----------
export async function orderCodeExists(code: string): Promise<boolean> {
  return (await getOrder(code)) !== null;
}
export const insertOrder = (d: OrderRow) => insert("orders", d);

export async function getOrder(code: string): Promise<(OrderRow & Row) | null> {
  const c = code.toUpperCase();
  const s = sb();
  if (!s) return (mem().orders.find((o) => o.code === c) as (OrderRow & Row) | undefined) ?? null;
  const { data } = await s.from("orders").select("*").eq("code", c).maybeSingle();
  return (data as (OrderRow & Row) | null) ?? null;
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  const s = sb();
  if (!s) {
    const o = mem().orders.find((r) => r.id === id);
    if (o) o.status = status;
    return;
  }
  const { error } = await s.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setPartnerStatus(id: string, status: string) {
  const s = sb();
  if (!s) {
    const o = mem().partner_applications.find((r) => r.id === id);
    if (o) o.status = status;
    return;
  }
  const { error } = await s.from("partner_applications").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}
