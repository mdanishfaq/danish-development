---
name: danish-teachings
description: Danish's personal rules and preferences for every website — design taste, tools, plugins, conventions he has taught the agent. Load at the start of every website job; these rules override defaults.
---

# Danish's teachings

Rules here override everything else. Add new ones with the `/teach` command.
Newest rules go at the bottom of their section. Format: `- <rule> (added YYYY-MM-DD)`

## Design

- Motion matters: Danish likes how animejs.com, motion.dev, kokonutui.com, bklit.com and v0.app **move**, NOT how they look. Use their animations (the `motion-library` skill) on every site; never copy their plain white or black, minimal, technical styling. (added 2026-11-19, clarified 2026-11-19)
- Design must not be boring or dull. Go for bold, rich, eye-catching design (strong colour, big expressive type, real artwork and imagery, depth). Plain minimal "developer-tool" looks are out unless Danish asks. Where taste-skill's restraint rules (no gradients, no glow, no shadows) block that, Danish's taste wins. (added 2026-11-19)

## Tech stack & plugins

- Default stack: Next.js (App Router) + TypeScript + Tailwind CSS. (added 2026-11-03)
- Use taste-skill for art direction on every site; no generic template look. (added 2026-11-03)
- Run web-design-guidelines review on every site before delivering. (added 2026-11-03)
- Use awesome-design-md DESIGN.md files as design references when a style or brand is named. (added 2026-11-03)
- Use playwright-cli for browser testing and screenshots. (added 2026-11-03)
- Always build on the current stable versions: run the `stay-current` check at the start of every job. (added 2026-11-19)
- Animation: use the cheapest tier that gives the feel (CSS, then scroll-driven CSS, then View Transitions, then Motion or anime.js, then WebGL), following `motion-craft`. One JS animation library per site at most. (added 2026-11-19)

## SEO (every site must be SEO-optimized)

- Unique `<title>` (50–60 chars) and meta description (140–160 chars) on every page, with the business name and main keyword + city where relevant. (added 2026-11-03)
- Exactly one H1 per page; logical H2/H3 order; semantic HTML (header, nav, main, section, footer). (added 2026-11-03)
- Clean URL slugs (`/services/web-design`), canonical URLs, `sitemap.xml`, `robots.txt`, favicon and Open Graph + Twitter images. (added 2026-11-03)
- JSON-LD structured data: `Organization` or `LocalBusiness` (name, address, phone, hours, socials) on Home; `FAQPage` where there is an FAQ; `BreadcrumbList` on inner pages. (added 2026-11-03)
- Descriptive `alt` text on every image; meaningful link text (no "click here"); internal links between related pages. (added 2026-11-03)
- Pages must be server-rendered or statically generated so all text is in the HTML; no content hidden behind client-only JS. (added 2026-11-03)
- Lighthouse SEO score must be 100. (added 2026-11-03)
- AI search: allow AI search crawlers (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Claude-User) in robots; write answer-first copy on service pages; set up Google Business Profile details in LocalBusiness schema. (added 2026-11-19)

## Speed (every site must be fast)

- Lighthouse Performance ≥ 95 on mobile and desktop; Accessibility and Best Practices ≥ 95. (added 2026-11-03)
- Core Web Vitals targets: LCP < 2.0s, CLS < 0.05, INP < 200ms, TBT < 150ms. (added 2026-11-03)
- Static generation by default; React Server Components; `"use client"` only for small interactive parts. (added 2026-11-03)
- Images via `next/image` (AVIF/WebP, correct `sizes`), hero image `priority`, everything below the fold lazy-loaded; no image larger than needed. (added 2026-11-03)
- Fonts via `next/font` (self-hosted, `display: swap`), max 2 families. (added 2026-11-03)
- JS budget: the site's own JS adds at most 50 KB (gzip) on top of the Next.js framework baseline, so about 190 KB total per page on Next 16. (Changed 2026-11-19: the old "under 120 KB" rule can't be met, because a blank Next.js 16 + React 19.3 app already ships about 138 KB gzip.) No heavy libraries (no jQuery, no big UI kits, no full icon packs — import single icons); no carousels/sliders unless asked. (added 2026-11-03, budget updated 2026-11-19)
- Third-party scripts (analytics, chat, maps) load with `next/script` `lazyOnload` or on interaction; Google Maps as a static image/link that loads the embed on click. (added 2026-11-03)
- Reserve space for images/embeds (width/height or aspect-ratio) so nothing shifts while loading. (added 2026-11-03)

## Content & copy

- (empty)

## Workflow

- Deliver a demo link; Danish attaches domain and hosting later. (added 2026-11-03)
- Read the repo to decide pages and layout; ask only when something critical is missing. (added 2026-11-03)
- Ask all questions in one batch at the start, never a drip of questions; find things yourself first (repo, live site, project notes, web). (added 2026-11-19)
- Research is the agent's job: keep up with new web trends and tools without being asked. (added 2026-11-19)
- For a revamp, keep every working feature and all real content; show before/after Lighthouse scores. (added 2026-11-19)
- Check your own work (screenshots, Lighthouse, a comparison with the references) before showing Danish anything. (added 2026-11-19)

## Never do

- (empty)
