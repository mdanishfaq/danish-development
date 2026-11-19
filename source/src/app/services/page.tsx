import { pageMeta } from "@/lib/meta";
import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { CtaBand, JsonLd, PageHero, Photo } from "@/components/ui";
import { Tilt } from "@/components/interactive";
import { services, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/services/", `Austin Plumbing Services, Repairs & Repipes`, `Emergency plumbing, leak detection, drain cleaning, water heaters, bathroom and kitchen plumbing and whole-home repiping across Austin. Fixed prices, 24/7.`);

export default function Services() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services/` }] }} />
      <PageHero eyebrow="Services" title="Everything that" accent="carries water." lede="Six services, one standard: diagnose it properly, price it in writing, fix it so it stays fixed." photo="manifold" crumbs={[{ href: "/", label: "Home" }, { label: "Services" }]} />
      <section className="bg-paper py-24 md:py-32">
        <div className="mx-auto grid max-w-[88rem] gap-6 px-5 md:grid-cols-2 md:px-10 lg:grid-cols-3">
          {services.map((s, i) => (
            <Tilt key={s.slug} max={5} className="mx-rise mx-on-view rounded-blob" style={{ "--i": i % 3 } as CSSProperties}>
              <Link href={`/services/${s.slug}/`} className="group flex h-full flex-col overflow-hidden rounded-blob bg-bone">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Photo k={s.img} alt="" sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" className="transition-transform duration-[1.2s] [transition-timing-function:var(--ease-expo)] group-hover:scale-110" />
                  <span className="pop absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-bold text-brass-2 backdrop-blur">{s.tag}</span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h2 className="font-display text-3xl font-bold tracking-tight">{s.name}</h2>
                  <p className="mt-3 flex-1 text-ink/65">{s.short}</p>
                  <div className="mt-7 flex items-center justify-between border-t border-ink/10 pt-5">
                    <span className="text-sm"><span className="text-ink/50">From </span><b className="font-display text-xl">{s.from}</b></span>
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-brass transition-transform duration-500 group-hover:-rotate-45" aria-hidden="true">→</span>
                  </div>
                </div>
              </Link>
            </Tilt>
          ))}
        </div>
      </section>
      <CtaBand title="Not sure what it is?" accent="We'll find out." text="Book a diagnostic visit. The fee is waived if you go ahead with the repair." />
    </>
  );
}
