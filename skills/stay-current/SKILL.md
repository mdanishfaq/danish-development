---
name: stay-current
description: Keep Danish Development up to date with the web - current versions of Next.js, React, Tailwind and Motion, new browser features, Core Web Vitals, and how Google and AI assistants find sites. Use at the start of every website job (a 5-minute freshness check), and whenever Danish asks what's new.
---

# Stay current

The web changes every month. Before each build, check that what you are about to use is still current.

## 1. Freshness check (every job, about 5 minutes)

Run these and compare with the snapshot below. If anything moved, use the new version and update this file.

```bash
npm view next version
npm view react version
npm view tailwindcss version
npm view motion version
npm view animejs version
```

Then search the web for "<library> latest release" if a major version changed, and read the
official release post (nextjs.org/blog, react.dev/blog, tailwindcss.com/blog, motion.dev/changelog)
before using new APIs. Search results are not sources: open the page.

## 2. Snapshot (verified 19 Nov 2026)

**Stack**

- **Next.js 16.4** (6 Oct 2026; patches 16.4.6). Ships **React 19.3**. 16 is the Active LTS. Security fixes now ship on a monthly schedule, so always install the latest patch (`npm i next@latest`).
  - **Cache Components** (`cacheComponents: true`, `partialPrefetching: true`) is now the recommended model and on by default in new `create-next-app` apps. It becomes the default in Next.js 17.
  - `export const ensureStatic = 'navigation'` on a marketing site's root layout makes the build fail if anything turns dynamic. Use it on brochure sites.
  - React Compiler is stable (`reactCompiler: true`). Turbopack is the default bundler, and the Bundle Analyzer can diff bundles.
  - `npx next@canary upgrade --agent=latest` upgrades an existing app with agent guidance.
- **React 19.3** (9 Sep 2026): `<ViewTransition>` and `addTransitionType` are **stable**, and so are Fragment Refs.
- **Tailwind CSS v4.3** (May 2026): CSS-first config. Put tokens in `@theme { }` in `globals.css`. There's no `tailwind.config.js` unless needed. Use logical-property utilities and the new scrollbar utilities.
- **Motion 14.x** (Nov 2026): `motion/react`. New `tap` prop, pinch and rotate gestures, `animateLayout` for vanilla JS, a smaller `useSpring`/`drag`/`m`. Use `LazyMotion` + `m` for about 5 KB.
- **anime.js v4**: modular ES imports (`animate`, `createTimeline`, `stagger`, `onScroll`, `createDraggable`, `svg`).

**Browser platform**

- **Scroll-driven animations are Baseline** (Firefox 159, 27 Oct 2026, joins Chrome 115 and Safari 26). Use CSS first.
- **View Transitions:** same-document in every browser; cross-document (`@view-transition`) in Chrome, Edge and Safari 18.2+, while Firefox does a plain navigation (fine as a fallback). Both are Interop 2026 focus areas.

**Speed and ranking**

- Core Web Vitals are unchanged in 2026: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at the 75th percentile.
  (Some blogs claim LCP moved to 2.0 s. Google's docs don't say so.) Danish's own targets are
  stricter (LCP < 2.0 s, CLS < 0.05) and still apply.

**Search and AI assistants**

- Google's AI search guide (May 2026): AI Overviews and AI Mode run on normal Search ranking. **AEO/GEO is "still SEO"**:
  indexable pages, semantic HTML, original non-commodity content, structured data for rich results,
  Google Business Profile and Merchant Center for local businesses and shops. Google says to ignore
  llms.txt, content "chunking", AI-specific rewrites and special schema.
- ChatGPT search (via Bing and its own crawl), Perplexity and Claude cite pages they can fetch. In `robots.ts`, allow
  `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Claude-SearchBot` and `Claude-User`
  (training bots like `GPTBot` are Danish's or the client's choice; default allow).
- `llms.txt` is optional and cheap. Add it only for docs-heavy or SaaS sites, never instead of the SEO basics.
- Write answer-first copy: each service page opens with a plain one-sentence answer (what, for whom, price or where),
  then the details. Clear FAQs with `FAQPage` schema still help.

**Design direction in 2026 (taste, not rules)**

- Scroll-driven storytelling, kinetic or oversized type, bento grids with **live demos** in the cells,
  dark-first palettes with one bright accent, real product UI instead of stock images, purposeful micro-interactions.
- Fading: hero sliders, scroll-jacking, decoration with no meaning, heavy WebGL backgrounds with no purpose.

## 3. Sources (re-check these)

- https://nextjs.org/blog/next-16-4
- https://endoflife.date/nextjs
- https://react.dev/blog/2026/09/09/react-19-3
- https://endoflife.date/tailwind-css
- https://motion.dev/changelog
- https://developer.mozilla.org/en-US/Firefox/Releases/159
- https://web.dev/blog/web-platform-10-2026
- https://www.searchenginejournal.com/googles-new-ai-search-guide-calls-aeo-and-geo-still-seo/575026/

When a check finds something new, update the snapshot and its date, and commit `stay-current: <what changed>`.
