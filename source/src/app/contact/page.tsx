import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { BookingForm } from "@/components/interactive";
import { Crumbs, JsonLd } from "@/components/ui";
import { brand, services, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/contact/", "Book Gus: Same-Day Plumbers in Phoenix", "Book a Gus & Co. plumber online in 60 seconds or call our 24/7 line. Same-day visits across Phoenix, Tempe, Mesa and Scottsdale.");

export default function Contact() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Book & contact", item: `${SITE_URL}/contact/` }] }} />
      <section className="bg-sky-2 px-5 pb-24 pt-32 md:px-10 md:pt-40">
        <div className="mx-auto grid max-w-[84rem] gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Crumbs items={[{ href: "/", label: "Home" }, { label: "Book & contact" }]} />
            <h1 className="h-mega mt-6"><span className="hero-words">{"Let's get Gus over.".split(" ").map((w, i) => <span key={i} style={{ ["--i" as string]: i }}>{w}&nbsp;</span>)}</span></h1>
            <p className="mt-6 max-w-md text-xl text-navy/80">Three quick steps and you&apos;re booked. Prefer to talk? Someone real answers 24/7.</p>
            <div className="mt-10 space-y-4">
              <a href={`tel:${brand.tel}`} className="card-toy block bg-coral p-6 text-white transition-transform hover:-translate-y-1"><span className="block font-semibold">🚨 24/7 emergency line</span><span className="font-display mt-1 block text-4xl font-bold">{brand.phone}</span></a>
              <div className="grid gap-4 sm:grid-cols-2">
                <a href={`mailto:${brand.email}`} className="card-toy block bg-white p-6"><span className="block font-semibold text-blue-2">✉️ Email</span><span className="mt-1 block break-all">{brand.email}</span></a>
                <div className="card-toy bg-white p-6"><span className="block font-semibold text-blue-2">📍 Visit</span><address className="mt-1 not-italic">{brand.address}</address></div>
              </div>
              <p className="text-sm font-semibold text-navy/75">{brand.hours}</p>
            </div>
          </div>
          <BookingForm services={services} />
        </div>
      </section>
    </>
  );
}
