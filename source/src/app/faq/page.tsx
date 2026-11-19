import { pageMeta } from "@/lib/meta";
import type { Metadata } from "next";
import { CtaBand, JsonLd, PageHero } from "@/components/ui";
import { faqs, services, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/faq/", `Plumbing FAQ: Prices, Arrival & Warranty`, `Answers to what Austin homeowners ask us most: how fast we arrive, how pricing works, warranties, financing, licensing and how we clean up after a job.`);

export default function Faq() {
  const all = [...faqs, ...services.flatMap((s) => s.faq)];
  return (
    <>
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: all.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "FAQ", item: `${SITE_URL}/faq/` }] },
      ]} />
      <PageHero eyebrow="FAQ" title="Good questions." accent="Clear answers." lede="If yours isn't here, call us. A real plumber answers, and we're happy to talk you through it for free." photo="faucetSplash" crumbs={[{ href: "/", label: "Home" }, { label: "FAQ" }]} />
      <section className="bg-paper py-24 md:py-32">
        <div className="mx-auto grid max-w-[88rem] gap-14 px-5 md:px-10 lg:grid-cols-[1fr_2fr]">
          <nav aria-label="FAQ topics" className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow mb-4 text-brass-3">Topics</p>
            <ul className="space-y-2 text-lg">
              <li><a href="#general" className="hover:text-brass-3">General</a></li>
              {services.map((s) => <li key={s.slug}><a href={`#${s.slug}`} className="hover:text-brass-3">{s.name}</a></li>)}
            </ul>
          </nav>
          <div className="space-y-16">
            {[{ id: "general", name: "General", list: faqs }, ...services.map((s) => ({ id: s.slug, name: s.name, list: s.faq }))].map((g) => (
              <section key={g.id} id={g.id} className="scroll-mt-28">
                <h2 className="h-lg mb-6">{g.name}</h2>
                <div className="divide-y divide-ink/15 border-y border-ink/15">
                  {g.list.map((f) => (
                    <details key={f.q} className="py-2">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-xl font-semibold"><span>{f.q}</span><span className="acc-icon grid h-10 w-10 shrink-0 place-items-center rounded-full text-xl ring-1 ring-ink/20" aria-hidden="true">+</span></summary>
                      <p className="max-w-2xl pb-5 text-ink/70">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
