---
name: build-nextjs-site
description: Build a production-quality website in Next.js (App Router) + TypeScript + Tailwind from a SITE_BRIEF.md. Use after the site brief is ready.
---

# Build the Next.js site

## Setup

Check versions with `stay-current` first. If the repo has no app yet:

```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```

This gives Next.js 16.4+ with React 19.3, Tailwind v4 and Cache Components on. For a brochure or marketing
site, add `export const ensureStatic = 'navigation'` to `src/app/layout.tsx` so the build fails if a page turns dynamic.
Turn on `reactCompiler: true` in `next.config.ts`.

If the repo has non-code files at the root, move them into `_source/` first, then run the
command, then copy images into `public/images/`.

If the repo already has a Next.js app, work inside it and keep its conventions.

## Structure

```
src/
  app/
    layout.tsx          # fonts, metadata, Header, Footer
    page.tsx            # Home
    <slug>/page.tsx     # one folder per page in the brief
    sitemap.ts
    robots.ts
  components/
    layout/Header.tsx Footer.tsx
    sections/Hero.tsx Services.tsx ... (one per section type)
    ui/Button.tsx Container.tsx
  content/site.ts       # ALL text, links, contact info — easy for Danish to edit
public/images/
```

## Rules

- Section order and layout exactly as the brief says.
- Real content from the repo. If a piece is missing, write sensible placeholder copy that fits
  the business and mark it `// TODO: confirm with client` in `site.ts`.
- Brand colors, type scale and motion tokens in Tailwind v4's `@theme { }` block in `globals.css` (no tailwind.config.js); fonts via `next/font/google`.
- Animation follows `motion-craft`: CSS and scroll-driven CSS first, `<ViewTransition>` for page changes, Motion (LazyMotion) or anime.js only for what CSS can't do.
- `next/image` for all images, with `alt` text.
- Mobile-first; sticky header with mobile menu; footer with contact and socials.
- Contact form: client-side validation; submit to `mailto:` or Formspree placeholder unless
  the brief specifies a backend. Floating WhatsApp button if a phone number is given (common
  for Pakistani businesses).
- Metadata per page (title, description, Open Graph).
- No unused dependencies. Use `motion` (not the old `framer-motion` package name) only when CSS can't do the job.
- `robots.ts` allows AI search crawlers (see `stay-current`).

## Design inputs

- Follow the direction chosen with `taste-skill` (type, palette, compositions, imagery).
- If a `DESIGN.md` exists in the repo (from `design-references`), map its tokens into the
  Tailwind theme and follow its component rules, using the client's own brand assets.

## Verify before finishing

```bash
npm run build
npx next start -p 3000 &
which playwright-cli || npm install -g @playwright/cli@latest
playwright-cli open http://localhost:3000
```

With `playwright-cli`: visit every route, screenshot at 1440×900 and 390×844, click nav links,
buttons and forms, and read console errors. View the screenshots and fix overflow, spacing,
contrast and broken images. Then run `web-design-guidelines` on `src/` and fix the findings.
Then check SEO and speed with Lighthouse on the production build (home + every page, mobile and desktop):

```bash
npx lighthouse http://localhost:3000/ --form-factor=mobile --quiet --chrome-flags="--headless" --output=json --output-path=./.lighthouse/home-mobile.json
npx lighthouse http://localhost:3000/ --preset=desktop --quiet --chrome-flags="--headless" --output=json --output-path=./.lighthouse/home-desktop.json
```

Targets (from `danish-teachings`): Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95,
SEO = 100, LCP < 2.0s, CLS < 0.05. Also check the `next build` output: first-load JS per route
under 120 KB. If any target is missed, fix the cause (image sizes, client components, fonts,
third-party scripts) and re-run. Put the final scores in the report to Danish.
Validate structured data JSON-LD parses, and that `/sitemap.xml` and `/robots.txt` load.
Add `.lighthouse/` to `.gitignore`.

For a revamp, also run Lighthouse on the old live site first and report before/after.
Compare final screenshots with the reference sites side by side and fix anything that falls short.

Re-run `npm run build`. Only then continue to `deploy-demo`.
