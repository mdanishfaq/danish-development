---
name: site-review
description: Independent quality gate for every website Danish Development builds - runs the SEO checker, real-browser page checks and Lighthouse on the production build, looks at every screenshot, compares the site with Danish's references, and returns a scored verdict (SHIP or FIX with a ranked fix list). Used by the danish-reviewer agent, and by /review-site on any site.
---

# Site review

The builder is biased toward its own work. This review is done as an outsider whose job
is to find what's wrong before Danish does. Measure first, then look, then judge.

## 1. Run the production build (never review a dev server)

```bash
npm run build && (npx next start -p 3100 > /tmp/next.log 2>&1 &) && sleep 4
```

For a deployed site, use its URL instead of `http://localhost:3100`.

## 2. Measure (scripts in this folder)

```bash
S=<this skill folder>/scripts
node $S/check-seo.mjs   http://localhost:3100 --json .review/seo.json   # every rule in danish-teachings SEO
node $S/page-check.mjs  http://localhost:3100 --out .review             # screenshots 1440 + 390, console, overflow, JS KB, reduced motion
node $S/lh-audit.mjs    http://localhost:3100 --out .lighthouse          # Lighthouse mobile + desktop, every route
node <taste-skill>/scripts/lint.mjs src                                  # banned patterns
node <taste-skill>/scripts/inspect.mjs http://localhost:3100             # design inspector (equal margins, headline lines, blank stretches)
```

`page-check.mjs` needs Playwright (`npm i -D playwright`). `lh-audit.mjs` uses `npx lighthouse` and Playwright's Chromium.
Also run `web-design-guidelines` on `src/` (it fetches the latest Vercel rules).

Notes from testing (2026-11-19, Next 16.4.6):
- `next build` no longer prints first-load JS per route, so `page-check` measures the real JS shipped (gzip) in the browser.
- Lab numbers are noisy in a cloud sandbox (a blank app scored mobile TBT 152 ms). If a metric misses by under 10%,
  re-run that route twice and use the median before failing it.
- In the cloud workspace `next/font/google` can't reach Google Fonts, so the build fails. Self-host fonts:
  `npm i @fontsource-variable/<font>` and `next/font/local` pointing at its `.woff2` file.

## 3. Look (no skipping)

Open **every** screenshot `page-check` saved: every route at desktop and phone. For each one, note:

- The first screen: within 5 seconds, can a stranger say what this is and what to do?
- Hierarchy, spacing rhythm, alignment, contrast, broken or blurry images, text against edges.
- Does the phone layout look designed for a phone, or just squeezed?
- Motion: did anything stay invisible? Does the reduced-motion version still show everything?

Then put the site next to the references Danish named (the reference-study doc). Is the motion as
crisp? Is the type as confident? Is it as dense with real content? Name the specific gap.

## 4. Score

**Hard gates** (any fail means FIX, whatever the score):

| Gate | Source |
| --- | --- |
| `npm run build` passes with no errors | build log |
| check-seo: 0 FAIL | check-seo |
| page-check: 0 FAIL (no console errors, overflow, broken images, hidden content, JS within budget: framework + 50 KB gzip) | page-check |
| Lighthouse every route, mobile and desktop: Perf ≥ 95, A11y ≥ 95, BP ≥ 95, SEO = 100, LCP < 2.0 s, CLS < 0.05, TBT < 150 ms | lh-audit |
| taste-skill inspector: 0 FAIL | inspect |
| Every working feature of the old site still works (revamps) | manual click-through |
| Real content, no lorem ipsum, no invented reviews or stats | read the pages |

**Quality score** (0-10 each, weighted):

| Area | Weight | 10 means |
| --- | --- | --- |
| First impression and clarity | 20% | the purpose and the action are obvious in 5 s; it looks made for this client |
| Visual design | 20% | confident type, real imagery, consistent spacing, no template feel, matches the references' level |
| Motion | 15% | purposeful, smooth, references' quality, reduced-motion safe |
| Mobile | 15% | its own phone composition, thumb-friendly, nothing cramped |
| Content and conversion | 15% | complete sections, answer-first copy, clear CTAs, trust built with real proof |
| Code quality | 15% | server components by default, small client islands, content in `src/content`, no dead code or unused deps |

**Verdict:** **SHIP** only if all gates pass and the weighted score is ≥ 8.0. Otherwise **FIX**.

## 5. Report (this exact shape)

```
VERDICT: SHIP | FIX        Score: 7.4/10   Round: 1 of 3
Gates:   build ✓  seo ✗ (3)  pages ✓  lighthouse ✗ (/pricing mobile Perf 88)  inspector ✓  features ✓  content ✓
Scores:  first 8 · design 7 · motion 6 · mobile 7 · content 8 · code 8

Fix list (most important first; each with file and the exact change):
1. /pricing mobile LCP 3.1 s: hero image 1.4 MB PNG, src/components/sections/PricingHero.tsx → next/image, priority, sizes="100vw", AVIF.
2. ...

Compared with references: <one or two lines on the biggest gap>
What is already good: <two or three lines, so the builder doesn't undo it>
```

Rules: every finding comes from a measurement or a screenshot you actually opened, never from reading code alone.
At most 3 review rounds; if it still fails after round 3, ship to Danish with the open issues listed honestly.
