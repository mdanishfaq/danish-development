import { pageMeta } from "@/lib/meta";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Hero3D } from "@/components/Hero3D";
import { Art, Btn, CtaBand, Eyebrow, Photo, SectionHead, Stars, JsonLd } from "@/components/ui";
import { RollingNumber, Marquee } from "@/components/mx";
import { BeforeAfter, DragRail, Hotspots, ServiceReveal, Tilt } from "@/components/interactive";
import { brand, faqs, plans, reviews, services, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/", `Brass & Bolt Plumbing | 24/7 Emergency Plumber Austin TX`, `Austin's 24/7 plumbers: a licensed plumber at your door in about an hour and a fixed written price before any work starts. Book online in 60 seconds.`, true);

const v = (o: Record<string, string | number>) => o as CSSProperties;

const spots = [
  { x: 33, y: 62, title: "Kitchen sink & disposal", text: "Slow drains, leaky faucets, new island sinks and pot-fillers.", href: "/services/drain-cleaning/" },
  { x: 52, y: 30, title: "Upstairs bathroom", text: "Showers, tubs and vanities fitted to a showroom finish.", href: "/services/bathroom-kitchen/" },
  { x: 80, y: 60, title: "Water heater", text: "Tank, tankless and heat-pump units, installed same day.", href: "/services/water-heaters/" },
  { x: 64, y: 44, title: "Hidden pipe runs", text: "Thermal imaging finds leaks inside walls without demolition.", href: "/services/leak-detection/" },
  { x: 20, y: 78, title: "Main line", text: "Camera inspection and hydro-jetting for the line to the street.", href: "/services/repiping/" },
];

export default function Home() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: brand.full, url: `${SITE_URL}/` }} />
      {/* ---------------- HERO ---------------- */}
      <section className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper">
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(60%_70%_at_75%_45%,#16304f_0%,#07111f_70%)]" />
        <div aria-hidden="true" className="absolute right-[8%] top-[22%] -z-10 h-[34rem] w-[34rem] rounded-full bg-brass/25 blur-[140px]" />
                <div className="mx-auto flex w-full max-w-[88rem] flex-1 flex-col justify-center px-5 pb-10 pt-32 md:px-10">
          <p className="mx-blur-up inline-flex w-fit items-center gap-3 rounded-full bg-white/5 px-4 py-2 text-sm text-bone/85 ring-1 ring-white/10 backdrop-blur">
            <span className="live-dot" aria-hidden="true" /> 7 plumbers on shift now · avg. arrival <b className="text-paper">54 min</b>
          </p>
          <h1 className="h-mega mt-8 max-w-[11ch]">
            <span className="mx-words block" style={v({ "--start": "150ms" })}>
              {"Water goes where".split(" ").map((w, i) => <span key={i} style={v({ "--i": i * 3 })}>{w}&nbsp;</span>)}
            </span>
            <span className="mx-words brass-text block pb-3" style={v({ "--start": "450ms" })}>
              {"we tell it.".split(" ").map((w, i) => <span key={i} style={v({ "--i": i * 3 })}>{w}&nbsp;</span>)}
            </span>
          </h1>
          <p className="mx-blur-up mt-8 max-w-md text-lg text-bone/75 md:text-xl" style={v({ "--i": 8 })}>
            Licensed Austin plumbers who show up fast, quote a fixed price before touching a thing, and leave your home cleaner than they found it.
          </p>
          <div className="mx-blur-up mt-10 flex flex-wrap gap-3" style={v({ "--i": 10 })}>
            <Btn href="/contact/">Book a plumber</Btn>
            <Btn href={`tel:${brand.tel}`} variant="sos">Emergency? Call now</Btn>
          </div>
          <Hero3D className="relative -mx-5 -my-4 h-[22rem] sm:h-[28rem] lg:absolute lg:inset-0 lg:-z-10 lg:m-0 lg:h-auto" />
          <div className="mx-blur-up mt-auto grid grid-cols-3 gap-4 pt-8 text-xs text-bone/70 sm:gap-6 sm:text-sm md:max-w-3xl lg:pt-16" style={v({ "--i": 12 })}>
            <div><Stars /><p className="mt-1"><b className="text-paper">{brand.rating}/5</b> from {brand.reviews} Google reviews</p></div>
            <div><p className="font-display text-2xl font-bold text-paper">$0</p><p>call-out fee on booked visits</p></div>
            <div><p className="font-display text-2xl font-bold text-paper">1 year</p><p>warranty on every repair</p></div>
          </div>
        </div>
      </section>

      {/* ---------------- MARQUEE ---------------- */}
      <div className="relative z-10 -mt-px overflow-hidden bg-brass py-5 text-ink">
        <Marquee period="38s">
          {["Leaks & Repairs", "Drain Cleaning", "Water Heaters", "Bathrooms & Kitchens", "Repiping", "24/7 Emergencies", "Leak Detection"].map((t) => (
            <span key={t} className="font-display flex items-center gap-8 pr-8 text-3xl font-bold tracking-tight md:text-5xl">
              {t}<svg width="26" height="34" viewBox="0 0 26 34" aria-hidden="true"><path d="M13 1C13 1 1 15 1 22a12 12 0 0 0 24 0C25 15 13 1 13 1z" fill="#07111f" /></svg>
            </span>
          ))}
        </Marquee>
      </div>

      {/* ---------------- INTRO + STATS ---------------- */}
      <section className="bg-paper py-24 md:py-36">
        <div className="mx-auto grid max-w-[88rem] gap-14 px-5 md:px-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="img-reveal relative aspect-[4/5] w-full rounded-blob">
            <Art k="hands" alt="Plumber tightening a brass fitting on new copper pipes under a sink" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center gap-4 rounded-2xl bg-ink/80 p-4 text-paper backdrop-blur-md">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-aqua font-bold text-ink">✓</span>
              <p className="text-sm"><b>Fixed price approved</b><br /><span className="text-bone/60">Leak under kitchen sink · $164</span></p>
            </div>
          </div>
          <div>
            <Eyebrow className="mx-blur-up mx-on-view mb-6 text-brass-3">Why Austin calls us</Eyebrow>
            <h2 className="h-xl mx-blur-up mx-on-view">Plumbing, minus the <span className="text-brass-3">guesswork.</span></h2>
            <p className="mx-blur-up mx-on-view mt-8 max-w-xl text-lg text-ink/70">Every visit starts with a diagnosis you can see: camera footage, thermal images, photos. Then a fixed price on the tablet. You approve it, we fix it. No surprises on the invoice, ever.</p>
            <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10">
              {[["54", "min", "average emergency arrival"], ["12,400", "+", "Austin jobs completed"], ["4.9", "★", "from 1,280 reviews"], ["24", "/7", "a real person answers"]].map(([n, u, l], i) => (
                <div key={l} className="mx-rise mx-on-view border-t-2 border-ink pt-5" style={v({ "--i": i })}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"><RollingNumber value={n} />{u && <span className="text-brass">{u}</span>}</dd>
                  <dd className="mt-2 text-ink/60">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section className="bg-bone py-24 md:py-36">
        <div className="mx-auto max-w-[88rem] px-5 md:px-10">
          <SectionHead eyebrow="Services" title="Big problem? Small problem?" accent="Same crew." text="Six things we do every single day. Hover a service to peek, click for prices, process and FAQs." className="mb-14" />
          <ServiceReveal items={services} />
        </div>
      </section>

      {/* ---------------- EMERGENCY ---------------- */}
      <section className="grain relative isolate overflow-hidden bg-[#140b0a] py-24 text-paper md:py-36">
        <div className="absolute inset-0 -z-10 opacity-40"><Photo k="redValve" alt="" className="drift" /></div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#140b0a] via-[#140b0a]/85 to-transparent" />
        <div className="mx-auto grid max-w-[88rem] gap-14 px-5 md:px-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mx-blur-up mx-on-view inline-flex items-center gap-2 rounded-full bg-signal px-4 py-1.5 text-xs font-bold uppercase tracking-widest"><span className="live-dot !bg-white" aria-hidden="true" /> Emergency line open</p>
            <p aria-hidden="true" className="font-display mx-blur-up mx-on-view mt-8 text-[clamp(5rem,16vw,13rem)] font-extrabold leading-[.8] tracking-[-0.06em] text-signal">2:14<span className="text-paper/30">am</span></p>
            <h2 className="h-lg mx-blur-up mx-on-view mt-6 max-w-lg">Burst pipe at 2am? You&apos;ll talk to a human by 2:15.</h2>
          </div>
          <ol className="space-y-4">
            {services[0].steps.map((s, i) => (
              <li key={s.t} className="mx-rise mx-on-view flex gap-5 rounded-3xl bg-white/[.06] p-6 ring-1 ring-white/10 backdrop-blur" style={v({ "--i": i })}>
                <span className="font-display grid h-12 w-12 shrink-0 place-items-center rounded-full bg-signal text-lg font-bold">{i + 1}</span>
                <span><b className="font-display text-xl">{s.t}</b><span className="mt-1 block text-bone/70">{s.d}</span></span>
              </li>
            ))}
            <li className="pt-4"><Btn href={`tel:${brand.tel}`} variant="sos">Call {brand.phone}</Btn></li>
          </ol>
        </div>
      </section>

      {/* ---------------- HOUSE CUTAWAY ---------------- */}
      <section className="bg-ink py-24 text-paper md:py-36">
        <div className="mx-auto max-w-[88rem] px-5 md:px-10">
          <SectionHead dark eyebrow="Whole-home care" title="Every pipe in your house," accent="one number to call." text="Tap the markers to see what we look after, from the kitchen sink to the line under your lawn." className="mb-14" />
          <Hotspots spots={spots}>
            <div className="img-reveal aspect-[3/2] w-full rounded-blob bg-ink-2"><Art k="house" alt="Cutaway illustration of a home showing hot and cold water pipes to every room" /></div>
          </Hotspots>
        </div>
      </section>

      {/* ---------------- PROCESS (pipe draws as you scroll) ---------------- */}
      <section className="story-scope relative bg-paper py-24 md:py-36">
        <div className="mx-auto max-w-[88rem] px-5 md:px-10">
          <SectionHead eyebrow="How a visit flows" title="Four steps." accent="Zero surprises." className="mb-16" />
          <div className="relative">
            <svg aria-hidden="true" className="absolute left-6 top-0 h-full w-6 md:left-1/2 md:-ml-3" viewBox="0 0 24 1000" preserveAspectRatio="none">
              <path d="M12 0V1000" stroke="#e7dfd0" strokeWidth="14" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <path d="M12 0V1000" stroke="url(#pg)" strokeWidth="14" strokeLinecap="round" pathLength={1} className="pipe-draw" vectorEffect="non-scaling-stroke" />
              <defs><linearGradient id="pg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f6c76b" /><stop offset=".5" stopColor="#e2a33b" /><stop offset="1" stopColor="#46e3d6" /></linearGradient></defs>
            </svg>
            <ol className="space-y-20 md:space-y-32">
              {[
                { t: "Book in 60 seconds", d: "Online or by phone. Pick a two-hour window, or ASAP for emergencies.", k: "planner" as const },
                { t: "Meet your plumber", d: "You get their name, photo and live ETA by text. Shoe covers on at the door.", k: "plumber" as const },
                { t: "See it, then approve it", d: "Camera footage and a fixed written price on the tablet before any work.", k: "handsBlue" as const },
                { t: "Fixed, tested, spotless", d: "Pressure-tested, photographed, cleaned up. 1-year warranty in your inbox.", k: "faucetStream" as const },
              ].map((s, i) => (
                <li key={s.t} className={`relative grid items-center gap-8 pl-16 md:grid-cols-2 md:gap-20 md:pl-0 ${i % 2 ? "" : "md:[&>*:first-child]:order-2"}`}>
                  <span className="font-display absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-full bg-ink text-lg font-bold text-brass md:left-1/2 md:top-1/2 md:-ml-6 md:-mt-6">{i + 1}</span>
                  <div className="img-reveal aspect-[4/3] w-full rounded-blob"><Photo k={s.k} alt="" sizes="(min-width:768px) 45vw, 100vw" /></div>
                  <div className={i % 2 ? "md:pl-10" : "md:pr-10 md:text-right"}>
                    <h3 className="h-lg mx-blur-up mx-on-view">{s.t}</h3>
                    <p className="mx-blur-up mx-on-view mt-4 text-lg text-ink/65 md:inline-block md:max-w-sm">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------- BEFORE / AFTER ---------------- */}
      <section className="bg-bone py-24 md:py-36">
        <div className="mx-auto max-w-[88rem] px-5 md:px-10">
          <SectionHead eyebrow="Drag to compare" title="1962 galvanized pipes" accent="→ new copper." text="A Zilker repipe finished in two days, with the family living at home the whole time." className="mb-12" />
          <div className="mx-zoom-soft mx-on-view"><BeforeAfter before="wallPipes" after="copperWarm" beforeLabel="1962" afterLabel="2026" alt="Old pipes compared to new copper pipes" /></div>
        </div>
      </section>

      {/* ---------------- GALLERY BENTO ---------------- */}
      <section className="overflow-hidden bg-paper py-24 md:py-36">
        <div className="mx-auto max-w-[88rem] px-5 md:px-10">
          <SectionHead eyebrow="Recent work" title="Pipes you'll never see." accent="Rooms you'll love." className="mb-14" />
          <div className="grid auto-rows-[14rem] grid-cols-2 gap-4 md:auto-rows-[18rem] md:grid-cols-4">
            {[
              { a: "bath" as const, c: "row-span-2", label: "Brass rain shower · Tarrytown" },
              { k: "kitchen" as const, c: "col-span-2", label: "Island sink + pot filler · Mueller" },
              { k: "copperCoil" as const, c: "", label: "Copper manifold" },
              { k: "tub" as const, c: "row-span-2", label: "Freestanding tub · Hyde Park" },
              { k: "copperHeater" as const, c: "", label: "Water heater swap" },
              { k: "vanity" as const, c: "col-span-2 md:col-span-1", label: "Double vanity · Westlake" },
              { k: "darkSink" as const, c: "col-span-2 md:col-span-1", label: "Matte black kitchen" },
            ].map((g, i) => (
              <figure key={i} className={`img-reveal group relative overflow-hidden rounded-[1.75rem] ${g.c}`}>
                {"a" in g ? <Art k={g.a!} alt={g.label} className="transition-transform duration-700 group-hover:scale-105" /> : <Photo k={g.k!} alt={g.label} sizes="(min-width:768px) 50vw, 100vw" className="transition-transform duration-700 group-hover:scale-105" />}
                <figcaption className="absolute bottom-3 left-3 translate-y-2 rounded-full bg-paper/90 px-3 py-1.5 text-xs font-semibold text-ink opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">{g.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- REVIEWS ---------------- */}
      <section className="overflow-hidden bg-ink py-24 text-paper md:py-36">
        <div className="mx-auto max-w-[88rem] px-5 md:px-10">
          <SectionHead dark eyebrow="Reviews" title="4.9 stars," accent="1,280 neighbors." text="Drag the cards. These are the reviews that made our crew's week." className="mb-12" />
        </div>
        <DragRail className="px-5 md:px-10">
          {[...reviews, ...reviews.slice(0, 2)].map((r, i) => (
            <figure key={i} className="mx-rise mx-on-view w-[19rem] shrink-0 snap-start rounded-[1.75rem] bg-ink-3 p-7 ring-1 ring-white/10 md:w-[26rem]" style={v({ "--i": i % 4 })}>
              <Stars />
              <blockquote className="font-display mt-5 text-xl leading-snug tracking-tight md:text-2xl">&ldquo;{r.text}&rdquo;</blockquote>
              <figcaption className="mt-8 flex items-center justify-between text-sm">
                <span><b>{r.name}</b><span className="block text-bone/55">{r.area}</span></span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-brass-2">{r.job}</span>
              </figcaption>
            </figure>
          ))}
        </DragRail>
      </section>

      {/* ---------------- PLANS ---------------- */}
      <section className="bg-paper py-24 md:py-36">
        <div className="mx-auto max-w-[88rem] px-5 md:px-10">
          <SectionHead eyebrow="Pricing" title="Honest prices," accent="written down first." text="See our full price list or try the estimator on the pricing page." className="mb-14" />
          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((p, i) => (
              <Tilt key={p.name} max={6} className={`mx-rise mx-on-view flex flex-col rounded-blob p-8 ${p.featured ? "bg-ink text-paper" : "bg-bone"}`} style={v({ "--i": i })}>
                {p.featured && <span className="pop absolute right-6 top-6 rounded-full bg-brass px-3 py-1 text-xs font-bold text-ink">Most popular</span>}
                <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                <p className="pop mt-6"><span className="font-display text-6xl font-bold tracking-tight">{p.price}</span> <span className={p.featured ? "text-bone/60" : "text-ink/55"}>{p.per}</span></p>
                <p className={`mt-4 ${p.featured ? "text-bone/70" : "text-ink/65"}`}>{p.desc}</p>
                <ul className="mt-8 flex-1 space-y-3">{p.items.map((it) => <li key={it} className="flex gap-3"><span className={p.featured ? "text-aqua" : "text-brass-3"}>✓</span>{it}</li>)}</ul>
                <Btn href={p.name === "Project" ? "/contact/" : "/pricing/"} variant={p.featured ? "brass" : "ink"} className="mt-10 self-start">{p.cta}</Btn>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="bg-bone py-24 md:py-32">
        <div className="mx-auto grid max-w-[88rem] gap-12 px-5 md:px-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHead eyebrow="FAQ" title="Questions," accent="answered." />
            <Link href="/faq/" className="mt-8 inline-block font-semibold underline underline-offset-4">All FAQs</Link>
          </div>
          <div className="divide-y divide-ink/15 border-y border-ink/15">
            {faqs.slice(0, 5).map((f, i) => (
              <details key={f.q} className="group py-2" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-xl font-semibold"><span>{f.q}</span><span className="acc-icon grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 ring-ink/20 text-xl" aria-hidden="true">+</span></summary>
                <p className="max-w-2xl pb-5 text-ink/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
