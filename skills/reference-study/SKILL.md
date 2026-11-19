---
name: reference-study
description: Study a reference website Danish likes, top to bottom - every section, every scroll, hover and click effect, and the code behind it (libraries, durations, easings, staggers) - and turn it into a tick-list of effects Danish can choose from. Use whenever Danish shares a site, a list of sites, or a video and says "I want something like this", and before building any site that has references.
---

# Reference study

Danish shows you sites he likes. Your job is to understand them as well as the people who built
them, then hand him a short list of effects to pick from. Never guess from one screenshot.

## 0. Get access first

- Sites the cloud workspace can't reach (proxy refusal) → use a browser (the built-in browser
  pane, else Claude in Chrome). Ask for site access once per site with scope "site".
- **The browser pane must be visible** while you capture frames, hover or drag: a hidden pane
  stops rendering and every action times out. Check `tabs_context` first. If it says hidden, ask
  Danish once to press Ctrl+Shift+B, and meanwhile do the code analysis (step 3), which works hidden.
- Instagram / TikTok / YouTube links need a login. Ask Danish to sign in himself (never sign in
  for him), or ask for the site shown in the video, since a live site is far better to study.

## 1. Walk the whole page (desktop 1440×900, then phone 390×844)

1. `resize_window` to 1440×900. Load the page. Read `document.documentElement.scrollHeight`.
2. Capture the **intro frame by frame**: reload, then screenshot at 0, 0.4, 0.8, 1.4 and 2.4 s.
3. Scroll with `javascript_tool` (`window.scrollTo(0, y)`) in steps of about 1.3 screens.
   Wait 2-3 s after each step (scroll-synced timelines are smoothed), then screenshot at scale 0.5.
   Go to the very bottom: the footer often has its own move.
4. In a pinned or scroll-scrubbed section, take 3-4 extra frames inside it to see how it progresses.
5. `get_page_text` once for the section list and copy.
6. Repeat a quick pass at 390×844: note what changes or is dropped on phones.
7. Reset the viewport (`preset: "desktop"`) when finished.

## 2. Interact

- Hover the nav, buttons, cards, links and media: screenshot before and after.
- Click tabs, toggles, accordions and demo controls. Drag sliders, draggables and carousels.
- Move the mouse across the hero (cursor-follow, tilt, magnetic buttons).
- Never submit forms, sign in, buy, or click anything irreversible.

## 3. Read the code (works with the pane hidden)

Keep each `javascript_tool` call small; one heavy call times out.

1. **Stack:** script `src` list, globals (`gsap`, `ScrollTrigger`, `Lenis`, `THREE`, `__NEXT_DATA__`,
   `__NUXT__`), and canvas count and size (WebGL means a heavy scene).
2. **Main bundle:** `fetch()` the largest same-origin script into `window.__src` once, then
   count keywords and pull short context windows. Count `ease:` values, `duration:` values and `delay:` / `stagger(` values (the house timing system),
   and look for `onScroll`/`ScrollTrigger`/`useScroll`/`animation-timeline`/`view-timeline`,
   `startViewTransition`, `spring`, `layout`, `drag`, `IntersectionObserver`, `requestAnimationFrame`.
3. **CSS:** `@keyframes` names; the most common `transition` values; `animation-timeline` use;
   `prefers-reduced-motion` blocks.
4. **Live animations:** `document.getAnimations()` returns duration, easing and target for CSS/WAAPI motion.
5. **Weight:** total JS transferred (`performance.getEntriesByType('resource')`), and whether
   the effect would fit Danish's 120 KB first-load budget.

`scripts/probe.js` in this folder has these checks as small snippets you can paste one at a time.

## 4. Write it up (a doc, one section per site)

For each site:

- One line on its idea and stack (library, versions if visible, JS weight).
- **Look:** background, ink, accents, typefaces, radius, density.
- **Sections table:** scroll position · section · what moves · how it's built.
- **Timing system:** the top easings and durations with counts, plus stagger ranges.
- **Effects you could use:** `- [ ]` tick-boxes, each in Danish's words, saying where it
  would go on *his* site.
- **Speed note:** what it costs and the cheapest way to get the same feel (see `motion-craft`).

End with **shared patterns** across all the references and a short recommended set.
Danish ticks; you build only what he ticked. Save the ticked set to the client's `SITE_BRIEF.md`
under "Motion", and his lasting preferences to `danish-teachings`.

## Rules

- Say exactly what you saw and what you inferred. Don't claim you watched an animation when you only read its code.
- Adapt, never clone: no copying another site's logo, wordmark, copy, illustrations or 3D models.
