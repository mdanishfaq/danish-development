import { pageMeta } from "@/lib/meta";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Btn, CtaBand, JsonLd, PageHero, SectionHead } from "@/components/ui";
import { Estimator, Tilt } from "@/components/interactive";
import { plans, priceList, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/pricing/", `Austin Plumbing Prices: Fixed & Upfront`, `See typical Austin plumbing prices for leaks, drains, toilets, water heaters and repiping, try the instant estimator, or join Care Club for 15% off.`);

export default function Pricing() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Pricing", item: `${SITE_URL}/pricing/` }] }} />
      <PageHero eyebrow="Pricing" title="Prices you see" accent="before we start." lede="Most plumbers won't publish prices. We do, because surprises belong in birthday parties, not invoices." photo="toolBelt" crumbs={[{ href: "/", label: "Home" }, { label: "Pricing" }]} />
      <section className="bg-paper py-24 md:py-32">
        <div className="mx-auto max-w-[88rem] px-5 md:px-10">
          <SectionHead eyebrow="Instant estimate" title="What will it" accent="cost?" text="Pick a job and see the price range most Austin homes pay. Your plumber confirms a fixed price on site." className="mb-12" />
          <Estimator />
        </div>
      </section>
      <section className="bg-bone py-24 md:py-32">
        <div className="mx-auto max-w-[88rem] px-5 md:px-10">
          <SectionHead eyebrow="Plans" title="Pay per job," accent="or never worry again." className="mb-14" />
          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((p, i) => (
              <Tilt key={p.name} max={6} className={`mx-rise mx-on-view flex flex-col rounded-blob p-8 ${p.featured ? "bg-ink text-paper" : "bg-paper"}`} style={{ "--i": i } as CSSProperties}>
                {p.featured && <span className="pop absolute right-6 top-6 rounded-full bg-brass px-3 py-1 text-xs font-bold text-ink">Most popular</span>}
                <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                <p className="pop mt-6"><span className="font-display text-6xl font-bold tracking-tight">{p.price}</span> <span className={p.featured ? "text-bone/60" : "text-ink/55"}>{p.per}</span></p>
                <p className={`mt-4 ${p.featured ? "text-bone/70" : "text-ink/65"}`}>{p.desc}</p>
                <ul className="mt-8 flex-1 space-y-3">{p.items.map((it) => <li key={it} className="flex gap-3"><span className={p.featured ? "text-aqua" : "text-brass-3"}>✓</span>{it}</li>)}</ul>
                <Btn href="/contact/" variant={p.featured ? "brass" : "ink"} className="mt-10 self-start">{p.cta}</Btn>
              </Tilt>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-paper py-24 md:py-32">
        <div className="mx-auto grid max-w-[88rem] gap-12 px-5 md:px-10 lg:grid-cols-[1fr_1.5fr]">
          <SectionHead eyebrow="Price list" title="Typical" accent="Austin prices." text="Ranges include parts and labour for a standard home. Prices are illustrative for this demo." />
          <table className="w-full text-left">
            <caption className="sr-only">Typical plumbing prices</caption>
            <thead><tr className="border-b-2 border-ink text-sm uppercase tracking-widest text-ink/50"><th className="py-3 font-semibold">Job</th><th className="py-3 text-right font-semibold">Typical price</th></tr></thead>
            <tbody>
              {priceList.map((r, i) => (
                <tr key={r.job} className="mx-blur-up mx-on-view group border-b border-ink/10 transition-colors hover:bg-bone" style={{ "--i": i } as CSSProperties}>
                  <td className="py-5 pl-2 text-lg font-semibold transition-transform duration-500 group-hover:translate-x-2">{r.job}</td>
                  <td className="font-display py-5 pr-2 text-right text-xl font-bold">{r.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <CtaBand title="Want an exact number?" accent="Ask for a free quote." />
    </>
  );
}
