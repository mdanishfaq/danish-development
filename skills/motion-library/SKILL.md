---
name: motion-library
description: Danish's motion library - every animation extracted from the production code of his five motion references (animejs.com, motion.dev, kokonutui.com, bklit.com, v0.app), as style-free, tested, ready-to-paste CSS and React components with the exact timings, easings, springs and staggers. Motion only - never the references' colours, fonts or layouts. Use on every site to add animation; pair with motion-craft (which decides where and how much).
---

# Motion library

Danish loves how these five sites **move**, not how they look. This library carries over their motion
and nothing else. The site's design (colour, type, imagery, layout) comes from the brief and art
direction, so it can be as bold and colourful as the client needs. The library has been proven inside a
neon-gradient design (see Testing).

- `recipes/motion.css`: tokens (eases, durations, staggers) + every effect as an `mx-*` class. Paste into `globals.css`.
- `recipes/components.tsx`: server components (0 KB JS): `WordsIn`, `Enter`, `RollingNumber`, `Ring`, `DrawPath`, `RippleGrid`, `Marquee`.
- `recipes/client.tsx`: small client islands (no animation library): `PauseOffscreen`, `WordCycler`, `Story`, `WipeTabs`, `HoldButton`, `SpringFollower`.
- `data/reference-motion.json`: the raw extracted data (all eases, springs, enter/exit pairs, the 142 named anime.js animations, and the CSS keyframes).

Everything is style-free: components output structure + motion classes and take `className` for your design.
Colours come from `currentColor` or your own classes.

## Catalogue

| Effect | Use it for | Values (source) | How |
| --- | --- | --- | --- |
| Blur-up entrance | hero text, cards, any block | opacity 0, blur 2px, y 6 → 0; 240-300 ms `(.23,1,.32,1)`; 50 ms waves (kokonut) | `<Enter effect="blur-up" i={n}>` / `.mx-blur-up` |
| Blur-left entrance | list rows, tool calls | x -6, blur 2px; 30 ms per row (kokonut) | `effect="blur-left"` |
| Slide-up | small UI, captions | y 8, 240 ms expo-out, 40 ms stagger (motion.dev) | `effect="slide-up"` |
| Rise | feature cards | y 16, 450 ms expo-out, 100 ms stagger (motion.dev, v0 `staggerChildren .1`) | `effect="rise"` |
| Pop | markers, badges, chart dots | scale .55 → 1, 350 ms quint-out (bklit) | `effect="pop"` |
| Grow bars | bar charts, progress | scaleY 0 → 1 from the bottom, 30 ms stagger (bklit) | `effect="grow-y"`, `.mx-grow-x` |
| Any entrance on scroll | everything below the fold | same keyframes on `view()` timeline, 0 KB | add `onView` / `.mx-on-view` |
| Word reveal | headlines | words x .35em → 0 + fade, 1000 ms outQuint, 25 ms stagger (anime.js text-appear) | `<WordsIn text=… as="h1">` (keeps gradient text) |
| Word cycler | "Built for ___" lines | chars collapse last→first 25 ms each; next word expands with x 10 → 0 over 150 ms; a dot stretches scaleX 8 → 1; 750 ms gap (anime.js) | `<WordCycler words={[…]}>` |
| Label roll | changing numbers and labels | old leaves y -14 blur, new enters y 14 blur (kokonut) | re-key + `.mx-roll-in` |
| Icon swap | copy → check, play → pause | rotate -30° + blur in, 150 ms (kokonut) | `.mx-icon-in` |
| Rolling digits | stats, prices, counts | each digit rolls its 0-9 column, 1.5 s expo-out on view (motion.dev) | `<RollingNumber value="270">` |
| Line draw | charts, signatures, underlines | stroke draw, 1 s inOutExpo, or scroll-scrubbed (anime.js draw, bklit pathLength) | `<DrawPath>` / `.mx-draw` |
| Score ring | Lighthouse, progress | ring fills to value on view | `<Ring value={96}>` |
| Series focus | charts, card groups | siblings dim to .35, hovered one scales 1.05, 150 ms (bklit) | `.mx-focus-group` + `.mx-focus` |
| Draw-and-erase loader | "building…" states | stroke draws, holds, erases; 1.5 s loop (v0) | `.mx-loader` |
| Grid ripple | hero backgrounds, empty space | dots scale from the centre outward, distance-staggered (anime.js 13×13 stagger) | `<RippleGrid cols rows cell>` |
| Flicker-on | tech details turning on | stepped opacity 0/1, random delay ≤ 800 ms (anime.js) | `.mx-flicker` + `--r` |
| Panel wipe | tab panels, image reveals | clip-path inset 100% → 0, 450 ms `(.25,0,0,1)`, 150 ms delay (motion.dev) | `<WipeTabs>` / `.mx-wipe` |
| Pinned chapter story | how-it-works, process | sticky stage swaps per step, 350 ms inOut(3) (anime.js) | `<Story steps>` |
| Scroll progress bar | long pages | scaleX tied to page scroll, 0 KB (motion.dev useScroll) | `.mx-progress` |
| Accordion | FAQs, details | height 0 → auto + fade, 240 ms (kokonut) | `.mx-collapse` (CSS `interpolate-size`) |
| Hover lift | cards, gallery | y -4, 240 ms (v0) | `.mx-lift` |
| Hover grow / press shrink | playful buttons, draggables | 1.15 hover, .8 press, 350 ms out(3) (anime.js draggable) | `.mx-grow` |
| Press | every button | scale .97 for 80 ms | `.mx-press` |
| Like pop | favourites, toggles | 1 → 1.25 → 1.1 (v0) | `.mx-like[aria-pressed=true]` |
| Focus ping | primary input or CTA | ring pulses outward once, 1.25 s (v0 pulseBorder) | `.mx-ping` |
| Hold to confirm | "start building", destructive actions | fill grows linearly while held, snaps back on release (kokonut BT-05) | `<HoldButton href>` |
| Spring follower | cursor toys, magnetic elements | stiffness 200, damping 18, mass 1 (motion.dev demo) | `<SpringFollower>` |
| Float | badges, logos | 4×8 px drift, 8 s (v0) | `.mx-float` |
| Slow spin | rings, ornaments | 10-64 s linear (anime.js ambient) | `.mx-spin` + `--period` |
| Marquee | logo and platform strips | translateX -50% loop, duplicated row hidden from screen readers (v0 slideShow) | `<Marquee>` |
| Demo loop | "watch it work" mini-UIs | rows cycle out and in (3 s); bars fill and empty (2.4 s) (motion.dev diag) | `.mx-cycle-row`, `.mx-cycle-bar` |
| Shimmer | skeletons | 1.6 s background sweep (motion.dev) | `.mx-shimmer` |
| Page transition | route changes | old: y -12, 160 ms ease-in; new: y 12, 240 ms ease-out (motion.dev) | `@view-transition` (included) or React `<ViewTransition>` |

**Springs** (from `data/`): UI default 500/25; layout 550/30; panels 420/36; light follower 280/28/0.1;
chart tooltip glide 100/15 or 80/15; playful release 120/6. Use them with Motion only when CSS can't do it.

**Signature heroes not in CSS** (need canvas or WebGL, so use one per site at most, lazy-loaded, desktop first):
the anime.js 3D object that turns into a blueprint, and the motion.dev particle sphere sampled from an image.
`motion-craft` explains how to add one within the speed budget.

## Rules

1. Motion only. Never copy the references' colours, fonts, borders, labels or layouts.
2. Pick effects for meaning: entrances reveal content, loops show a product working, numbers count real facts.
   Most pages need 5-8 effects, not all 35.
3. Pause loops off-screen (`<PauseOffscreen>`). One JS animation library at most per site.
4. Everything stays visible without JS and with `prefers-reduced-motion` (handled at the bottom of `motion.css`).
5. Check every page with `site-review/scripts/page-check.mjs`. It fails pages with invisible text or content that never appears.

## Testing (2026-11-19, Next.js 16.4.6 + React 19.3 + Tailwind 4.3)

All components were rendered on one page with a deliberately bold neon gradient design.

- All recipes together add about 1 KB of JS on top of the framework.
- `page-check` passes at desktop and phone.
- Bugs found and fixed while testing: gradient text vanished when a heading was split into words (now inherits `background-clip`), ripple cells collapsed (now square), and `HoldButton` couldn't be used from a Server Component (now takes `href`).
- `page-check` now catches invisible text automatically.
