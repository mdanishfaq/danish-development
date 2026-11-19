#!/usr/bin/env node
// Real-browser check of every route at desktop and phone width.
// Usage: node page-check.mjs http://localhost:3000 [--routes /,/about] [--out .review]
// For each route x viewport: full-page screenshot, console errors, failed requests, broken images,
// horizontal overflow, JS shipped (KB, gzip), and a reduced-motion pass.
// Needs Playwright (`npm i -D playwright` or a global install). Exit code 1 on any FAIL.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
let chromium;
for (const load of [
  () => import('playwright'),
  () => createRequire(process.cwd() + '/')('playwright'),
  () => createRequire(execSync('npm root -g').toString().trim() + '/')('playwright'),
]) { try { ({ chromium } = await load()); if (chromium) break; } catch {} }
if (!chromium) { console.error('Playwright not found: run `npm i -D playwright` (browsers: `npx playwright install chromium`).'); process.exit(2); }

const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const arg = k => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : null);
const out = arg('--out') || '.review';
// Measured 2026-11-19: a blank create-next-app (Next 16.4.6 + React 19.3) ships ~138 KB gzip (~118 KB brotli).
// Budget = that framework baseline + 50 KB of the site's own JS. Override with JS_BUDGET_KB.
const JS_BUDGET_KB = +(process.env.JS_BUDGET_KB || 190);
mkdirSync(out, { recursive: true });

let routes = arg('--routes')?.split(',');
if (!routes) {
  try { const xml = await (await fetch(base + '/sitemap.xml')).text(); routes = [...new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1].trim()).pathname))]; } catch {}
  if (!routes?.length) routes = ['/'];
}
const VIEWPORTS = [{ name: 'desktop', width: 1440, height: 900 }, { name: 'phone', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }];

const browser = await chromium.launch();
const report = [];
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor || 1 });
  for (const route of routes) {
    const page = await ctx.newPage();
    const errors = [], failed = [], bodies = []; let jsBytes = 0;
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
    page.on('pageerror', e => errors.push('pageerror: ' + String(e).slice(0, 160)));
    page.on('requestfailed', r => failed.push(r.url().slice(0, 120)));
    page.on('response', r => { if (r.request().resourceType() === 'script') bodies.push(r.body().then(b => { jsBytes += gzipSync(b).length; }).catch(() => {})); }); // gzip size, like Next's First Load JS
    const resp = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => null);
    // scroll through so lazy content and scroll animations run
    await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); });
    await page.waitForTimeout(400);
    const facts = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      brokenImgs: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.currentSrc || i.src).slice(0, 5),
      hiddenAfterScroll: [...document.querySelectorAll('h1,h2,h3,p')].filter(e => { const s = getComputedStyle(e); return e.textContent.trim() && (s.opacity === '0' || s.visibility === 'hidden'); }).length,
      tapTargetsSmall: matchMedia('(pointer: coarse)').matches ? [...document.querySelectorAll('a,button')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height && (r.width < 24 || r.height < 24); }).length : 0,
    }));
    const slug = (route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '_')) + '-' + vp.name;
    await page.screenshot({ path: join(out, slug + '.png'), fullPage: true });
    const issues = [];
    if (!resp || resp.status() !== 200) issues.push(['FAIL', `status ${resp?.status() ?? 'no response'}`]);
    if (errors.length) issues.push(['FAIL', `console errors: ${errors.slice(0, 3).join(' | ')}`]);
    if (failed.length) issues.push(['WARN', `failed requests: ${failed.slice(0, 3).join(' | ')}`]);
    if (facts.overflow > 1) issues.push(['FAIL', `horizontal overflow ${facts.overflow}px`]);
    if (facts.brokenImgs.length) issues.push(['FAIL', `broken images: ${facts.brokenImgs.join(', ')}`]);
    if (facts.hiddenAfterScroll) issues.push(['FAIL', `${facts.hiddenAfterScroll} text elements still invisible after scrolling (animation never revealed them)`]);
    if (facts.tapTargetsSmall) issues.push(['WARN', `${facts.tapTargetsSmall} tap targets smaller than 24px`]);
    await Promise.all(bodies);
    const kb = Math.round(jsBytes / 1024);
    if (vp.name === 'desktop' && kb > JS_BUDGET_KB) issues.push(['FAIL', `JS shipped ${kb} KB > ${JS_BUDGET_KB} KB budget`]);
    report.push({ route, viewport: vp.name, jsKB: kb, screenshot: join(out, slug + '.png'), issues });
    await page.close();
  }
  await ctx.close();
}
// Reduced motion: content must be fully visible with no scrolling needed to reveal it.
const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
for (const route of routes) {
  const p = await rm.newPage(); await p.goto(base + route, { waitUntil: 'networkidle' }).catch(() => {});
  const hidden = await p.evaluate(() => [...document.querySelectorAll('h1,h2,h3,p')].filter(e => { const s = getComputedStyle(e); return e.textContent.trim() && (s.opacity === '0' || s.visibility === 'hidden'); }).length);
  if (hidden) report.push({ route, viewport: 'reduced-motion', issues: [['FAIL', `${hidden} text elements hidden with prefers-reduced-motion`]] });
  await p.close();
}
await browser.close();

let fails = 0;
for (const r of report) {
  const lvl = r.issues.some(i => i[0] === 'FAIL') ? 'FAIL' : r.issues.length ? 'WARN' : 'PASS';
  if (lvl === 'FAIL') fails++;
  console.log(`${lvl.padEnd(4)}  ${r.route.padEnd(26)} ${r.viewport.padEnd(14)} ${r.jsKB !== undefined ? (r.jsKB + ' KB JS').padEnd(10) : ''.padEnd(10)} ${r.issues.map(i => i[1]).join(' ; ')}`);
}
writeFileSync(join(out, 'page-check.json'), JSON.stringify(report, null, 2));
console.log(`\nScreenshots in ${out}/ — open every one before scoring. ${fails} page/viewport combos FAIL.`);
process.exit(fails ? 1 : 0);
