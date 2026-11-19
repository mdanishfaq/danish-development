import Link from "next/link";
import type { ReactNode, CSSProperties } from "react";
import { preload } from "react-dom";
import { BASE, img, srcSet, type ImgKey } from "@/lib/site";

export const ART = {
  heroBrass: { src: `${BASE}/art/hero-brass.webp`, w: 1536, h: 1024 },
  house: { src: `${BASE}/art/house-cutaway.webp`, w: 1536, h: 1024 },
  team: { src: `${BASE}/art/team.webp`, w: 1536, h: 1024 },
  hands: { src: `${BASE}/art/hands-brass.webp`, w: 1024, h: 1280 },
  bath: { src: `${BASE}/art/bath-brass.webp`, w: 1024, h: 1280 },
} as const;
export type ArtKey = keyof typeof ART;

/** Unsplash photo with responsive srcset. */
export function Photo({ k, alt, sizes = "100vw", className = "", priority = false, style }: { k: ImgKey; alt: string; sizes?: string; className?: string; priority?: boolean; style?: CSSProperties }) {
  if (priority) preload(img(k, 1200), { as: "image", imageSrcSet: srcSet(k), imageSizes: sizes, fetchPriority: "high" });
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={img(k, 1200)} srcSet={srcSet(k)} sizes={sizes} alt={alt} className={`h-full w-full object-cover ${className}`} style={style}
      loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" width={1200} height={800} />
  );
}

/** Custom generated artwork (Figma AI), served from /art. */
export function Art({ k, alt, className = "", priority = false, sizes = "(min-width:1024px) 45vw, 100vw" }: { k: ArtKey; alt: string; className?: string; priority?: boolean; sizes?: string }) {
  const a = ART[k];
  const set = `${a.src.replace(".webp", "-800.webp")} 800w, ${a.src} ${a.w}w`;
  if (priority) preload(a.src, { as: "image", imageSrcSet: set, imageSizes: sizes, fetchPriority: "high" });
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={a.src} srcSet={set} sizes={sizes} alt={alt} width={a.w} height={a.h} className={`h-full w-full object-cover ${className}`} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" />
  );
}

export function Arrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

export function Btn({ href, children, variant = "brass", className = "" }: { href: string; children: ReactNode; variant?: "brass" | "ink" | "ghost" | "sos"; className?: string }) {
  const ext = href.startsWith("tel:") || href.startsWith("mailto:");
  const cls = `btn btn-${variant} ${className}`;
  const inner = (<>{children}<span className="arrow"><Arrow size={12} /></span></>);
  return ext ? <a href={href} className={cls}>{inner}</a> : <Link href={href} className={cls}>{inner}</Link>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`}>
      <span aria-hidden="true" className="inline-block h-px w-8 bg-current opacity-60" />{children}
    </p>
  );
}

/** Brass pipe logo mark */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lg-brass" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#f6c76b" /><stop offset=".55" stopColor="#e2a33b" /><stop offset="1" stopColor="#9c6a1c" /></linearGradient>
      </defs>
      <path d="M8 6v14a8 8 0 0 0 8 8h16" fill="none" stroke="url(#lg-brass)" strokeWidth="7" strokeLinecap="round" />
      <rect x="27" y="22.5" width="5" height="11" rx="1.5" fill="#f6c76b" />
      <circle cx="35" cy="28" r="2.2" fill="#46e3d6" />
    </svg>
  );
}

export function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 text-brass ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (<svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M10 1.5l2.6 5.5 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L1.4 7.7l6-.7z" /></svg>))}
    </span>
  );
}

/** Inner-page hero: dark, giant title, image panel that unmasks. */
export function PageHero({ eyebrow, title, accent, lede, photo, art, crumbs, children }: { eyebrow: string; title: string; accent?: string; lede: string; photo?: ImgKey; art?: ArtKey; crumbs: { href?: string; label: string }[]; children?: ReactNode }) {
  return (
    <section className="grain relative overflow-hidden bg-ink pb-16 pt-36 text-paper md:pb-24 md:pt-44">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-brass/20 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-60 -left-40 h-[36rem] w-[36rem] rounded-full bg-aqua/10 blur-[120px]" />
      <div className="relative mx-auto grid max-w-[88rem] gap-12 px-5 md:px-10 lg:grid-cols-[1.25fr_1fr] lg:items-end">
        <div>
          <nav aria-label="Breadcrumb" className="mx-blur-up mb-8 text-sm text-mute">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {c.href ? <Link href={c.href} className="hover:text-brass-2">{c.label}</Link> : <span aria-current="page" className="text-bone">{c.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
          <Eyebrow className="mx-blur-up mb-6 text-brass-2">{eyebrow}</Eyebrow>
          <h1 className="h-xl">
            <span className="hero-words" style={{ display: "inline" }}>
              {title.split(" ").map((w, i) => (<span key={i} style={{ "--i": i } as CSSProperties}>{w}&nbsp;</span>))}
            </span>
            {accent && <span className="brass-text block pb-2">{accent}</span>}
          </h1>
          <p className="mx-blur-up mt-8 max-w-xl text-lg text-bone/80" style={{ "--i": 4 } as CSSProperties}>{lede}</p>
          {children && <div className="mx-blur-up mt-10 flex flex-wrap gap-3" style={{ "--i": 6 } as CSSProperties}>{children}</div>}
        </div>
        {(photo || art) && (
          <div className="relative aspect-[16/10] max-h-[34rem] w-full overflow-hidden rounded-blob lg:aspect-[4/5] lg:justify-self-end" style={{ animation: "mx-mask-up 1.2s var(--ease-dramatic) .2s both" }}>
            {photo ? <Photo k={photo} alt="" sizes="(min-width:1024px) 40vw, 100vw" priority /> : <Art k={art!} alt="" sizes="(min-width:1024px) 40vw, 100vw" priority />}
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}

/** Big closing CTA with ripple rings. */
export function CtaBand({ title = "Something dripping?", accent = "Let's fix it today.", text = "Book online in 60 seconds or call a real person, 24 hours a day." }: { title?: string; accent?: string; text?: string }) {
  return (
    <section className="grain relative isolate overflow-hidden bg-ink py-28 text-center text-paper md:py-40">
      <div className="ripples pointer-events-none absolute inset-0 -z-10" aria-hidden="true"><span /><span /><span /><span /></div>
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass/25 blur-[110px]" />
      <div className="mx-auto max-w-4xl px-5">
        <h2 className="h-xl mx-blur-up mx-on-view">{title}<span className="brass-text block pb-2">{accent}</span></h2>
        <p className="mx-blur-up mx-on-view mx-auto mt-6 max-w-lg text-lg text-bone/75">{text}</p>
        <div className="mx-blur-up mx-on-view mt-10 flex flex-wrap justify-center gap-3">
          <Btn href="/contact/">Book a plumber</Btn>
          <Btn href="tel:+15125550148" variant="ghost" className="text-paper">Call (512) 555-0148</Btn>
        </div>
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, accent, text, dark = false, className = "" }: { eyebrow: string; title: string; accent?: string; text?: string; dark?: boolean; className?: string }) {
  return (
    <div className={`grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end ${className}`}>
      <div>
        <Eyebrow className={`mx-blur-up mx-on-view mb-5 ${dark ? "text-brass-2" : "text-brass-3"}`}>{eyebrow}</Eyebrow>
        <h2 className="h-lg mx-blur-up mx-on-view">{title}{accent && <> <span className={dark ? "brass-text" : "text-brass-3"}>{accent}</span></>}</h2>
      </div>
      {text && <p className={`mx-blur-up mx-on-view max-w-md text-lg ${dark ? "text-bone/70" : "text-ink/65"}`}>{text}</p>}
    </div>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
