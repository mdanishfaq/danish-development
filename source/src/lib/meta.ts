import type { Metadata } from "next";
import { BASE, SITE_URL, brand } from "./site";

/** Full page metadata, including og:url and the shared OG image (page openGraph replaces the layout's). */
export function pageMeta(path: string, title: string, description: string, absolute = false): Metadata {
  const url = `${SITE_URL}${path}`;
  const full = absolute ? title : `${title} | Brass & Bolt`;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: full, description, siteName: brand.full, images: [{ url: `${BASE}/art/hero-brass.webp`, width: 1536, height: 1024, alt: "Brass pipes with a water splash" }] },
    twitter: { card: "summary_large_image", title: full, description },
  };
}
