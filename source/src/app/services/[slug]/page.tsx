import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/meta";
import { GusStage } from "@/components/gus/GusStage";
import { Btn, CtaBand, Crumbs, JsonLd, Wave } from "@/components/ui";
import { brand, poster, services, SITE_URL } from "@/lib/site";

export function generateStaticParams() { return services.map((s) => ({ slug: s.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const s = services.find((x) => x.slug === slug); if (!s) return {};
  return pageMeta(`/services/${s.slug}/`, `${s.name} in Phoenix, AZ from ${s.from}`, `${s.short} Fixed price before we start, licensed Phoenix plumbers, same-day visits.`);
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const i = services.findIndex((x) => x.slug === slug); if (i < 0) notFound();
  const s = services[i]; const next = services[(i + 1) % services.length]; const url = `${SITE_URL}/services/${s.slug}/`;
  const night = s.station === "emergency";
  return (
    <>
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "Service", name: s.name, serviceType: s.name, description: s.story, url, provider: { "@id": `${SITE_URL}/#business` }, areaServed: "Phoenix, AZ", offers: { "@type": "Offer", priceCurrency: "USD", price: s.from.replace(/[^0-9.]/g, "") } },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services/` }, { "@type": "ListItem", position: 3, name: s.name, item: url }] },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      ]} />
      <section className={`px-5 pb-10 pt-28 md:px-10 md:pt-36 ${night ? "bg-navy text-white" : ""}`} style={night ? undefined : { background: s.color }}>
        <div className="mx-auto grid max-w-[84rem] items-center gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <div className={night ? "[&_*]:!text-white/85" : ""}><Crumbs items={[{ href: "/", label: "Home" }, { href: "/services/", label: "Services" }, { label: s.name }]} /></div>
            <p className={`chip mt-6 ${night ? "bg-coral text-white" : "bg-white text-navy"}`}>{s.emoji} From {s.from} · {s.time}</p>
            <h1 className="h-mega mt-5"><span className="hero-words">{`${s.name} in Phoenix`.split(" ").map((w, k) => <span key={k} style={{ ["--i" as string]: k }}>{w}&nbsp;</span>)}</span></h1>
            <p className={`mt-6 max-w-xl text-xl ${night ? "text-white/85" : "text-navy/80"}`}>{s.story}</p>
            <div className="mt-8 flex flex-wrap gap-4"><Btn href="/contact/" variant={night ? "coral" : "blue"}>Book {s.name.toLowerCase()}</Btn><Btn href={`tel:${brand.tel}`} variant="white">📞 {brand.phone}</Btn></div>
          </div>
          <div className={`card-toy relative overflow-hidden ${night ? "bg-[#14264a]" : "bg-sky-2"}`}>
            <GusStage mode={s.station} priority poster={poster(s.station)} posterAlt={`Gus doing ${s.name.toLowerCase()} in 3D`} className="aspect-[4/3] w-full" />
            <p className="absolute bottom-4 left-4 chip bg-white/90 text-navy">🎬 Move your mouse or scroll to watch Gus work</p>
          </div>
        </div>
      </section>
      <Wave from={night ? "#10223a" : s.color} to="#fffaf0" />
      <section className="bg-cream px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[84rem]">
          <h2 className="h-xl">How Gus does it</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {s.steps.map((st, k) => (
              <li key={st.t} className="card-toy bg-white p-8" style={{ rotate: `${[-1, 0.8, -0.6][k]}deg` }}>
                <span className="font-display grid h-14 w-14 place-items-center rounded-full bg-sun text-2xl font-bold">{k + 1}</span>
                <h3 className="font-display mt-6 text-2xl font-bold">{st.t}</h3>
                <p className="mt-2 text-navy/80">{st.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="card-toy bg-sky-2 p-8">
              <h2 className="font-display text-3xl font-bold">When to call Gus</h2>
              <ul className="mt-5 space-y-3 text-lg">{s.signs.map((x) => <li key={x}>👀 {x}</li>)}</ul>
            </div>
            <div className="card-toy bg-sun-2 p-8">
              <h2 className="font-display text-3xl font-bold">What&apos;s included</h2>
              <ul className="mt-5 space-y-3 text-lg">{s.includes.map((x) => <li key={x}>✅ {x}</li>)}</ul>
            </div>
          </div>
          <div className="mt-16 space-y-3">
            <h2 className="h-lg mb-6">Questions</h2>
            {s.faq.map((f, k) => (
              <details key={f.q} open={k === 0} className="card-toy bg-white px-6">
                <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-xl font-semibold">{f.q}<span className="acc-icon grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-2 text-2xl" aria-hidden="true">+</span></summary>
                <p className="pb-6 text-navy/80">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <Link href={`/services/${next.slug}/`} className="group block px-5 py-16 md:px-10" style={{ background: next.color }}>
        <div className="mx-auto flex max-w-[84rem] items-center justify-between gap-6">
          <div><p className="font-semibold text-navy/70">Next stop on Gus&apos;s route</p><p className="h-xl mt-2">{next.emoji} {next.name}</p></div>
          <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-navy text-3xl text-sun transition-transform duration-500 group-hover:translate-x-2">→</span>
        </div>
      </Link>
      <CtaBand />
    </>
  );
}
