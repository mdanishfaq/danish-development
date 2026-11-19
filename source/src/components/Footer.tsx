import Link from "next/link";
import { brand, nav, services } from "@/lib/site";
import { Logo } from "./ui";

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-[84rem] gap-12 px-5 pb-10 pt-20 md:grid-cols-2 md:px-10 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3"><Logo className="h-12 w-12" /><span className="font-display text-3xl font-bold">Gus &amp; Co.</span></Link>
          <p className="mt-5 max-w-sm text-white/75">Friendly, licensed plumbers for Phoenix homes. Fixed prices, tidy work, and a beard you can trust.</p>
          <a href={`tel:${brand.tel}`} className="font-display mt-8 block text-4xl font-bold text-sun hover:underline">{brand.phone}</a>
          <p className="mt-2 text-sm text-white/70">{brand.hours}</p>
        </div>
        <div>
          <h2 className="font-display mb-4 text-xl font-semibold text-sun">Services</h2>
          <ul className="space-y-1">{services.map((s) => <li key={s.slug}><Link className="inline-block py-1 text-white/80 hover:text-white" href={`/services/${s.slug}/`}>{s.emoji} {s.name}</Link></li>)}</ul>
        </div>
        <div>
          <h2 className="font-display mb-4 text-xl font-semibold text-sun">Company</h2>
          <ul className="space-y-1">{[...nav, { href: "/contact/", label: "Book & contact" }].map((n) => <li key={n.href}><Link className="inline-block py-1 text-white/80 hover:text-white" href={n.href}>{n.label}</Link></li>)}</ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-[84rem] flex-col gap-3 border-t border-white/10 px-5 py-6 text-xs text-white/70 md:flex-row md:items-center md:justify-between md:px-10">
        <p>© 2026 {brand.full}, a fictional brand. Gus is a mascot.</p>
        <p>Demo designed &amp; built by <a className="text-sun underline underline-offset-4" href="https://danishishfaq.online/plumbing-demos">Danish Ishfaq</a>. 3D scenes built in three.js.</p>
      </div>
    </footer>
  );
}
