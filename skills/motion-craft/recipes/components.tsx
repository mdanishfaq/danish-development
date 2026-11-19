// Danish Development motion recipes: React components (Next.js App Router, server-first).
// Copy what you need into src/components/motion/. Pair with recipes/motion.css.
// Only PromptHero, Story and Tabs are client components, and they are tiny (no animation library).

import type { CSSProperties, ReactNode } from "react";

/* Rolling digit counter (motion.dev). Server component: the final number is in the HTML for SEO. */
export function RollingNumber({ value, suffix = "", label }: { value: string; suffix?: string; label?: string }) {
  return (
    <span aria-label={label ?? value + suffix}>
      <span className="digits" aria-hidden="true">
        {value.split("").map((ch, i) =>
          /\d/.test(ch) ? (
            <span key={i} className="digit" style={{ "--d": ch } as CSSProperties}>
              {"0123456789".split("").map((n) => <span key={n}>{n}</span>)}
            </span>
          ) : (
            <span key={i}>{ch}</span>
          ),
        )}
      </span>
      {suffix && <span aria-hidden="true">{suffix}</span>}
    </span>
  );
}

/* Score ring that fills when scrolled into view (bklit / Lighthouse style). */
export function ScoreRing({ value, label, size = 120 }: { value: number; label: string; size?: number }) {
  return (
    <figure style={{ width: size }} className="text-center">
      <svg viewBox="0 0 40 40" width={size} height={size} role="img" aria-label={`${label}: ${value} out of 100`}>
        <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="4" />
        <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
          pathLength={100} className="gauge" style={{ "--value": value } as CSSProperties} />
        <text x="20" y="22.5" textAnchor="middle" fontSize="9" fontWeight="600" fill="currentColor">{value}</text>
      </svg>
      <figcaption className="mt-2 text-sm">{label}</figcaption>
    </figure>
  );
}

/* A line chart that draws itself in (bklit). Server-rendered SVG, no chart library. */
export function DrawLine({ points, width = 600, height = 200, label }: { points: number[]; width?: number; height?: number; label: string }) {
  const max = Math.max(...points), min = Math.min(...points);
  const x = (i: number) => (i / (points.length - 1)) * width;
  const y = (v: number) => height - ((v - min) / (max - min || 1)) * (height - 16) - 8;
  const d = points.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label={label}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" pathLength={1} className="draw" />
    </svg>
  );
}

/* Page-wide settle-in: wrap blocks in order; each gets the next 50ms wave. */
export function Settle({ i = 0, as: Tag = "div", className = "", children }: { i?: number; as?: "div" | "p" | "h1" | "h2" | "section"; className?: string; children: ReactNode }) {
  return <Tag className={`settle ${className}`} style={{ "--i": i } as CSSProperties}>{children}</Tag>;
}
