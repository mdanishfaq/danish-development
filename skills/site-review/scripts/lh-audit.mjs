#!/usr/bin/env node
// Runs Lighthouse on every route (mobile + desktop) and grades against Danish's targets.
// Usage: node lh-audit.mjs http://localhost:3000 [--routes /,/about] [--out .lighthouse]
// Needs: npx lighthouse (downloads on first use) and Chrome/Chromium. If CHROME_PATH is not set,
// it tries Playwright's bundled Chromium. Exit code 1 if any target is missed.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const arg = k => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : null);
const out = arg('--out') || '.lighthouse';
mkdirSync(out, { recursive: true });

const TARGETS = { performance: 95, accessibility: 95, 'best-practices': 95, seo: 100, lcp: 2000, cls: 0.05, tbt: 150 };

if (!process.env.CHROME_PATH) {
  const roots = [join(homedir(), '.cache/ms-playwright'), '/root/.cache/ms-playwright', '/ms-playwright'];
  for (const r of roots) if (existsSync(r)) for (const d of readdirSync(r).filter(d => d.startsWith('chromium'))) {
    for (const p of ['chrome-linux/chrome', 'chrome-linux64/chrome', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium', 'chrome-win/chrome.exe']) {
      if (existsSync(join(r, d, p))) { process.env.CHROME_PATH = join(r, d, p); break; }
    }
    if (process.env.CHROME_PATH) break;
  }
}

let routes = arg('--routes')?.split(',');
if (!routes) {
  try {
    const xml = await (await fetch(base + '/sitemap.xml')).text();
    routes = [...new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1].trim()).pathname))];
  } catch { /* fall through */ }
  if (!routes?.length) routes = ['/'];
}

const rows = [];
for (const route of routes) for (const ff of ['mobile', 'desktop']) {
  const file = join(out, `${(route.replace(/\//g, '_') || '_') === '_' ? 'home' : route.replace(/^\//, '').replace(/\//g, '_')}-${ff}.json`);
  const args = ['-y', 'lighthouse', base + route, '--quiet', '--output=json', `--output-path=${file}`,
    '--chrome-flags=--headless=new --no-sandbox --disable-gpu', '--only-categories=performance,accessibility,best-practices,seo'];
  if (ff === 'desktop') args.push('--preset=desktop'); else args.push('--form-factor=mobile');
  try { execFileSync('npx', args, { stdio: 'ignore', timeout: 180000 }); }
  catch (e) { rows.push({ route, ff, error: 'lighthouse failed: ' + String(e.message).slice(0, 120) }); continue; }
  const j = JSON.parse(readFileSync(file, 'utf8'));
  const c = j.categories, a = j.audits;
  rows.push({
    route, ff,
    performance: Math.round(c.performance.score * 100), accessibility: Math.round(c.accessibility.score * 100),
    'best-practices': Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100),
    lcp: Math.round(a['largest-contentful-paint'].numericValue), cls: +a['cumulative-layout-shift'].numericValue.toFixed(3),
    tbt: Math.round(a['total-blocking-time'].numericValue),
    failing: Object.values(a).filter(x => x.score !== null && x.score < 0.9 && x.scoreDisplayMode === 'binary').map(x => x.id).slice(0, 8),
  });
}

let misses = 0;
console.log('route'.padEnd(26), 'ff'.padEnd(8), 'Perf A11y BP  SEO  LCPms  CLS    TBTms  verdict');
for (const r of rows) {
  if (r.error) { misses++; console.log(r.route.padEnd(26), r.ff.padEnd(8), r.error); continue; }
  const miss = [];
  for (const k of ['performance', 'accessibility', 'best-practices', 'seo']) if (r[k] < TARGETS[k]) miss.push(`${k} ${r[k]}<${TARGETS[k]}`);
  if (r.lcp > TARGETS.lcp) miss.push(`LCP ${r.lcp}ms`);
  if (r.cls > TARGETS.cls) miss.push(`CLS ${r.cls}`);
  if (r.tbt > TARGETS.tbt) miss.push(`TBT ${r.tbt}ms`);
  r.miss = miss; if (miss.length) misses++;
  console.log(r.route.padEnd(26), r.ff.padEnd(8), String(r.performance).padEnd(4), String(r.accessibility).padEnd(4), String(r['best-practices']).padEnd(3), String(r.seo).padEnd(4), String(r.lcp).padEnd(6), String(r.cls).padEnd(6), String(r.tbt).padEnd(6), miss.length ? 'MISS ' + miss.join('; ') + (r.failing.length ? ' | failing audits: ' + r.failing.join(',') : '') : 'PASS');
}
writeFileSync(join(out, 'summary.json'), JSON.stringify({ base, targets: TARGETS, rows }, null, 2));
console.log(`\n${rows.length - misses}/${rows.length} runs meet every target. Summary: ${join(out, 'summary.json')}`);
process.exit(misses ? 1 : 0);
