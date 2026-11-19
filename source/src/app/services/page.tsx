import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";
import { CtaBand, Crumbs, JsonLd, Wave } from "@/components/ui";
import { poster, services, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/services/", "Phoenix Plumbing Services: Leaks, Drains & More", "Leak detection, drain cleaning, water heaters, faucets and fixtures, and 24/7 emergency plumbing across Phoenix. Fixed prices before any work starts.");

export default function Services() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services/` }] }} />
      <section className="bg-sky-2 px-5 pb-16 pt-32 md:px-10 md:pt-40">
        <div className="mx-auto max-w-[84rem]">
          <Crumbs items={[{ href: "/", label: "Home" }, { label: "Services" }]} />
          <h1 className="h-mega mt-6 max-w-4xl"><span className="hero-words">{"What can Gus fix today?".split(" ").map((w, i) => <span key={i} style={{ ["--i" as string]: i }}>{w}&nbsp;</span>)}</span></h1>
          <p className="mt-6 max-w-xl text-xl text-navy/80">Five everyday plumbing jobs, one friendly crew. Click a service to watch Gus do it in 3D.</p>
        </div>
      </section>
      <Wave from="#e9f7ff" to="#fffaf0" />
      <section className="bg-cream px-5 pb-24 md:px-10">
        <div className="mx-auto grid max-w-[84rem] gap-8">
          {services.map((s, i) => (
            <Link key={s.slug} href={`/services/${s.slug}/`} className={`card-toy group grid items-center gap-6 overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1 md:grid-cols-2 md:p-10 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`} style={{ background: s.color }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={poster(s.station)} alt={`Gus doing ${s.name.toLowerCase()}`} width={1200} height={900} loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "auto"} decoding="async" className="aspect-[4/3] w-full object-contain transition-transform duration-500 group-hover:scale-105" />
              <div>
                <p className="chip bg-white text-navy">{s.emoji} From {s.from} · {s.time}</p>
                <h2 className="h-xl mt-4">{s.name}</h2>
                <p className="mt-4 text-lg text-navy/80">{s.short}</p>
                <span className="btn btn-blue mt-8">Watch Gus fix it →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
