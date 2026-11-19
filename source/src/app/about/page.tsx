import { pageMeta } from "@/lib/meta";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Art, CtaBand, Eyebrow, JsonLd, PageHero, Photo, SectionHead } from "@/components/ui";
import { RollingNumber } from "@/components/mx";
import { Tilt } from "@/components/interactive";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/about/", `About Our Licensed Austin Plumbing Team`, `Meet Brass & Bolt, a family-run crew of licensed Austin plumbers since 2009. Fixed written prices, spotless work, and plumbers who explain the why.`);

const team = [
  { n: "Marco Ruiz", r: "Founder · Master Plumber", k: "plumber" as const },
  { n: "Dana Okafor", r: "Lead, leak detection", k: "handsBlue" as const },
  { n: "Sam Whitley", r: "Water heater specialist", k: "heaterInstall" as const },
  { n: "Priya Nair", r: "Remodel project lead", k: "planner" as const },
];
const values = [
  { t: "Talk like humans", d: "No jargon, no upsell scripts. We explain what broke and why, with photos." },
  { t: "Price it first", d: "A fixed written price before any work. If we're wrong, that's on us." },
  { t: "Respect the house", d: "Shoe covers, drop cloths and a vacuum on every truck. Always." },
  { t: "Fix the cause", d: "Clearing a clog is easy. Making sure it never comes back is the job." },
];

export default function About() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about/` }] }} />
      <PageHero eyebrow="About us" title="A small crew with" accent="a big wrench." lede="Marco started Brass & Bolt in 2009 with one van and a promise: tell people the price before you start. Seventeen years and 12,400 jobs later, that's still the whole business plan." art="team" crumbs={[{ href: "/", label: "Home" }, { label: "About" }]} />

      <section className="bg-paper py-24 md:py-32">
        <div className="mx-auto max-w-[88rem] px-5 md:px-10">
          <p className="font-display mx-blur-up mx-on-view max-w-5xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            We&apos;re plumbers, not salespeople. <span className="text-ink/35">Our crew is paid by the hour, not by the upsell, so the cheapest honest fix is always the one we recommend first.</span>
          </p>
          <dl className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[["2009", "founded in Austin"], ["14", "licensed plumbers"], ["9", "fully stocked trucks"], ["12,400", "jobs completed"]].map(([n, l], i) => (
              <div key={l} className="mx-rise mx-on-view border-t-2 border-ink pt-5" style={{ "--i": i } as CSSProperties}><dt className="sr-only">{l}</dt><dd className="font-display text-5xl font-bold tracking-tight md:text-6xl"><RollingNumber value={n} /></dd><dd className="mt-2 text-ink/60">{l}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-ink py-24 text-paper md:py-32">
        <div className="mx-auto max-w-[88rem] px-5 md:px-10">
          <SectionHead dark eyebrow="How we work" title="Good work." accent="No guesswork." className="mb-14" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {values.map((x, i) => (
              <div key={x.t} className="mx-rise mx-on-view rounded-blob bg-ink-3 p-8 ring-1 ring-white/10" style={{ "--i": i } as CSSProperties}>
                <span className="font-display text-5xl font-bold text-brass">0{i + 1}</span>
                <h3 className="font-display mt-10 text-2xl font-bold">{x.t}</h3>
                <p className="mt-3 text-bone/65">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bone py-24 md:py-32">
        <div className="mx-auto max-w-[88rem] px-5 md:px-10">
          <SectionHead eyebrow="The crew" title="Faces you'll see" accent="at your door." text="Every plumber is licensed, background-checked and trained in-house for a year before they go solo." className="mb-14" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {team.map((m, i) => (
              <Tilt key={m.n} max={8} className="mx-rise mx-on-view rounded-[1.75rem]" style={{ "--i": i } as CSSProperties}>
                <figure className="overflow-hidden rounded-[1.75rem] bg-paper">
                  <div className="aspect-[3/4] overflow-hidden"><Photo k={m.k} alt={`${m.n}, ${m.r} (illustrative photo)`} sizes="(min-width:768px) 25vw, 50vw" /></div>
                  <figcaption className="p-5"><b className="font-display text-lg">{m.n}</b><span className="block text-sm text-ink/60">{m.r}</span></figcaption>
                </figure>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24 md:py-32">
        <div className="mx-auto grid max-w-[88rem] gap-14 px-5 md:px-10 lg:grid-cols-2 lg:items-center">
          <div className="img-reveal aspect-[4/5] rounded-blob"><Art k="bath" alt="Bathroom with brass rain shower fitted by our remodel team" /></div>
          <div>
            <Eyebrow className="mx-blur-up mx-on-view mb-6 text-brass-3">Our promise</Eyebrow>
            <h2 className="h-xl mx-blur-up mx-on-view">If it leaks again, <span className="text-brass-3">we come back free.</span></h2>
            <ul className="mt-10 space-y-4 text-lg">
              {["1-year warranty on every repair", "Up to 12 years on new water heaters", "Lifetime workmanship on repipes", "$2M liability insurance (demo)"].map((x, i) => (
                <li key={x} className="mx-blur-left mx-on-view flex items-center gap-4" style={{ "--i": i } as CSSProperties}><span className="grid h-8 w-8 place-items-center rounded-full bg-brass text-sm font-bold">✓</span>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <CtaBand title="Want us on your side?" accent="Save our number." />
    </>
  );
}
