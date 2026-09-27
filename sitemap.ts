import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/send", "/partners", "/partners/demo", "/pilot", "/privacy", "/terms", "/pilot-disclosure"].map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: new Date(),
  }));
}
