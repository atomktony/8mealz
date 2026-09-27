import { cookies, headers } from "next/headers";
import type { Lang } from "./data";

export async function getLang(): Promise<Lang> {
  const c = (await cookies()).get("lang")?.value;
  if (c === "pt" || c === "en") return c;
  const accept = (await headers()).get("accept-language") ?? "";
  return accept.toLowerCase().startsWith("pt") ? "pt" : "en";
}
