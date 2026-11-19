import { pageMeta } from "@/lib/meta";
import type { Metadata } from "next";
import { Eyebrow, JsonLd } from "@/components/ui";
import { BookingForm } from "@/components/interactive";
import { brand, services, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/contact/", `Book a Licensed Plumber in Austin Online`, `Book a licensed Austin plumber online in 60 seconds or call our 24/7 line. Two-hour arrival windows, plus a text when your plumber is on the way.`);

export default function Contact() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Book & contact", item: `${SITE_URL}/contact/` }] }} />
      <section className="grain relative overflow-hidden bg-ink pb-24 pt-36 text-paper md:pt-44">
        <div aria-hidden="true" className="absolute -right-40 top-0 h-[40rem] w-[40rem] rounded-full bg-brass/20 blur-[130px]" />
        <div className="relative mx-auto grid max-w-[88rem] gap-14 px-5 md:px-10 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <Eyebrow className="mx-blur-up mb-6 text-brass-2">Book &amp; contact</Eyebrow>
            <h1 className="h-xl"><span className="hero-words"><span>Let&apos;s</span> <span style={{ ["--i" as string]: 2 }}>get</span> <span style={{ ["--i" as string]: 4 }}>this</span> <span className="brass-text" style={{ ["--i" as string]: 6 }}>flowing.</span></span></h1>
            <p className="mx-blur-up mt-8 max-w-md text-lg text-bone/75">Three quick steps and you&apos;re booked. Prefer a voice? Our dispatchers pick up 24/7.</p>
            <div className="mt-12 space-y-4">
              <a href={`tel:${brand.tel}`} className="mx-rise group flex items-center justify-between rounded-3xl bg-signal p-6 transition-transform hover:-translate-y-1" style={{ ["--i" as string]: 1 }}>
                <span><span className="eyebrow block opacity-80">24/7 emergency</span><span className="font-display mt-1 block text-3xl font-bold">{brand.phone}</span></span>
                <span className="live-dot !bg-white" aria-hidden="true" />
              </a>
              <div className="mx-rise grid gap-4 sm:grid-cols-2" style={{ ["--i" as string]: 2 }}>
                <a href={`mailto:${brand.email}`} className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 transition hover:bg-white/10"><span className="eyebrow block text-brass-2">Email</span><span className="mt-2 block break-all">{brand.email}</span></a>
                <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10"><span className="eyebrow block text-brass-2">Visit</span><address className="mt-2 not-italic">{brand.address}</address></div>
              </div>
              <p className="text-sm text-bone/70">{brand.hours}</p>
            </div>
          </div>
          <div className="rise-in"><BookingForm services={services} /></div>
        </div>
      </section>
    </>
  );
}
