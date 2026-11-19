"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Lenis smooth scrolling (skipped for reduced motion and touch, where native scroll feels better). */
export function SmoothScroll() {
  const path = usePathname();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches) return;
    let raf = 0; let lenis: import("lenis").default | undefined; let dead = false;
    import("lenis").then(({ default: Lenis }) => {
      if (dead) return;
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
      const loop = (t: number) => { lenis!.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    });
    return () => { dead = true; cancelAnimationFrame(raf); lenis?.destroy(); };
  }, []);
  useEffect(() => { scrollTo(0, 0); }, [path]);
  return null;
}
