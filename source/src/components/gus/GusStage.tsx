"use client";
import { useEffect, useRef, useState } from "react";
import type { StationKey } from "./world";

/**
 * Hosts Gus's 3D world. Shows a pre-rendered poster until the visitor interacts (mouse move, touch, scroll, key),
 * then loads three.js and fades the live scene in. Nothing 3D runs during page load, so speed scores stay high.
 */
export function GusStage({ mode, poster, posterAlt, className = "", priority = false }: { mode: "journey" | StationKey; poster: string; posterAlt: string; className?: string; priority?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let disposed = false; let api: { dispose: () => void } | null = null;
    const q = new URLSearchParams(location.search);
    const capture = q.has("poster");
    const getProgress = () => {
      const secs = document.querySelectorAll<HTMLElement>("[data-station]");
      const anchor = scrollY + innerHeight * 0.5;
      let p = 0;
      secs.forEach((el, k) => {
        const r = el.getBoundingClientRect(); const top = r.top + scrollY, h = r.height;
        if (anchor >= top) p = k + Math.min(1, (anchor - top) / h);
      });
      return capture ? Number(q.get("p") ?? 0) : p;
    };
    const start = async () => {
      const { createWorld } = await import("./world");
      if (disposed || !canvas.current) return;
      api = createWorld({
        canvas: canvas.current, mode: capture && q.get("poster") !== "journey" ? (q.get("poster") as StationKey) : mode, getProgress, preserve: capture, fixedW: capture && q.has("w") ? Number(q.get("w")) : undefined,
        onNight: mode === "journey" ? (n) => document.documentElement.style.setProperty("--night", n.toFixed(3)) : undefined,
      });
      requestAnimationFrame(() => setLive(true));
    };
    const evs = ["pointermove", "pointerdown", "touchstart", "wheel", "scroll", "keydown"] as const;
    let started = false;
    const kick = () => { if (started) return; started = true; evs.forEach((e) => removeEventListener(e, kick)); start().catch(() => {}); };
    if (capture) kick(); else evs.forEach((e) => addEventListener(e, kick, { passive: true }));
    return () => { disposed = true; evs.forEach((e) => removeEventListener(e, kick)); api?.dispose(); };
  }, [mode]);

  return (
    <div className={`relative ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt={posterAlt} width={1200} height={900} fetchPriority={priority ? "high" : "auto"} loading={priority ? "eager" : "lazy"} decoding="async"
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${live ? "opacity-0" : "opacity-100"}`} />
      <canvas ref={canvas} aria-hidden="true" className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}
