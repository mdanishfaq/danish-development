import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { pageMeta } from "@/lib/meta";
import { GusStage } from "@/components/gus/GusStage";
import { Btn, CtaBand, JsonLd, Stars, Wave } from "@/components/ui";
import { brand, faqs, journey, plans, poster, reviews, services, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/", "Gus & Co. Plumbing | Friendly Phoenix Plumbers, 24/7", "Meet Gus, Phoenix's friendliest plumber. Leaks, clogs, water heaters, fixtures and 24/7 emergencies, with a fixed price before any work starts.", true);

const v = (o: Record<string, string | number>) => o as CSSProperties;

export default function Home() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: brand.full, url: `${SITE_URL}/` }} />

      {/* ============ THE JOURNEY ============ */}
      <section className="journey relative" aria-label="Follow Gus through a day on the job">
        <div className="mx-auto grid max-w-[84rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-10 lg:px-10">
          <div className="journey-bg sticky top-0 z-10 h-[46svh] lg:order-2 lg:h-[100svh]">
            <GusStage mode="journey" poster={poster("hero")} posterAlt="Gus the plumber waving next to his yellow and white van" priority className="h-full w-full pt-16 lg:pt-20" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/5 to-transparent lg:hidden" />
          </div>
          <div className="relative z-0 px-5 lg:order-1 lg:px-0">
            {journey.map((s, i) => (
              <article key={s.station} data-station={s.station} className={`flex items-center ${i === 0 ? "min-h-[54svh] lg:min-h-[100svh]" : "min-h-[85svh] lg:min-h-[105svh]"}`}>
                <div className={`stop-card card-toy w-full p-7 md:p-10 ${i === 0 ? "!animate-none" : ""}`}>
                  <p className="chip bg-sun-2 text-navy">{s.kicker}</p>
                  {i === 0 ? (
                    <h1 className="font-display mt-5 text-[clamp(2.6rem,4.6vw,4.8rem)] font-bold leading-[.95] tracking-[-0.02em]">
                      <span className="hero-words">{s.title.split(" ").map((w, k) => <span key={k} style={v({ "--i": k })}>{w}&nbsp;</span>)}</span>
                    </h1>
                  ) : <h2 className="h-xl mt-5">{s.title}</h2>}
                  <p className="stop-muted mt-5 max-w-lg text-lg md:text-xl">{s.text}</p>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    {s.href && <Btn href={s.href} variant={s.station === "emergency" ? "coral" : i === 0 ? "sun" : "blue"}>{s.cta} →</Btn>}
                    {i === 0 && <Btn href={`tel:${brand.tel}`} variant="white">📞 {brand.phone}</Btn>}
                  </div>
                  {i === 0 && (
                    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold">
                      <span className="flex items-center gap-2"><Stars /> {brand.rating} · {brand.reviews} reviews</span>
                      <span>✅ Fixed prices</span><span>🕐 Same day</span>
                    </div>
                  )}
                  {i === 0 && <p className="stop-muted mt-8 hidden text-sm font-semibold lg:block">↓ Scroll to follow Gus on the job</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Wave from="#bfe6ff" to="#fffaf0" />

      {/* ============ SERVICES ============ */}
      <section className="bg-cream px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[84rem]">
          <p className="chip bg-sky-2 text-blue">What Gus fixes</p>
          <h2 className="h-xl mt-5 max-w-3xl">Five things we fix every single day.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Link key={s.slug} href={`/services/${s.slug}/`} className="card-toy group relative flex flex-col overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1.5 hover:rotate-[-0.6deg]" style={{ background: s.color }}>
                <div className="relative -mx-2 aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={poster(s.station)} alt={`Gus doing ${s.name.toLowerCase()}`} width={1200} height={900} loading="lazy" decoding="async" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="font-display mt-2 text-3xl font-bold">{s.emoji} {s.name}</h3>
                <p className="mt-2 flex-1 text-navy/75">{s.short}</p>
                <p className="mt-5 flex items-center justify-between font-display text-lg font-semibold">From {s.from} <span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-sun transition-transform group-hover:rotate-[-20deg]">→</span></p>
              </Link>
            ))}
            <div className="card-toy flex flex-col justify-center bg-sun p-8">
              <p className="font-display text-3xl font-bold">Something else?</p>
              <p className="mt-3 text-navy/80">If water runs through it, Gus can probably fix it.</p>
              <div className="mt-6"><Btn href="/contact/" variant="blue">Ask Gus →</Btn></div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ REVIEWS ============ */}
      <section className="bg-sun px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[84rem]">
          <h2 className="h-xl max-w-3xl">Phoenix loves Gus. <span className="text-blue-2">4.9★</span></h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {reviews.map((r, i) => (
              <figure key={r.name} className="card-toy bg-white p-7" style={{ rotate: `${[-1.5, 1, -0.5, 1.5][i]}deg` }}>
                <Stars />
                <blockquote className="font-display mt-4 text-xl font-medium leading-snug">&ldquo;{r.text}&rdquo;</blockquote>
                <figcaption className="mt-6 text-sm font-semibold">{r.name} <span className="text-navy/70">· {r.area}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PLANS ============ */}
      <section className="bg-cream px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[84rem]">
          <p className="chip bg-sky-2 text-blue">Honest prices</p>
          <h2 className="h-xl mt-5">Prices you see before Gus picks up a wrench.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <div key={p.name} className={`card-toy relative p-8 ${p.featured ? "md:-translate-y-4" : ""}`} style={{ background: p.color }}>
                {p.featured && <span className="chip absolute -top-4 left-8 bg-coral text-white">Most loved</span>}
                <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                <p className="mt-4"><span className="font-display text-6xl font-bold">{p.price}</span> <span className="text-navy/70">{p.per}</span></p>
                <ul className="mt-6 space-y-2">{p.items.map((x) => <li key={x}>✅ {x}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="mt-10"><Btn href="/pricing/" variant="blue">See all prices →</Btn></div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="bg-sky-2 px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[84rem] gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div><h2 className="h-xl">Questions for Gus</h2><Link href="/faq/" className="mt-6 inline-block font-semibold text-blue-2 underline underline-offset-4">All questions</Link></div>
          <div className="space-y-3">
            {faqs.slice(0, 5).map((f, i) => (
              <details key={f.q} open={i === 0} className="card-toy bg-white px-6">
                <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-xl font-semibold">{f.q}<span className="acc-icon grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-2 text-2xl" aria-hidden="true">+</span></summary>
                <p className="pb-6 text-navy/80">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
