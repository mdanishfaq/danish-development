"use client";
// Danish Development MOTION LIBRARY: interactive pieces. Style-free (motion + structure only), no animation library.
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Pause loops when off-screen (performance). Wrap any section that contains mx-float/spin/marquee/ripple. */
export function PauseOffscreen({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("mx-paused", !e.isIntersecting));
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

/** anime.js "animate anything" word cycler: chars collapse (scaleX 0) last-to-first, next word's chars
 *  expand first-to-last with x 10->0, while a dot stretches (scaleX 8->1) across. 25ms per char, 750ms gap. */
export function WordCycler({ words, className, dotClassName }: { words: string[]; className?: string; dotClassName?: string }) {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const w = words[i];
    const hold = 1000 + w.length * 25 + 750;
    const t1 = setTimeout(() => setPhase("out"), hold);
    const t2 = setTimeout(() => { setI((i + 1) % words.length); setPhase("in"); }, hold + w.length * 25 + 100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [i, words]);
  const w = words[i];
  return (
    <span className={className} aria-live="polite" style={{ display: "inline-flex", alignItems: "baseline", whiteSpace: "nowrap" }}>
      <span key={i + phase} aria-label={w}>
        {w.split("").map((c, k) => (
          <span key={k} aria-hidden="true" style={{
            display: "inline-block", transformOrigin: "left",
            transition: "opacity 100ms, transform 150ms var(--ease-out)",
            animation: phase === "in" ? `mx-char-in 150ms var(--ease-out) ${100 + k * 25}ms both` : `mx-char-out 100ms ease-in ${(w.length - 1 - k) * 25}ms both`,
          }}>{c === " " ? " " : c}</span>
        ))}
      </span>
      <span aria-hidden="true" className={dotClassName} style={{ display: "inline-block", width: ".22em", height: ".22em", borderRadius: "50%", background: "currentColor", transformOrigin: "left",
        animation: phase === "in" ? `mx-dot-in ${w.length * 25 + 75}ms var(--ease-quint) both` : "none" }} />
      <style>{`@keyframes mx-char-in{from{opacity:0;transform:translateX(10px) scaleX(0)}}@keyframes mx-char-out{to{opacity:0;transform:scaleX(0)}}@keyframes mx-dot-in{from{transform:translateX(-${w.length * 0.55}em) scaleX(8)}}`}</style>
    </span>
  );
}

/** Pinned chapter story (anime.js). Left: chapters scroll. Right: sticky stage shows the active step. */
export function Story({ steps, className }: { steps: { title: ReactNode; body: ReactNode; stage: ReactNode }[]; className?: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const i = Number((e.target as HTMLElement).dataset.i);
      if (e.isIntersecting) setActive(i);
      else if (i === 0 && e.boundingClientRect.top > innerHeight / 2) setActive(0);
    }), { rootMargin: "-45% 0px -45% 0px" });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className={`mx-story ${className ?? ""}`}>
      <div>{steps.map((s, i) => (<article key={i} data-i={i} ref={(el) => { refs.current[i] = el; }} className="mx-chapter"><div>{s.title}{s.body}</div></article>))}</div>
      <div className="mx-story-stage" aria-hidden="true">{steps.map((s, i) => (<div key={i} data-step={i} data-active={i === active ? "" : undefined}>{s.stage}</div>))}</div>
    </div>
  );
}

/** Tabs whose panel wipes in with clip-path (motion.dev). Fully accessible tablist; style via classNames. */
export function WipeTabs({ tabs, tabClassName = "", activeTabClassName = "", panelClassName = "" }:
  { tabs: { label: string; panel: ReactNode }[]; tabClassName?: string; activeTabClassName?: string; panelClassName?: string }) {
  const [a, setA] = useState(0);
  return (
    <div>
      <div role="tablist">
        {tabs.map((t, i) => (
          <button key={t.label} role="tab" aria-selected={a === i} aria-controls={`mx-panel-${i}`} id={`mx-tab-${i}`} onClick={() => setA(i)}
            className={`mx-press ${tabClassName} ${a === i ? activeTabClassName : ""}`}>{t.label}</button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.label} role="tabpanel" id={`mx-panel-${i}`} aria-labelledby={`mx-tab-${i}`} hidden={a !== i} className={`${a === i ? "mx-wipe" : ""} ${panelClassName}`}>{t.panel}</div>
      ))}
    </div>
  );
}

/** Hold-to-confirm button (kokonut BT-05): fill grows while pressed; confirms after `ms`.
 *  From a Server Component pass `href` (navigates on confirm); from a Client Component you may pass `onConfirm`. */
export function HoldButton({ children, href, onConfirm, ms = 1200, className = "", fillClassName = "" }: { children: ReactNode; href?: string; onConfirm?: () => void; ms?: number; className?: string; fillClassName?: string }) {
  const [holding, setHolding] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const confirm = () => { onConfirm?.(); if (href) location.assign(href); };
  const start = () => { setHolding(true); t.current = setTimeout(() => { setHolding(false); confirm(); }, ms); };
  const stop = () => { setHolding(false); clearTimeout(t.current); };
  return (
    <button type="button" onPointerDown={start} onPointerUp={stop} onPointerLeave={stop}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && !holding && start()} onKeyUp={stop}
      className={`mx-press ${className}`} style={{ position: "relative", overflow: "hidden" }}>
      <span aria-hidden="true" className={fillClassName} style={{ position: "absolute", inset: 0, transformOrigin: "left", transform: `scaleX(${holding ? 1 : 0})`,
        transition: holding ? `transform ${ms}ms linear` : "transform 200ms var(--ease-out)", background: "currentColor", opacity: .15 }} />
      <span style={{ position: "relative" }}>{children}</span>
    </button>
  );
}

/** Element that follows the pointer on a spring (motion.dev useSpring 200/18/1 demo). rAF-based, no library. */
export function SpringFollower({ children, stiffness = 200, damping = 18, mass = 1, className }: { children: ReactNode; stiffness?: number; damping?: number; mass?: number; className?: string }) {
  const area = useRef<HTMLDivElement>(null), dot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const a = area.current!, d = dot.current!; let x = 0, y = 0, vx = 0, vy = 0, tx = 0, ty = 0, raf = 0, last = performance.now();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent) => { const r = a.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); } };
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000); last = now;
      vx += ((-stiffness * (x - tx) - damping * vx) / mass) * dt; vy += ((-stiffness * (y - ty) - damping * vy) / mass) * dt;
      x += vx * dt; y += vy * dt; d.style.transform = `translate(${x}px, ${y}px)`;
      raf = Math.abs(vx) + Math.abs(vy) + Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(step) : 0;
    };
    a.addEventListener("pointermove", move); return () => { a.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, [stiffness, damping, mass]);
  return <div ref={area} className={className} style={{ position: "relative" }}><div ref={dot} style={{ position: "absolute", left: 0, top: 0, willChange: "transform", pointerEvents: "none" }}>{children}</div></div>;
}
