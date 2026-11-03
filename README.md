# Danish Development

A web development agent for Claude Code and Claude Cowork.
Give it a GitHub repo → it reads what you want → builds the website in **Next.js + Tailwind** → gives you a **demo link**.

You attach the domain and hosting later.

## How it works

```
GitHub repo (brief, content, images)
        │
        ▼
 1. Load Danish's teachings (your rules)
 2. Read the repo → write SITE_BRIEF.md (pages, layout, branding)
 3. Build Next.js + Tailwind site
 4. Production build + desktop/mobile screenshots → fix issues
 5. Push to a branch / open PR
 6. Deploy preview → demo link
```

## Install

### Claude Code

```bash
/plugin marketplace add mdanishfaq/danish-development
/plugin install danish-development@danish-development
```

That one install includes everything below — no separate plugins to install.

### Built-in plugins

| Skill | What the agent uses it for | Original source |
|---|---|---|
| taste-skill | Art direction, no generic "AI-made" look, design inspector | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (MIT) |
| web-design-guidelines | UI/UX/accessibility review before delivery | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (MIT) |
| playwright-cli | Browser testing and screenshots | [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli) (Apache-2.0) |
| design-references | Brand-style DESIGN.md references | [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (MIT) |

Bundled third-party skills keep their original LICENSE file in their folder.

### Claude Cowork

Settings → Plugins → upload the `danish-development.zip` from Releases (or this repo zipped),
or add the GitHub repo as a plugin marketplace if your workspace allows it.

## Use it

```
/build-site https://github.com/<user>/<client-site-repo>
```

or just say: *"Danish Development, build the website from https://github.com/…"*

### Preparing a client repo

1. Create a repo for the client.
2. Copy [`templates/SITE_BRIEF.md`](templates/SITE_BRIEF.md) into it and fill what you know.
3. Add `assets/logo.png`, `assets/images/…`, and any text in `content/`.
4. Hand the repo URL to the agent.

## Teach it

```
/teach always use Poppins for headings and Inter for body text
/teach add a WhatsApp floating button on every site
/teach use shadcn/ui components
/teach never use stock photos of people shaking hands
```

Rules are saved in [`skills/danish-teachings/SKILL.md`](skills/danish-teachings/SKILL.md),
committed to this repo, and applied to every future website. You can also edit that file directly.

## Demo links

The agent deploys to Vercel preview. One-time setup: create a token at
<https://vercel.com/account/tokens> and set it as `VERCEL_TOKEN` in your environment
(or connect the client repo at vercel.com/new and previews are automatic).

## Repo layout

```
.claude-plugin/        plugin + marketplace manifests
agents/                the Danish Development agent
skills/
  danish-teachings/    your rules (grows as you teach)
  site-brief/          reads the repo, writes SITE_BRIEF.md
  build-nextjs-site/   builds the site
  deploy-demo/         demo link
  design-references/   awesome-design-md brand references
  taste-skill/         art direction (bundled, MIT)
  web-design-guidelines/ UI review (bundled, MIT)
  playwright-cli/      browser testing (bundled, Apache-2.0)
commands/              /build-site, /teach
templates/SITE_BRIEF.md
.mcp.json              Playwright MCP for screenshots/testing
```
