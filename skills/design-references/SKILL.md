---
name: design-references
description: Pick a real-brand DESIGN.md (from the awesome-design-md collection by VoltAgent) as a design reference for a website — colors, type, spacing, components. Use when a brief names a reference brand or style ("like Apple", "Stripe-style", "Linear vibe"), or when the site needs a strong, consistent design system.
---

# Design references (awesome-design-md)

Source: https://github.com/VoltAgent/awesome-design-md (MIT) — ~80 DESIGN.md files analysing the
design systems of well-known sites (Apple, Stripe, Linear, Airbnb, Notion, Vercel, Nike, Tesla, …).

## When to use

- The brief or Danish names a reference brand / site → use that brand's DESIGN.md.
- No reference given → the `taste-skill` art direction leads; optionally pick one DESIGN.md whose
  mood fits the business (e.g. luxury → Bugatti/Ferrari, clean SaaS → Linear/Vercel, friendly
  consumer → Airbnb) as a secondary reference.

## How

1. Get the catalog: fetch
   `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/README.md`
   — each entry links to `https://getdesign.md/<brand>/design-md`.
2. Fetch the chosen brand's DESIGN.md from that link and save it in the client repo as
   `DESIGN.md` (add a line at the top: `Reference: <brand> via awesome-design-md`).
3. Adapt, don't clone: keep the system (type scale, spacing rhythm, radius, component patterns,
   colour roles) but use the client's own brand colours, logo, imagery and copy. Never copy another
   company's logo, name, wordmark or trade dress.
4. Map tokens into Tailwind theme (colors, fontFamily, borderRadius, spacing) and note the choice
   in `SITE_BRIEF.md` under Layout & design.
