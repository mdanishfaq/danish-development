"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand, nav, services } from "@/lib/site";
import { Logo } from "./ui";

export function Header() {
  const path = usePathname();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = scrollY;
    const on = () => {
      const y = scrollY;
      setSolid(y > 40);
      if (y > 300 && y > last + 4) setHidden(true);
      else if (y < last - 4 || y < 300) setHidden(false);
      last = y;
    };
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { document.documentElement.style.overflow = open ? "hidden" : ""; }, [open]);

  const active = (href: string) => path.startsWith(href.replace(/\/$/, ""));

  return (
    <>
      <header data-hidden={hidden && !open} className={`site-header fixed inset-x-0 top-0 z-50 ${solid || open ? "bg-ink/80 backdrop-blur-xl" : ""}`} style={{ viewTransitionName: "site-header" }}>
        <div className="mx-auto flex h-20 max-w-[88rem] items-center justify-between gap-6 px-5 text-paper md:px-10">
          <Link href="/" className="group flex items-center gap-3" aria-label={`${brand.full} home`}>
            <Logo className="h-9 w-9 transition-transform duration-500 group-hover:rotate-[-12deg]" />
            <span className="font-display text-xl font-bold leading-none tracking-tight">Brass <span className="text-brass">&amp;</span> Bolt</span>
          </Link>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={`relative block rounded-full px-4 py-2 text-sm font-medium transition-colors ${active(n.href) ? "bg-paper text-ink" : "text-bone/80 hover:text-paper"}`}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <a href={`tel:${brand.tel}`} className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-paper ring-1 ring-white/15 transition hover:bg-white/10 md:flex">
              <span className="live-dot" aria-hidden="true" /> {brand.phone}
            </a>
            <Link href="/contact/" className="btn btn-brass !h-11 !px-5 text-sm">Book now</Link>
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mnav" aria-label={open ? "Close menu" : "Open menu"} className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-white/20 lg:hidden">
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span className={`absolute left-0 h-0.5 w-5 bg-paper transition-all duration-500 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-0.5 w-5 bg-paper transition-all duration-500 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>
      <div id="mnav" hidden={!open} className="fixed inset-0 z-40 overflow-y-auto bg-ink px-6 pb-10 pt-28 text-paper lg:hidden">
        {open && (
          <nav aria-label="Mobile">
            <ul className="space-y-1">
              {[{ href: "/", label: "Home" }, ...nav, { href: "/contact/", label: "Contact" }].map((n, i) => (
                <li key={n.href} className="mx-blur-up" style={{ ["--i" as string]: i }}>
                  <Link href={n.href} className="font-display block py-2 text-5xl font-bold tracking-tight hover:text-brass">{n.label}</Link>
                </li>
              ))}
            </ul>
            <p className="eyebrow mt-10 text-brass-2">Services</p>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-bone/80">
              {services.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}/`}>{s.name}</Link></li>)}
            </ul>
            <a href={`tel:${brand.tel}`} className="btn btn-sos mt-10 w-full justify-center">24/7 Emergency: {brand.phone}</a>
          </nav>
        )}
      </div>
    </>
  );
}
