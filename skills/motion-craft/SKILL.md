---
name: motion-craft
description: How Danish Development builds animation at a senior level - scroll stories, pinned chapters, text reveals, springs, page transitions - while still passing Danish's speed rules (Performance 95+, JS within budget, INP under 200 ms). Use on every site with animation, after reference-study and taste-skill have set the direction.
---

# Motion craft

Good motion explains the page: it shows what changed, where things went, what to look at next.
It never blocks reading and never costs the speed score.

## 1. Pick the cheapest tool that gives the feel (in this order)

| Tier | Tool | JS cost | Use for |
| --- | --- | --- | --- |
| 1 | CSS transitions plus `@keyframes` | 0 KB | hover, press, focus, small loops |
| 2 | **CSS scroll-driven animations** (`animation-timeline: view()` / `scroll()`) | 0 KB | reveals on enter, parallax, progress bars, scrubbed sequences, pinned chapters (with `position: sticky`) |
| 3 | **View Transitions**: React `<ViewTransition>` (stable in React 19.3, Next.js 16.4) or CSS `@view-transition` | 0 KB | page-to-page morphs, shared-element transitions, list re-orders, tab switches |
| 4 | **Motion** (`motion/react`) with `LazyMotion` + `m` (about 5 KB initial), or `useAnimate` mini (about 3 KB) | small | springs, drag, layout animations, gestures, exit animations, orchestration |
| 5 | **anime.js v4** modules (import only what's used: `animate`, `createTimeline`, `stagger`, `onScroll`, `svg`) | about 10-27 KB | SVG line drawing, morphing, motion paths, complex timelines, grid staggers |
| 6 | Canvas or WebGL (Three.js, OGL) | heavy | one signature hero object only, lazy-loaded after first paint, with a static poster image as LCP |

Rules:

- Scroll-driven CSS is Baseline as of Firefox 159 (Oct 2026), alongside Chrome 115+ and Safari 26+.
  Wrap it in `@supports (animation-timeline: view())` so older browsers get the static page.
- Never ship GSAP plus Motion plus anime.js together. Pick one JS library per site, at most.
- Heavy scenes go in a client component loaded with `next/dynamic` (`ssr: false`) **after** the
  hero text has painted. The LCP element is always text or a `priority` `next/image`, never a canvas.
- No scroll-jacking: native scroll always. Smooth-scroll libraries (Lenis) only if Danish asks.
- Animate only `transform`, `opacity`, `clip-path` and `filter`. Never animate `width`, `height`, `top` or `left`.

## 2. The timing system (measured in the code of anime.js, motion.dev, kokonutui, bklit and v0, Nov 2026)

| Token | Value | Seen on |
| --- | --- | --- |
| `--dur-micro` | 100-150 ms | press, colour and background hovers (motion.dev 0.12-0.16 s) |
| `--dur-ui` | 150-250 ms | hover lift, tooltip, menu (v0 0.15-0.2 s, anime.js 250 ms) |
| `--dur-swap` | 300-400 ms | tab or panel swaps, clip-path wipe 0.4 s (motion.dev) |
| `--dur-reveal` | 300-500 ms | section entrances: **small travel, 6-8 px**, never big slides |
| `--dur-hero` | 1000-1500 ms | intro sequence, SVG line draw (anime.js 1 s inOutExpo), digit rolls |
| loops | 2.4-3.6 s; ambient 8-20 s linear | demo loops (motion.dev), floats (v0 8 s), rotations (anime.js 10-20 s) |
| `--ease-out-strong` | `cubic-bezier(.23,1,.32,1)` | entrances (kokonut; the anime.js `out(3)` feel) |
| `--ease-out-expo` | `cubic-bezier(.16,1,.3,1)` | motion.dev reveals and counters |
| `--ease-sharp` | `cubic-bezier(.25,0,0,1)` | wipes |
| `--ease-sheet` | `cubic-bezier(.32,.72,0,1)` | drawers and sheets (v0) |
| springs | stiffness 200-550, damping 18-40, bounce 0-0.15 | snappy UI, no wobble; softer (80-100 / 15) for chart tooltips |
| stagger | 10-40 ms per letter or tick; 50 ms per block | kokonut waves of 50 ms; anime.js 10-40 ms |

**Ready-made, tested code is in `recipes/`:** `motion.css` (tokens + 10 effects), `components.tsx` (server components:
RollingNumber, ScoreRing, DrawLine, Settle) and `client.tsx` (PromptHero, Story, WipeTabs). It was tested on Next.js 16.4.6:
all ten recipes add about 1 KB of JS, pass `page-check` at desktop and phone, and keep content visible with reduced motion.
Copy from there instead of rewriting.

Testing lesson: scroll-driven reveals (`animation-timeline: view()`) leave below-fold content in its start state until
it's scrolled to, so judge screenshots taken *after* scrolling to the bottom (`page-check` does this).

## 3. Patterns Danish likes (build these well)

- **Pinned chapter story:** a sticky stage with a list of steps. As each step scrolls past, the stage
  swaps its demo, accent colour and caption. Use CSS `view-timeline` per step; JS only if
  the demo itself is interactive.
- **Blueprint to real:** an SVG line drawing (`stroke-dashoffset` scrubbed by scroll) that fills
  in with real colour and content.
- **Live demos inside cards** (bento grid): each cell shows the real thing working, such as a
  typing prompt, a chart drawing itself or a checkout updating, not a static screenshot. Play only while visible
  (pause with IntersectionObserver).
- **Headline reveal:** split into words or letters on the server (spans in the HTML, so SEO keeps the
  text), with a stagger on entry. Keep `aria-label` on the parent and `aria-hidden` on the spans.
- **Charts that draw in** (bklit style): path length animates on view, plus a hover crosshair and tooltip.
- **Prompt-box hero** (v0 style): a real input with cycling placeholder suggestions; chips fill the
  input on click.
- **Particle or dot-field hero** (motion.dev style): canvas, about 2-4k points, capped at 30 fps on
  phones, paused off-screen, static image fallback.

## 4. Accessibility and speed gates (must pass before delivery)

- `@media (prefers-reduced-motion: reduce)`: keep the content, drop the travel (opacity-only or none).
  With Motion, use `MotionConfig reducedMotion="user"`.
- Nothing important starts hidden without a no-JS fallback: content must be visible if JS fails.
- Reserve space for every animated thing (no CLS). Target CLS < 0.05.
- INP < 200 ms: no heavy work in scroll or pointer handlers; use `requestAnimationFrame` or CSS.
- Pause loops and canvases off-screen and when the tab is hidden.
- Run Lighthouse mobile and desktop after motion is added. If Performance drops below 95, move the effect down a tier.
- Check the JS budget with `site-review/scripts/page-check.mjs` (framework baseline + 50 KB gzip per page).
