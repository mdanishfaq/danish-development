#!/usr/bin/env node
// SEO + structure checker for a running site (production build).
// Usage: node check-seo.mjs http://localhost:3000 [--json out.json]
// Reads /sitemap.xml for routes (falls back to "/"), then checks every page against
// Danish's SEO rules. Exit code 1 if any FAIL. No dependencies (Node 18+).

const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const jsonOut = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : null;
const AI_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Claude-SearchBot', 'Claude-User'];

const results = [];
const add = (page, level, rule, detail = '') => results.push({ page, level, rule, detail });

async function get(url) {
  try { const r = await fetch(url, { redirect: 'manual' }); return { status: r.status, text: await r.text(), headers: r.headers }; }
  catch (e) { return { status: 0, text: '', error: String(e) }; }
}
const strip = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const attr = (tag, name) => { const m = tag.match(new RegExp(`${name}\\s*=\\s*(["'])(.*?)\\1`, 'i')); return m ? m[2] : null; };
const metaContent = (html, key, val) => {
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) if ((attr(m[0], key) || '').toLowerCase() === val.toLowerCase()) return attr(m[0], 'content');
  return null;
};

// Site-level files
const robots = await get(base + '/robots.txt');
if (robots.status !== 200) add('/robots.txt', 'FAIL', 'robots.txt loads', `status ${robots.status}`);
else {
  if (!/sitemap:/i.test(robots.text)) add('/robots.txt', 'WARN', 'robots.txt links the sitemap');
  if (/^\s*disallow:\s*\/\s*$/im.test(robots.text) && !/allow:\s*\/\s*$/im.test(robots.text)) add('/robots.txt', 'FAIL', 'robots.txt does not block the whole site');
  for (const bot of AI_BOTS) {
    const block = new RegExp(`user-agent:\\s*${bot}[\\s\\S]*?disallow:\\s*/\\s*$`, 'im');
    if (block.test(robots.text)) add('/robots.txt', 'FAIL', `AI search crawler allowed: ${bot}`);
  }
}
const sm = await get(base + '/sitemap.xml');
let routes = ['/'];
if (sm.status !== 200) add('/sitemap.xml', 'FAIL', 'sitemap.xml loads', `status ${sm.status}`);
else {
  const locs = [...sm.text.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim());
  if (!locs.length) add('/sitemap.xml', 'FAIL', 'sitemap.xml lists pages');
  routes = [...new Set(locs.map(u => { try { return new URL(u).pathname; } catch { return u; } }))];
  if (!routes.includes('/')) routes.unshift('/');
}
const favicon = await get(base + '/favicon.ico');
if (favicon.status !== 200) {
  const home = await get(base + '/');
  if (!/<link[^>]+rel=["'][^"']*icon/i.test(home.text)) add('/', 'FAIL', 'favicon present');
}
const notFound = await get(base + '/this-page-should-not-exist-404-check');
if (notFound.status !== 404) add('/404', 'WARN', 'unknown URLs return 404', `status ${notFound.status}`);

const titles = new Map(), descs = new Map();
for (const path of routes) {
  const r = await get(base + path);
  if (r.status !== 200) { add(path, 'FAIL', 'page loads with 200', `status ${r.status}`); continue; }
  const h = r.text;
  const head = (h.match(/<head[\s\S]*?<\/head>/i) || [''])[0];

  const lang = attr((h.match(/<html\b[^>]*>/i) || [''])[0], 'lang');
  if (!lang) add(path, 'FAIL', '<html lang> set');

  const title = strip((head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1]);
  if (!title) add(path, 'FAIL', 'title present');
  else {
    if (title.length < 30 || title.length > 65) add(path, title.length > 70 || title.length < 25 ? 'FAIL' : 'WARN', 'title 50-60 chars', `${title.length}: "${title}"`);
    if (titles.has(title)) add(path, 'FAIL', 'title unique', `same as ${titles.get(title)}`); else titles.set(title, path);
  }
  const desc = metaContent(head, 'name', 'description');
  if (!desc) add(path, 'FAIL', 'meta description present');
  else {
    if (desc.length < 120 || desc.length > 165) add(path, desc.length > 180 || desc.length < 70 ? 'FAIL' : 'WARN', 'meta description 140-160 chars', `${desc.length}`);
    if (descs.has(desc)) add(path, 'FAIL', 'meta description unique', `same as ${descs.get(desc)}`); else descs.set(desc, path);
  }
  const canon = (head.match(/<link[^>]+rel=["']canonical["'][^>]*>/i) || [null])[0];
  if (!canon) add(path, 'FAIL', 'canonical link');
  else if (!/^https?:\/\//.test(attr(canon, 'href') || '')) add(path, 'WARN', 'canonical is absolute URL', attr(canon, 'href'));
  for (const og of ['og:title', 'og:description', 'og:image', 'og:url']) if (!metaContent(head, 'property', og)) add(path, og === 'og:url' ? 'WARN' : 'FAIL', `Open Graph ${og}`);
  if (!metaContent(head, 'name', 'twitter:card')) add(path, 'WARN', 'twitter:card');
  if (!metaContent(head, 'name', 'viewport')) add(path, 'FAIL', 'viewport meta');
  const robotsMeta = metaContent(head, 'name', 'robots');
  if (robotsMeta && /noindex/i.test(robotsMeta)) add(path, 'FAIL', 'page is indexable', robotsMeta);

  const body = (h.match(/<body[\s\S]*<\/body>/i) || [h])[0].replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  const h1s = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1s.length !== 1) add(path, 'FAIL', 'exactly one H1', `found ${h1s.length}`);
  const levels = [...body.matchAll(/<h([1-6])\b/gi)].map(m => +m[1]);
  for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) { add(path, 'WARN', 'heading levels in order', `h${levels[i - 1]} → h${levels[i]}`); break; }
  for (const tag of ['header', 'nav', 'main', 'footer']) if (!new RegExp(`<${tag}\\b`, 'i').test(body)) add(path, 'FAIL', `<${tag}> landmark`);

  const imgs = [...body.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
  const noAlt = imgs.filter(t => attr(t, 'alt') === null);
  if (noAlt.length) add(path, 'FAIL', 'every <img> has alt', `${noAlt.length} missing`);
  const noSize = imgs.filter(t => !attr(t, 'width') || !attr(t, 'height'));
  if (noSize.length) add(path, 'WARN', 'images have width/height (no CLS)', `${noSize.length} without`);

  const badLinks = [...body.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].filter(m => /^(click here|here|read more|more|learn more)$/i.test(strip(m[1])) && !attr(m[0], 'aria-label'));
  if (badLinks.length) add(path, 'WARN', 'descriptive link text', `${badLinks.length} vague links`);
  const internal = [...body.matchAll(/<a\b[^>]*href=["'](\/[^"'#?]*)/gi)].map(m => m[1]);
  if (internal.length < 3) add(path, 'WARN', 'internal links to related pages', `${internal.length}`);

  const text = strip(body);
  if (text.split(' ').length < 120) add(path, 'WARN', 'content is in the server HTML (not client-only)', `${text.split(' ').length} words in HTML`);

  const ld = [...h.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const types = [];
  for (const m of ld) {
    try { const j = JSON.parse(m[1]); const walk = o => { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (o['@type']) types.push([].concat(o['@type']).join('/')); if (o['@graph']) walk(o['@graph']); } }; walk(j); }
    catch (e) { add(path, 'FAIL', 'JSON-LD parses', String(e).slice(0, 80)); }
  }
  if (path === '/') {
    const BIZ = /Organization|Business|Service|Store|Shop|Restaurant|Bakery|Cafe|Bar|Hotel|Lodging|Clinic|Dentist|Physician|Hospital|Pharmacy|Attorney|Legal|Agency|Corporation|School|Gym|Salon|Spa|Contractor|Plumber|Electrician|RealEstate|Dealer|Brewery|Winery|Repair|Center/;
    const generic = /^(WebSite|WebPage|BreadcrumbList|FAQPage|ItemList|ImageObject|SearchAction|Person)$/;
    if (!types.some(t => BIZ.test(t))) add(path, types.some(t => !generic.test(t)) ? 'WARN' : 'FAIL', 'Organization/LocalBusiness JSON-LD on home', types.join(',') || 'none');
  }
  if (path !== '/' && !types.some(t => /BreadcrumbList/.test(t))) add(path, 'FAIL', 'BreadcrumbList JSON-LD on inner page');
  if (/<(details|summary)\b|faq/i.test(path + body.slice(0, 200000)) && /faq/i.test(path) && !types.some(t => /FAQPage/.test(t))) add(path, 'FAIL', 'FAQPage JSON-LD on FAQ page');
}

const fails = results.filter(r => r.level === 'FAIL'), warns = results.filter(r => r.level === 'WARN');
for (const r of results) console.log(`${r.level.padEnd(4)}  ${r.page.padEnd(28)} ${r.rule}${r.detail ? '  (' + r.detail + ')' : ''}`);
console.log(`\nChecked ${routes.length} page(s): ${fails.length} FAIL, ${warns.length} WARN`);
if (jsonOut) (await import('node:fs')).writeFileSync(jsonOut, JSON.stringify({ base, routes, fails: fails.length, warns: warns.length, results }, null, 2));
process.exit(fails.length ? 1 : 0);
