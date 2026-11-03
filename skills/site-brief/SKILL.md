---
name: site-brief
description: Read a website repo and work out exactly what site Danish wants — pages, layout, sections, content, branding — and write it to SITE_BRIEF.md. Use before building any website from a repo.
---

# Site brief

Goal: turn whatever is in the repo into a clear, buildable plan.

## 1. Scan the repo

Look at, in this order:

- `SITE_BRIEF.md` (Danish's template — highest priority), `README.md`, any `docs/`, `.md`, `.txt`, `.pdf`, `.docx`
- `content/`, `assets/`, `images/`, `public/` — logos, photos, icons
- Screenshots, mockups, Figma/reference links (open reference websites and study their layout)
- Existing code — if a site already exists, note stack and what must change

## 2. Extract

| Item | What to capture |
|---|---|
| Business | Name, what they do, location, contact details |
| Audience & goal | Who visits, main call to action (call, book, buy, enquire) |
| Pages | Every page and its URL slug |
| Sections per page | e.g. Hero, Services, About, Testimonials, Gallery, FAQ, Contact, Footer |
| Layout | Order of sections, columns, header style, any reference site to match |
| Branding | Colors (hex), fonts, logo, tone of voice |
| Features | Forms, WhatsApp button, maps, booking, blog, multilingual, e-commerce |
| Assets | Which image goes where; what is missing |

## 3. Write SITE_BRIEF.md

Use the structure from `templates/SITE_BRIEF.md` in this plugin. Fill every field. Add:

- **Assumptions** — choices you made for gaps.
- **Missing from Danish** — things only he can provide.

## 4. Decide

- Critical info missing (business unknown, no pages identifiable) → ask Danish, one batch of questions.
- Otherwise → continue to `build-nextjs-site`.

Default pages when the brief only gives a business: Home, About, Services, Contact.
