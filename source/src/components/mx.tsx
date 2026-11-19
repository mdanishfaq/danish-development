// Danish Development MOTION LIBRARY: server components (zero client JS).
// Style-free: these output structure + mx-* motion classes only. Pass className for your own design.
import type { CSSProperties, ReactNode, ElementType } from "react";

type V = CSSProperties & Record<`--${string}`, string | number>;

/** anime.js text-appear: words slide .35em + fade, 25ms stagger. Text stays readable for SEO and screen readers. */
export function WordsIn({ text, as: Tag = "span", className, startMs = 0 }: { text: string; as?: ElementType; className?: string; startMs?: number }) {
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      <span className="mx-words" aria-hidden="true" style={{ "--start": `${startMs}ms` } as V}>
        {words.map((w, i) => (<span key={i} style={{ "--i": i } as V}>{w}{i < words.length - 1 ? " " : ""}</span>))}
      </span>
    </Tag>
  );
}

/** Staggered entrance wrapper. effect: blur-up | blur-left | slide-up | rise | pop | grow-y. onView = trigger on scroll. */
export function Enter({ i = 0, effect = "blur-up", onView = false, as: Tag = "div", className = "", style, children }:
  { i?: number; effect?: "blur-up" | "blur-left" | "slide-up" | "rise" | "pop" | "grow-y"; onView?: boolean; as?: ElementType; className?: string; style?: CSSProperties; children: ReactNode }) {
  return <Tag className={`mx-${effect}${onView ? " mx-on-view" : ""} ${className}`} style={{ "--i": i, ...style } as V}>{children}</Tag>;
}

/** motion.dev rolling digits. The real number is in the HTML. */
export function RollingNumber({ value, label, className }: { value: string; label?: string; className?: string }) {
  return (
    <span className={className}>
      <span className="sr-only">{label ?? value}</span>
      <span className="mx-digits" aria-hidden="true">
        {value.split("").map((ch, i) =>
          /\d/.test(ch)
            ? <span key={i} className="mx-digit" style={{ "--d": ch } as V}>{"0123456789".split("").map((n) => <span key={n}>{n}</span>)}</span>
            : <span key={i}>{ch}</span>)}
      </span>
    </span>
  );
}

/** Score ring that fills on view. Colours come from currentColor / your CSS. */
export function Ring({ value, label, size = 120, track = 0.12, className }: { value: number; label: string; size?: number; track?: number; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} role="img" aria-label={`${label}: ${value} out of 100`} className={className}>
      <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeOpacity={track} strokeWidth="4" />
      <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" pathLength={100} className="mx-ring" style={{ "--value": value } as V} />
      <text x="20" y="22.5" textAnchor="middle" fontSize="9" fontWeight="600" fill="currentColor">{value}</text>
    </svg>
  );
}

/** Line that draws in when visible (bklit / anime.js draw). */
export function DrawPath({ points, width = 600, height = 200, label, strokeWidth = 2.5, className }: { points: number[]; width?: number; height?: number; label: string; strokeWidth?: number; className?: string }) {
  const max = Math.max(...points), min = Math.min(...points);
  const d = points.map((v, i) => `${i ? "L" : "M"}${((i / (points.length - 1)) * width).toFixed(1)},${(height - ((v - min) / (max - min || 1)) * (height - 16) - 8).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label={label} className={className}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" pathLength={1} className="mx-draw mx-on-view" />
    </svg>
  );
}

/** anime.js centre-out grid ripple. Children are cells; distance from centre is computed on the server. */
export function RippleGrid({ cols, rows, cell, className, peak = 2.2 }: { cols: number; rows: number; cell: ReactNode; className?: string; peak?: number }) {
  const cx = (cols - 1) / 2, cy = (rows - 1) / 2, maxD = Math.hypot(cx, cy) || 1;
  return (
    <div className={`mx-ripple ${className ?? ""}`} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, "--peak": peak } as V} aria-hidden="true">
      {Array.from({ length: cols * rows }, (_, k) => (
        <span key={k} style={{ "--dist": (Math.hypot((k % cols) - cx, Math.floor(k / cols) - cy) / maxD).toFixed(3), display: "grid", placeItems: "center", aspectRatio: "1" } as V}>{cell}</span>
      ))}
    </div>
  );
}

/** Infinite marquee (v0 slideShow). Content is duplicated for a seamless loop; the copy is hidden from AT. */
export function Marquee({ children, period = "30s", className }: { children: ReactNode; period?: string; className?: string }) {
  return (
    <div className={className} style={{ overflow: "hidden" }}>
      <div className="mx-marquee" style={{ "--period": period } as V}>
        <div style={{ display: "flex" }}>{children}</div>
        <div style={{ display: "flex" }} aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
