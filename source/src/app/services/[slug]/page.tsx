import { pageMeta } from "@/lib/meta";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { Btn, CtaBand, Eyebrow, JsonLd, PageHero, Photo, SectionHead } from "@/components/ui";
import { brand, services, SITE_URL } from "@/lib/site";

export function generateStaticParams() { return services.map((s) => ({ slug: s.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const s = services.find((x) => x.slug === slug);
  if (!s) return {};
  return pageMeta(`/services/${s.slug}/`, `${s.name} in Austin, TX: From ${s.from}`, `${s.short} From ${s.from}. Licensed Austin plumbers, fixed written prices.`);
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = services.findIndex((x) => x.slug === slug); if (i < 0) notFound();
  const s = services[i]; const next = services[(i + 1) % services.length];
  const url = `${SITE_URL}/services/${s.slug}/`;
  return (
    <>
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "Service", name: s.name, serviceType: s.name, description: s.lede, url, provider: { "@id": `${SITE_URL}/#business` }, areaServed: "Austin, TX", offers: { "@type": "Offer", priceCurrency: "USD", price: s.from.replace(/[^0-9.]/g, ""), description: `From ${s.from}` } },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services/` }, { "@type": "ListItem", position: 3, name: s.name, item: url }] },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      ]} />
      <PageHero eyebrow={`${s.tag} · from ${s.from}`} title={s.name} accent="in Austin." lede={s.lede} photo={s.img} crumbs={[{ href: "/", label: "Home" }, { href: "/services/", label: "Services" }, { label: s.name }]}>
        <Btn href="/contact/">Book {s.name.toLowerCase()}</Btn>
        <Btn href={`tel:${brand.tel}`} variant="ghost" className="text-paper">{brand.phone}</Btn>
      </PageHero>

      {/* quick facts strip */}
      <section className="bg-brass text-ink">
        <dl className="mx-auto grid max-w-[88rem] grid-cols-2 gap-6 px-5 py-8 md:grid-cols-4 md:px-10">
          {[["Starting price", s.from], ["Typical time", s.time], ["Warranty", s.slug === "repiping" ? "Lifetime" : "1 year+"], ["Availability", s.slug === "emergency-plumbing" ? "24/7/365" : "Mon–Sat"]].map(([k, val], j) => (
            <div key={k} className="mx-blur-up" style={{ "--i": j } as CSSProperties}><dt className="eyebrow opacity-70">{k}</dt><dd className="font-display mt-1 text-2xl font-bold tracking-tight md:text-3xl">{val}</dd></div>
          ))}
        </dl>
      </section>

      {/* signs + image */}
      <section className="bg-paper py-24 md:py-32">
        <div className="mx-auto grid max-w-[88rem] gap-14 px-5 md:px-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHead eyebrow="When to call" title="Signs you need" accent="us." />
            <ul className="mt-10 space-y-3">
              {s.signs.map((g, j) => (
                <li key={g} className="mx-blur-left mx-on-view flex items-center gap-4 rounded-2xl bg-bone p-4 text-lg" style={{ "--i": j } as CSSProperties}>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-brass">{j + 1}</span>{g}
                </li>
              ))}
            </ul>
          </div>
          <div className="img-reveal aspect-[4/5] w-full rounded-blob"><Photo k={s.img2} alt={`${s.name} by Brass & Bolt`} sizes="(min-width:1024px) 50vw, 100vw" /></div>
        </div>
      </section>

      {/* process */}
      <section className="bg-ink py-24 text-paper md:py-32">
        <div className="mx-auto max-w-[88rem] px-5 md:px-10">
          <SectionHead dark eyebrow="Our process" title="How we handle" accent={`${s.name.toLowerCase()}.`} className="mb-14" />
          <ol className="grid gap-5 md:grid-cols-3">
            {s.steps.map((st, j) => (
              <li key={st.t} className="mx-rise mx-on-view relative overflow-hidden rounded-blob bg-ink-3 p-8 ring-1 ring-white/10" style={{ "--i": j } as CSSProperties}>
                <span aria-hidden="true" className="font-display absolute -right-2 -top-6 text-[9rem] font-extrabold leading-none text-white/[.04]">{j + 1}</span>
                <span className="font-display grid h-12 w-12 place-items-center rounded-full bg-brass text-lg font-bold text-ink">{j + 1}</span>
                <h3 className="font-display mt-8 text-2xl font-bold">{st.t}</h3>
                <p className="mt-3 text-bone/65">{st.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* includes + faq */}
      <section className="bg-bone py-24 md:py-32">
        <div className="mx-auto grid max-w-[88rem] gap-14 px-5 md:px-10 lg:grid-cols-2">
          <div>
            <Eyebrow className="mb-5 text-brass-3">What&apos;s included</Eyebrow>
            <ul className="grid gap-3 sm:grid-cols-2">
              {s.includes.map((it, j) => (
                <li key={it} className="mx-pop mx-on-view rounded-2xl bg-paper p-5 font-semibold" style={{ "--i": j } as CSSProperties}><span className="mb-3 block text-2xl text-brass-3">✓</span>{it}</li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow className="mb-5 text-brass-3">Questions</Eyebrow>
            <div className="divide-y divide-ink/15 border-y border-ink/15">
              {s.faq.map((f, j) => (
                <details key={f.q} open={j === 0} className="py-2">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-xl font-semibold"><span>{f.q}</span><span className="acc-icon grid h-10 w-10 shrink-0 place-items-center rounded-full text-xl ring-1 ring-ink/20" aria-hidden="true">+</span></summary>
                  <p className="pb-5 text-ink/70">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* next service */}
      <Link href={`/services/${next.slug}/`} className="group relative block overflow-hidden bg-ink text-paper">
        <div className="absolute inset-0 opacity-30 transition-all duration-[1.2s] group-hover:scale-105 group-hover:opacity-50"><Photo k={next.img} alt="" /></div>
        <div className="relative mx-auto flex max-w-[88rem] items-end justify-between gap-6 px-5 py-20 md:px-10 md:py-28">
          <div><p className="eyebrow text-brass-2">Next service</p><p className="h-xl mt-4">{next.name}</p></div>
          <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-brass text-3xl text-ink transition-transform duration-700 [transition-timing-function:var(--ease-expo)] group-hover:-rotate-45 md:h-28 md:w-28" aria-hidden="true">→</span>
        </div>
      </Link>
      <CtaBand />
    </>
  );
}
