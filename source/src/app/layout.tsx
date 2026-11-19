import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ViewTransition } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { JsonLd } from "@/components/ui";
import { brand, SITE_URL, services, areas, BASE } from "@/lib/site";

const display = localFont({
  src: "../../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2",
  variable: "--font-bricolage", display: "swap", weight: "200 800",
});
const sans = localFont({
  src: "../../node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2",
  variable: "--font-instrument", display: "swap", weight: "400 700",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://danishishfaq.online"),
  title: { default: "Brass & Bolt Plumbing | 24/7 Plumbers in Austin, TX", template: "%s | Brass & Bolt" },
  description: "Licensed Austin plumbers for emergencies, leak detection, drain cleaning, water heaters, remodels and repiping. Fixed prices, ~60 minute arrival, 24/7.",
  openGraph: { type: "website", siteName: brand.full, images: [{ url: `${BASE}/art/hero-brass.webp`, width: 1536, height: 1024, alt: "Brass pipes with water splash" }] },
  twitter: { card: "summary_large_image" },
  icons: { icon: `${BASE}/icon.svg` },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#07111f" };

const business = {
  "@context": "https://schema.org", "@type": "Plumber", "@id": `${SITE_URL}/#business`, name: brand.full, url: `${SITE_URL}/`,
  telephone: brand.tel, email: brand.email, priceRange: "$$", image: `${SITE_URL}/art/hero-brass.webp`,
  address: { "@type": "PostalAddress", streetAddress: "2210 Riverside Dr", addressLocality: "Austin", addressRegion: "TX", postalCode: "78741", addressCountry: "US" },
  geo: { "@type": "GeoCoordinates", latitude: 30.2459, longitude: -97.7271 },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "00:00", closes: "23:59" }],
  aggregateRating: { "@type": "AggregateRating", ratingValue: brand.rating, reviewCount: 1280 },
  areaServed: areas.map((a) => ({ "@type": "Place", name: `${a.name}, Austin, TX` })),
  hasOfferCatalog: { "@type": "OfferCatalog", name: "Plumbing services", itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, url: `${SITE_URL}/services/${s.slug}/` } })) },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head><link rel="preconnect" href="https://images.unsplash.com" /></head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brass focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>
        <JsonLd data={business} />
        <Header />
        <ViewTransition>
          <main id="main">{children}</main>
        </ViewTransition>
        <Footer />
        <SmoothScroll />
        <a href={`tel:${brand.tel}`} className="btn btn-sos fixed bottom-5 right-5 z-40 !h-14 shadow-[0_20px_50px_-10px_rgba(255,90,54,.6)] md:hidden" aria-label={`24/7 emergency line ${brand.phone}`}>
          <span className="live-dot !bg-white" aria-hidden="true" /> SOS 24/7
        </a>
      </body>
    </html>
  );
}
