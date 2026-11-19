import Link from "next/link";
import type { ReactNode } from "react";

export function Btn({ href, children, variant = "sun", className = "" }: { href: string; children: ReactNode; variant?: "sun" | "blue" | "coral" | "white"; className?: string }) {
  const cls = `btn btn-${variant} ${className}`;
  return href.startsWith("tel:") || href.startsWith("mailto:") ? <a href={href} className={cls}>{children}</a> : <Link href={href} className={cls}>{children}</Link>;
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="#ffc93c" />
      <circle cx="24" cy="26" r="13" fill="#f6c9a4" />
      <path d="M11 27a13 13 0 0 0 26 0c-3 2-6 3-13 3s-10-1-13-3z" fill="#7a4a26" />
      <path d="M10 22a14 11 0 0 1 28 0z" fill="#2f7df6" /><rect x="9" y="20" width="30" height="4" rx="2" fill="#1f5fd0" />
      <circle cx="19" cy="24.5" r="3" fill="none" stroke="#1d2a40" strokeWidth="1.4" /><circle cx="29" cy="24.5" r="3" fill="none" stroke="#1d2a40" strokeWidth="1.4" />
    </svg>
  );
}

export function Stars() {
  return <span className="inline-flex gap-0.5 text-sun" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <svg key={i} width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M10 1.5l2.6 5.5 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L1.4 7.7l6-.7z" /></svg>)}</span>;
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function Crumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm font-semibold text-navy/70">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">›</span>}
            {c.href ? <Link href={c.href} className="hover:text-blue">{c.label}</Link> : <span aria-current="page" className="text-navy">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Wavy divider between colored bands */
export function Wave({ from, to, flip = false }: { from: string; to: string; flip?: boolean }) {
  return (
    <div aria-hidden="true" style={{ background: from }} className="-mb-px leading-[0]">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={`h-10 w-full md:h-16 ${flip ? "rotate-180" : ""}`}><path d="M0 40 C 240 90 480 0 720 40 S 1200 90 1440 40 V80 H0Z" fill={to} /></svg>
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-blue px-5 py-24 text-center text-white md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #8fd3ff 0 60px, transparent 61px), radial-gradient(circle at 80% 70%, #ffc93c 0 90px, transparent 91px), radial-gradient(circle at 60% 15%, #ffffff 0 30px, transparent 31px)" }} />
      <div className="relative mx-auto max-w-3xl">
        <p className="chip mx-auto bg-white/15 text-white">🛠️ Gus is free today</p>
        <h2 className="h-xl mt-6">Got a drip, a clog or a cold shower?</h2>
        <p className="mx-auto mt-5 max-w-lg text-lg text-white/85">Book in 60 seconds. Fixed price before we start. No surcharge, ever.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4"><Btn href="/contact/">Book Gus</Btn><Btn href="tel:+16025550193" variant="white">Call (602) 555-0193</Btn></div>
      </div>
    </section>
  );
}
