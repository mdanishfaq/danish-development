import Link from "next/link";
import { brand, nav, services, areas } from "@/lib/site";
import { Logo } from "./ui";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-bone">
      <div className="mx-auto grid max-w-[88rem] gap-12 border-t border-white/10 px-5 pb-10 pt-20 md:grid-cols-2 md:px-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3"><Logo className="h-10 w-10" /><span className="font-display text-2xl font-bold">Brass <span className="text-brass">&amp;</span> Bolt</span></Link>
          <p className="mt-5 max-w-sm text-bone/65">Licensed plumbers for Austin homes. Honest prices, tidy work, and a real person on the phone at 3am.</p>
          <a href={`tel:${brand.tel}`} className="font-display mt-8 block text-4xl font-bold tracking-tight text-paper transition-colors hover:text-brass">{brand.phone}</a>
          <p className="mt-2 text-sm text-bone/70">{brand.hours}</p>
        </div>
        <div>
          <h2 className="eyebrow mb-5 text-brass-2">Services</h2>
          <ul className="space-y-1">{services.map((s) => <li key={s.slug}><Link className="inline-block py-1 text-bone/75 transition-colors hover:text-paper" href={`/services/${s.slug}/`}>{s.name}</Link></li>)}</ul>
        </div>
        <div>
          <h2 className="eyebrow mb-5 text-brass-2">Company</h2>
          <ul className="space-y-1">{[...nav, { href: "/contact/", label: "Book & contact" }].map((n) => <li key={n.href}><Link className="inline-block py-1 text-bone/75 transition-colors hover:text-paper" href={n.href}>{n.label}</Link></li>)}</ul>
        </div>
        <div>
          <h2 className="eyebrow mb-5 text-brass-2">Areas</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">{areas.slice(0, 10).map((a) => <li key={a.name} className="text-bone/65">{a.name}</li>)}</ul>
        </div>
      </div>
      <div aria-hidden="true" className="font-display pointer-events-none select-none whitespace-nowrap px-4 text-center text-[19vw] font-extrabold leading-[.8] tracking-[-0.06em]">
        <span className="outline-text inline-block drift-slow" style={{ ["--stroke" as string]: "rgba(246,199,107,.28)" }}>Brass&amp;Bolt</span>
      </div>
      <div className="mx-auto flex max-w-[88rem] flex-col gap-3 border-t border-white/10 px-5 py-6 text-xs text-bone/70 md:flex-row md:items-center md:justify-between md:px-10">
        <p>© 2026 {brand.full} — a fictional brand. {brand.license}.</p>
        <p>Demo website designed &amp; built by <a className="text-brass-2 underline underline-offset-4" href="https://danishishfaq.online/plumbing-demos">Danish Ishfaq</a>. Photos: Unsplash. Artwork: custom.</p>
      </div>
    </footer>
  );
}
