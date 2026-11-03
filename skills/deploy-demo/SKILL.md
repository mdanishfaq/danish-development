---
name: deploy-demo
description: Deploy a built website as a preview and return a demo link for Danish/his client. No custom domain or paid hosting setup. Use after the site builds successfully.
---

# Deploy a demo link

Danish attaches the domain and real hosting later. Your job is only a working preview URL.

## Option A — Vercel (default)

Needs `VERCEL_TOKEN` in the environment (Danish creates it at vercel.com/account/tokens).

```bash
npx vercel deploy --yes --token "$VERCEL_TOKEN"
```

This creates a preview deployment and prints a `https://<project>-<hash>.vercel.app` URL.
Use `--prod` only if Danish asks for a stable `<project>.vercel.app` link.

## Option B — Vercel via GitHub

If the repo is connected to Vercel's GitHub app, pushing the branch automatically creates a
preview. Read the link from the PR checks: `gh pr checks` or the PR page.

## Option C — no token available

Tell Danish: "Site is pushed to `<branch>`. To get a demo link, import the repo at
vercel.com/new (free) or give me a VERCEL_TOKEN." Do not block on this — the build is done.

## After deploying

Open the URL, confirm the home page loads and every nav link works. Then report the link.
