import type { MetadataRoute } from "next";
import { services, SITE_URL } from "@/lib/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-11-19");
  return ["", "services/", ...services.map((s) => `services/${s.slug}/`), "pricing/", "about/", "faq/", "contact/"]
    .map((p) => ({ url: `${SITE_URL}/${p}`, lastModified: now, changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
}
