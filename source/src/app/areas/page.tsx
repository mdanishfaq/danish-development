import { pageMeta } from "@/lib/meta";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { CtaBand, JsonLd, PageHero, Photo, SectionHead } from "@/components/ui";
import { AreaMap } from "@/components/interactive";
import { areas, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/areas/", `Plumber Service Areas Across Greater Austin`, `Our plumbers cover 12 Austin-area neighborhoods, from Downtown and Zilker to Round Rock, Cedar Park and Buda. Check your area and typical arrival time.`);

export default function Areas() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Service areas", item: `${SITE_URL}/areas/` }] }} />
      <PageHero eyebrow="Service areas" title="Nine trucks." accent="Twelve neighborhoods." lede="Our vans are parked across Austin overnight, so wherever you are, the nearest plumber is rarely more than an hour away." photo="house" crumbs={[{ href: "/", label: "Home" }, { label: "Areas" }]} />
      <section className="bg-ink pb-24 text-paper md:pb-32">
        <div className="mx-auto max-w-[88rem] px-5 md:px-10"><AreaMap /></div>
      </section>
      <section className="bg-paper py-24 md:py-32">
        <div className="mx-auto max-w-[88rem] px-5 md:px-10">
          <SectionHead eyebrow="Local knowledge" title="We know what's" accent="under your street." text="Austin's mix of 1950s galvanized pipe, hard water and clay soil causes very local problems. Here's what we see most." className="mb-14" />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { t: "Central & East Austin", d: "Older homes with galvanized and cast-iron lines. Lots of repipes and camera inspections.", k: "wallPipes" as const },
              { t: "West Lake Hills & Westlake", d: "Hillside homes, high pressure, big water heaters. Pressure-reducing valves are our friends.", k: "copperHeater" as const },
              { t: "North suburbs", d: "Newer builds with PEX and slab foundations, so slab leaks and fixture upgrades top the list.", k: "house2" as const },
            ].map((c, i) => (
              <article key={c.t} className="mx-rise mx-on-view overflow-hidden rounded-blob bg-bone" style={{ "--i": i } as CSSProperties}>
                <div className="aspect-[16/10] overflow-hidden"><Photo k={c.k} alt="" sizes="(min-width:768px) 33vw, 100vw" /></div>
                <div className="p-7"><h3 className="font-display text-2xl font-bold">{c.t}</h3><p className="mt-3 text-ink/65">{c.d}</p></div>
              </article>
            ))}
          </div>
          <p className="mt-14 text-ink/60">Full list: {areas.map((a) => a.name).join(", ")}.</p>
        </div>
      </section>
      <CtaBand title="In the area?" accent="We're nearby." />
    </>
  );
}
