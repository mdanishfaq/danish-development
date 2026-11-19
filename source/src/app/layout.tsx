import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ViewTransition } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { JsonLd } from "@/components/ui";
import { brand, SITE_URL, services, BASE } from "@/lib/site";

const display = localFont({
  src: "../../node_modules/@fontsource-variable/fredoka/files/fredoka-latin-wght-normal.woff2",
  variable: "--font-fredoka", display: "swap", weight: "300 700",
});
const sans = localFont({
  src: "../../node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2",
  variable: "--font-instrument", display: "swap", weight: "400 700",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://danishishfaq.online"),
  title: { default: "Gus & Co. Plumbing | Friendly Phoenix Plumbers", template: "%s | Gus & Co." },
  description: "Friendly licensed Phoenix plumbers for leaks, drains, water heaters, fixtures and 24/7 emergencies. Fixed prices before we start.",
  openGraph: { type: "website", siteName: brand.full, images: [{ url: `${BASE}/posters/hero.webp`, width: 1200, height: 900, alt: "Gus the plumber waving next to his van" }] },
  twitter: { card: "summary_large_image" },
  icons: { icon: `${BASE}/icon.svg` },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#ffc93c" };

const business = {
  "@context": "https://schema.org", "@type": "Plumber", "@id": `${SITE_URL}/#business`, name: brand.full, url: `${SITE_URL}/`,
  telephone: brand.tel, email: brand.email, priceRange: "$$", image: `${SITE_URL}/posters/hero.webp`,
  address: { "@type": "PostalAddress", streetAddress: "418 W Roosevelt St", addressLocality: "Phoenix", addressRegion: "AZ", postalCode: "85003", addressCountry: "US" },
  geo: { "@type": "GeoCoordinates", latitude: 33.4585, longitude: -112.0791 },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "00:00", closes: "23:59" }],
  aggregateRating: { "@type": "AggregateRating", ratingValue: brand.rating, reviewCount: 2140 },
  areaServed: ["Phoenix", "Tempe", "Mesa", "Scottsdale", "Chandler", "Gilbert", "Glendale", "Peoria"].map((n) => ({ "@type": "Place", name: `${n}, AZ` })),
  hasOfferCatalog: { "@type": "OfferCatalog", name: "Plumbing services", itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, url: `${SITE_URL}/services/${s.slug}/` } })) },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brass focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>
        <JsonLd data={business} />
        <Header />
        <ViewTransition>
          <main id="main">{children}</main>
        </ViewTransition>
        <Footer />
        <SmoothScroll />
        <a href={`tel:${brand.tel}`} className="btn btn-coral fixed bottom-5 right-5 z-40 md:hidden" aria-label={`24/7 emergency line ${brand.phone}`}>🚨 24/7</a>
      </body>
    </html>
  );
}
