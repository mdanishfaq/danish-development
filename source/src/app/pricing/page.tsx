import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { Btn, CtaBand, Crumbs, JsonLd, Wave } from "@/components/ui";
import { plans, services, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/pricing/", "Phoenix Plumbing Prices: Fixed & Upfront", "Typical Gus & Co. prices for leak detection, drain cleaning, water heaters, fixtures and 24/7 emergencies in Phoenix, plus the Gus Club membership.");

const list = [
  ["Leak detection scan", "$149–$289"], ["Drain clear (one line)", "$119–$199"], ["Main line hydro-jet", "$349–$599"], ["Water heater repair", "$99–$349"],
  ["Tank water heater install", "$1,590–$2,350"], ["Tankless install", "$3,100–$4,600"], ["Faucet install", "$179–$289"], ["Toilet replace", "$329–$549"], ["Emergency call-out", "$169"],
];

export default function Pricing() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Pricing", item: `${SITE_URL}/pricing/` }] }} />
      <section className="bg-mint/20 px-5 pb-12 pt-32 md:px-10 md:pt-40" style={{ background: "#e6f9e8" }}>
        <div className="mx-auto max-w-[84rem]">
          <Crumbs items={[{ href: "/", label: "Home" }, { label: "Pricing" }]} />
          <h1 className="h-mega mt-6 max-w-4xl"><span className="hero-words">{"No surprises. Just prices.".split(" ").map((w, i) => <span key={i} style={{ ["--i" as string]: i }}>{w}&nbsp;</span>)}</span></h1>
          <p className="mt-6 max-w-xl text-xl text-navy/80">Typical Phoenix prices, written down. Gus confirms a fixed price on site before any work, and you can always say no.</p>
        </div>
      </section>
      <Wave from="#e6f9e8" to="#fffaf0" />
      <section className="bg-cream px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[84rem]">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <div key={p.name} className={`card-toy relative p-8 ${p.featured ? "md:-translate-y-4" : ""}`} style={{ background: p.color }}>
                {p.featured && <span className="chip absolute -top-4 left-8 bg-coral text-white">Most loved</span>}
                <h2 className="font-display text-2xl font-bold">{p.name}</h2>
                <p className="mt-4"><span className="font-display text-6xl font-bold">{p.price}</span> <span className="text-navy/70">{p.per}</span></p>
                <ul className="mt-6 space-y-2">{p.items.map((x) => <li key={x}>✅ {x}</li>)}</ul>
                <Btn href="/contact/" variant={p.featured ? "coral" : "blue"} className="mt-8">Choose {p.name}</Btn>
              </div>
            ))}
          </div>
          <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_1.5fr]">
            <div><h2 className="h-xl">Price list</h2><p className="mt-4 text-lg text-navy/80">Parts and labour included for a standard home. Illustrative prices for this demo.</p></div>
            <div className="card-toy overflow-hidden bg-white">
              <table className="w-full text-left">
                <caption className="sr-only">Typical prices</caption>
                <thead className="bg-navy text-white"><tr><th className="px-6 py-4 font-display text-lg">Job</th><th className="px-6 py-4 text-right font-display text-lg">Typical price</th></tr></thead>
                <tbody>{list.map(([j, p], i) => <tr key={j} className={i % 2 ? "bg-sky-2/60" : ""}><td className="px-6 py-4 font-semibold">{j}</td><td className="font-display px-6 py-4 text-right text-xl font-bold">{p}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
          <p className="mt-10 text-navy/75">See services: {services.map((s) => s.name).join(" · ")}</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
