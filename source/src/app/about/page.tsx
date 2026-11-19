import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { CtaBand, Crumbs, JsonLd, Wave } from "@/components/ui";
import { poster, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/about/", "Meet Gus: Phoenix's Friendliest Plumbing Crew", "Meet Gus and the Gus & Co. crew: licensed, background-checked Phoenix plumbers who quote first, explain everything and clean up after.");

const crew = [
  { n: "Gus", r: "Head plumber & mascot", e: "🧔", c: "#ffe69a" }, { n: "Rosa", r: "Leak detective", e: "🕵️‍♀️", c: "#d8f0ff" },
  { n: "Malik", r: "Water heater whiz", e: "🔥", c: "#ffe2df" }, { n: "June", r: "Fixture finisher", e: "🚿", c: "#ece6ff" },
];
const values = [
  { t: "Price first", d: "A fixed, written price before any work. Always.", e: "💵" },
  { t: "Explain everything", d: "Photos and plain words, never jargon.", e: "💬" },
  { t: "Leave it cleaner", d: "Shoe covers on, drop cloths down, mess gone.", e: "🧽" },
  { t: "Fix the cause", d: "We stop the problem coming back.", e: "🛠️" },
];

export default function About() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Meet Gus", item: `${SITE_URL}/about/` }] }} />
      <section className="bg-sun-2 px-5 pb-12 pt-32 md:px-10 md:pt-40">
        <div className="mx-auto grid max-w-[84rem] items-center gap-8 lg:grid-cols-2">
          <div>
            <Crumbs items={[{ href: "/", label: "Home" }, { label: "Meet Gus" }]} />
            <h1 className="h-mega mt-6"><span className="hero-words">{"Hi, I'm Gus. Nice to meet you!".split(" ").map((w, i) => <span key={i} style={{ ["--i" as string]: i }}>{w}&nbsp;</span>)}</span></h1>
            <p className="mt-6 max-w-xl text-xl text-navy/80">Gus started with one van and one rule: tell people the price before you touch a pipe. Today the whole crew works the same way, all over the Phoenix valley.</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster("finale")} alt="Gus celebrating in front of a happy home" width={1200} height={900} className="bob hidden w-full lg:block" />
        </div>
      </section>
      <Wave from="#ffe69a" to="#fffaf0" />
      <section className="bg-cream px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[84rem]">
          <h2 className="h-xl">The Gus code</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((x, i) => (
              <div key={x.t} className="card-toy wobble bg-white p-8" style={{ rotate: `${[-1, 1, -0.5, 0.8][i]}deg` }}>
                <span className="text-5xl" aria-hidden="true">{x.e}</span>
                <h3 className="font-display mt-5 text-2xl font-bold">{x.t}</h3><p className="mt-2 text-navy/80">{x.d}</p>
              </div>
            ))}
          </div>
          <h2 className="h-xl mt-24">The crew</h2>
          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {crew.map((m) => (
              <div key={m.n} className="card-toy wobble p-8 text-center" style={{ background: m.c }}>
                <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-white text-5xl" aria-hidden="true">{m.e}</span>
                <h3 className="font-display mt-5 text-2xl font-bold">{m.n}</h3><p className="text-navy/75">{m.r}</p>
              </div>
            ))}
          </div>
          <dl className="mt-24 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[["2011", "first van"], ["9", "vans on the road"], ["18k+", "jobs done"], ["4.9★", "2,140 reviews"]].map(([n, l]) => (
              <div key={l} className="card-toy bg-blue p-8 text-white"><dt className="sr-only">{l}</dt><dd className="font-display text-5xl font-bold">{n}</dd><dd className="mt-1 text-white">{l}</dd></div>
            ))}
          </dl>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
