---
name: build-nextjs-site
description: Build a production-quality website in Next.js (App Router) + TypeScript + Tailwind from a SITE_BRIEF.md. Use after the site brief is ready.
---

# Build the Next.js site

## Setup

If the repo has no app yet:

```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```

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
- Brand colors as Tailwind theme tokens; fonts via `next/font/google`.
- `next/image` for all images, with `alt` text.
- Mobile-first; sticky header with mobile menu; footer with contact and socials.
- Contact form: client-side validation; submit to `mailto:` or Formspree placeholder unless
  the brief specifies a backend. Floating WhatsApp button if a phone number is given (common
  for Pakistani businesses).
- Metadata per page (title, description, Open Graph).
- No unused dependencies. Add `framer-motion` only if animations are requested.

## Verify before finishing

```bash
npm run build
npx next start -p 3000 &   # then screenshot with Playwright
```

Screenshot every route at 1440×900 and 390×844, view them, fix overflow, spacing, contrast
and broken images. Re-run `npm run build`. Only then continue to `deploy-demo`.
