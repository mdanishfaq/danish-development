---
name: deploy-demo
description: Deploy a built website as a preview and return a demo link for Danish/his client. Default is Cloudflare Workers (free, commercial use allowed) connected to GitHub, so every pushed branch gets its own preview URL. No custom domain or paid hosting setup. Use after the site builds successfully.
---

# Deploy a demo link

Danish attaches the domain and real hosting later. Your job is only a working preview URL.

## Default: Cloudflare Workers + GitHub (Danish's setup since 2026-11-19)

Danish's Cloudflare account (Danish.ishfaq@...) has the **Cloudflare GitHub app installed on all his repos**.
Cloudflare runs Next.js on **Workers** through the OpenNext adapter (Pages "Next.js preset" is the old way).

### 1. Prepare the repo (you do this, in code)

```bash
npm i -D @opennextjs/cloudflare wrangler
```

`wrangler.jsonc` in the project root:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "<site-slug>",                 // becomes <site-slug>.<account>.workers.dev
  "main": ".open-next/worker.js",
  "compatibility_date": "2026-11-01",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": { "directory": ".open-next/assets", "binding": "ASSETS" }
}
```

`open-next.config.ts`:

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
export default defineCloudflareConfig();
```

`package.json` scripts:

```json
"preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
"deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
"upload": "opennextjs-cloudflare build && opennextjs-cloudflare upload"
```

Add `.open-next/` and `.wrangler/` to `.gitignore`. Run `npm run build` (and `npm run preview` if wrangler
can run locally) before pushing.

### 2. First time for this site: Danish imports the repo (about 1 minute)

Send Danish exactly this:
> Repo **<name>** is ready. Cloudflare → Workers & Pages → Create → Import a repository → pick **<name>**.
> Build command: *(leave empty)* · Deploy command: `npm run deploy` ·
> Non-production branch deploy command: `npm run upload` · turn on **Builds for non-production branches** → Save and Deploy.

### 3. Every change after that: push a branch

Pushing branch `danish-dev/build-<date>` creates a **preview URL** for that branch automatically, while `main` stays live.
Read the URL from the GitHub commit status / PR checks ("Workers Builds"), or ask Danish to copy it from
Cloudflare → the Worker → Deployments. Open it, confirm every page loads, then report it.

### Common failures

- `Missing entry-point` / wrangler deploy fails: the repo has no `wrangler.jsonc` (step 1), or the repo isn't a website at all.
- Node API errors at runtime: check `nodejs_compat` is in `compatibility_flags`.
- Never import a non-website repo (like the danish-development agent repo itself): its build fails because there is nothing to deploy.

## Option B: direct deploy from the workspace (needs a token)

Only if Danish has allowed `api.cloudflare.com` in claude.ai Settings → Capabilities and given `CLOUDFLARE_API_TOKEN`
(Account → Workers Scripts → Edit) + `CLOUDFLARE_ACCOUNT_ID`: `npm run deploy` (production) or `npm run upload` (preview version).

## Option C: Vercel

Vercel's Hobby plan forbids commercial or client work; Pro costs $20 per user per month. Use it only if Danish asks:
`npx vercel deploy --yes --token "$VERCEL_TOKEN"`.

## After deploying

Open the URL, confirm the home page loads and every nav link works, run `site-review` on the live URL, then report the link.
