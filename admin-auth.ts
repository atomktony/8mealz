import "server-only";
import { cookies } from "next/headers";
import { createHash } from "crypto";

const COOKIE = "8m_admin";

function token(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHash("sha256").update(`8mealz:${pw}`).digest("hex");
}

export function passwordMatches(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && input === pw;
}

export async function isAdmin(): Promise<boolean> {
  const t = token();
  if (!t) return false;
  return (await cookies()).get(COOKIE)?.value === t;
}

export async function setAdminCookie() {
  const t = token();
  if (!t) return;
  (await cookies()).set(COOKIE, t, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminCookie() {
  (await cookies()).delete(COOKIE);
}

export const adminConfigured = () => !!process.env.ADMIN_PASSWORD;
