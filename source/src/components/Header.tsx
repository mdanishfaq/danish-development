"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand, nav, services } from "@/lib/site";
import { Logo } from "./ui";

export function Header() {
  const path = usePathname();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let last = scrollY;
    const on = () => { const y = scrollY; if (y > 300 && y > last + 4) setHidden(true); else if (y < last - 4 || y < 300) setHidden(false); last = y; };
    addEventListener("scroll", on, { passive: true }); return () => removeEventListener("scroll", on);
  }, []);
  useEffect(() => { setOpen(false); }, [path]);
  const active = (h: string) => path.startsWith(h.replace(/\/$/, ""));
  return (
    <>
      <header data-hidden={hidden && !open} className="site-header fixed inset-x-0 top-3 z-50 px-3 md:top-4 md:px-6" style={{ viewTransitionName: "site-header" }}>
        <div className="mx-auto flex h-16 max-w-[84rem] items-center justify-between gap-4 rounded-full bg-white/90 pl-3 pr-2 shadow-[0_6px_0_0_rgba(16,34,58,.08),0_20px_40px_-20px_rgba(16,34,58,.35)] backdrop-blur md:h-[4.4rem] md:pl-4">
          <Link href="/" className="flex items-center gap-2.5 wobble" aria-label={`${brand.full} home`}>
            <Logo className="h-10 w-10 md:h-11 md:w-11" />
            <span className="font-display text-xl font-bold leading-none md:text-2xl">Gus <span className="text-blue">&amp;</span> Co.</span>
          </Link>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((n) => (
                <li key={n.href}><Link href={n.href} className={`font-display block rounded-full px-4 py-2 text-[1.05rem] font-semibold transition-colors ${active(n.href) ? "bg-sun-2 text-navy" : "text-navy/80 hover:bg-sky-2"}`}>{n.label}</Link></li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <a href={`tel:${brand.tel}`} className="font-display hidden rounded-full px-4 py-2 text-[1.05rem] font-semibold text-navy hover:bg-sky-2 md:block">📞 {brand.phone}</a>
            <Link href="/contact/" className="btn btn-sun !h-11 !px-5 !text-base">Book</Link>
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mnav" aria-label={open ? "Close menu" : "Open menu"} className="grid h-11 w-11 place-items-center rounded-full bg-sky-2 lg:hidden">
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-navy transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-navy transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>
      <div id="mnav" hidden={!open} className="fixed inset-0 z-40 overflow-y-auto bg-sun px-6 pb-10 pt-28 text-navy lg:hidden">
        {open && (
          <nav aria-label="Mobile">
            <ul className="space-y-1">{[{ href: "/", label: "Home" }, ...nav, { href: "/contact/", label: "Book & contact" }].map((n, i) => (
              <li key={n.href} className="mx-blur-up" style={{ ["--i" as string]: i }}><Link href={n.href} className="font-display block py-2 text-5xl font-bold">{n.label}</Link></li>
            ))}</ul>
            <ul className="mt-8 grid grid-cols-2 gap-2 font-semibold">{services.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}/`}>{s.emoji} {s.name}</Link></li>)}</ul>
            <a href={`tel:${brand.tel}`} className="btn btn-coral mt-10 w-full justify-center">🚨 24/7: {brand.phone}</a>
          </nav>
        )}
      </div>
    </>
  );
}
