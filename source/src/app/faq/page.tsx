import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { CtaBand, Crumbs, JsonLd, Wave } from "@/components/ui";
import { faqs, services, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/faq/", "Plumbing FAQ: Prices, Timing, Warranty & Gus", "Answers to the questions Phoenix homeowners ask Gus & Co. most: pricing, arrival times, warranties, emergencies and every service we offer.");

export default function Faq() {
  const groups = [{ id: "general", name: "General", list: faqs }, ...services.map((s) => ({ id: s.slug, name: `${s.emoji} ${s.name}`, list: s.faq }))];
  return (
    <>
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: groups.flatMap((g) => g.list).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "FAQ", item: `${SITE_URL}/faq/` }] },
      ]} />
      <section className="px-5 pb-12 pt-32 md:px-10 md:pt-40" style={{ background: "#ece6ff" }}>
        <div className="mx-auto max-w-[84rem]">
          <Crumbs items={[{ href: "/", label: "Home" }, { label: "FAQ" }]} />
          <h1 className="h-mega mt-6"><span className="hero-words">{"Ask Gus anything.".split(" ").map((w, i) => <span key={i} style={{ ["--i" as string]: i }}>{w}&nbsp;</span>)}</span></h1>
          <p className="mt-6 max-w-xl text-xl text-navy/80">Still stuck? Call us. A real person answers 24/7.</p>
        </div>
      </section>
      <Wave from="#ece6ff" to="#fffaf0" />
      <section className="bg-cream px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-4xl space-y-14">
          {groups.map((g) => (
            <section key={g.id} id={g.id} className="scroll-mt-28">
              <h2 className="h-lg mb-5">{g.name}</h2>
              <div className="space-y-3">{g.list.map((f) => (
                <details key={f.q} className="card-toy bg-white px-6">
                  <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-xl font-semibold">{f.q}<span className="acc-icon grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-2 text-2xl" aria-hidden="true">+</span></summary>
                  <p className="pb-6 text-navy/80">{f.a}</p>
                </details>
              ))}</div>
            </section>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
