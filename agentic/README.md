# Agentic UX site

A documentation website for the **proposed** OGI UX agentic design workflow:
the 12 agents, the stages and gates, the toolset, the repo rules, artifacts,
Azure DevOps, working with product, guides and governance.

It is standalone. Everything for it lives in this `agentic/` folder, and it
changes nothing else in the repository. It is built with Buckholt: the real
`css/buckholt.css` and `css/buckholt-ai-fixes.css` from the repository root are
copied into the build unchanged, and pages use Buckholt's documented markup.
Anything Buckholt does not have is an extension in `css/extensions.css`,
listed in [`extensions-register.md`](extensions-register.md).

The brief is [`CLAUDE-CODE-BRIEF.md`](CLAUDE-CODE-BRIEF.md).

## Open it

Open [`index.html`](index.html) in this folder, straight from a checkout. It
goes to the built site in `site/`, which is committed so it opens without
building anything. Every link names its `index.html` file, so the site works
from disk as well as from any web server. Rebuild (below) after changing
content, and commit `site/` with your change.

## Run it

Needs Node 18 or later. Building needs no packages; the tests need the two
dev dependencies (`npm install` once).

```sh
cd agentic
npm run build:site     # writes agentic/site
npm run dev:site       # local preview with live reload, http://localhost:8080
npm run check:site     # extension CSS uses tokens only; nothing outside agentic/ changed
npm run test:site      # every page: axe, one H1, no sideways scroll; keyboard checks
```

The build scripts are in `scripts/`, not `build/`: the repository's
`.gitignore` ignores every folder called `build/`.

The tests use Playwright 1.63.0. If your browser is elsewhere, set
`CHROMIUM=/path/to/chrome`. They block the external font and icon kits, so the
results do not depend on the network.

The Adobe Fonts kit (Proxima Soft) and the Font Awesome kit load from their own
servers and only work on domains those kits allow. Elsewhere the site falls
back to Arial and shows no icons; every icon has a text label beside it.

## Folders

| Path | What it holds |
|---|---|
| `data/agents.json` | The source of truth for agent names, stages, gates and statuses. |
| `content/pages/` | One Markdown file per section page. |
| `content/guides/setup-guides/`, `content/guides/how-to-guides/` | One Markdown file per guide, numbered in order. |
| `content/source/` | For the Markdown exports of the source doc's three tabs. |
| `content/diagrams/` | Reference images for the seven diagrams. Layout and content only: never published. |
| `assets/` | The Agentic UX logo artwork (not used on the site: the header shows the name as text). |
| `scripts/` | The build, the Markdown renderer, page templates, components, diagrams, checks and the dev server. |
| `site/` | The built site. Generated: do not edit by hand. |
| `index.html` | Opens `site/index.html`. |
| `css/extensions.css` | Styles for the extensions. Buckholt tokens only. |
| `js/site.js` | Progressive enhancement: mobile menu, copy buttons, "On this page" highlighting and search. |
| `tests/site.spec.ts` | Playwright and axe tests. |
| `extensions-register.md` | One entry per extension, and findings for the Buckholt owners. |

## Change content

- **Page text:** edit the Markdown in `content/pages/`. Each file starts with
  `title`, `slug` and `lead`. Use `##` for sections; pages with three or more
  get "On this page" contents.
- **Agent mentions:** write `{{agent:map}}`, not the plain word. "Map", "Build"
  and "Range" are ordinary words too.
- **Diagrams:** put `{{diagram:workflow}}` on a line of its own. The others are
  `toolset`, `dependencies`, `repo-zones`, `artifact-flow`, `azure-devops` and
  `product-contract`.
- **Notes:** a line starting `> To come:` becomes an info note.
- **Code to copy:** a fenced block with a label, for example
  ```` ```html "An extension, flagged" ````.

## Add an agent

1. Add it to `data/agents.json` with its `stage`, `order` and the same fields as
   the others.
2. If it should appear in the workflow diagram, add it to the right group in
   `scripts/diagrams/workflow.mjs`.
3. Add its rules file at the path in `rulesFile` (for example
   `/agents/[id].md`). Until that file exists, the agent page shows rules
   generated from `agents.json`.

## Add a guide

Add a numbered Markdown file, for example
`content/guides/setup-guides/03-figma-mcp.md`, with `title` and `lead` at the
top. The site lists it, numbers it, shows set-up progress ("Guide 3 of 9") and
links it to the guides either side.

## Where the content comes from

- Agents, stages, gates and statuses: `data/agents.json`.
- The workflow, the agents' rules and the diagrams: the brief and the reference diagrams in `content/diagrams/`.
- Templates: built from what each agent's rules say it must produce.
- Set-up guides, cadence, swimlanes, Delivery Plans, rollout phases, workflow measures and the legacy onboarding steps: written as proposals for review. They describe what will be set up and why, not exact technical steps, because the site explains a proposed workflow.

When the source doc ("UX agentic design workflow") is exported to `content/source/`, compare it with these pages and update them.

## Deploying

The plan (brief, section 11) is a Cloudflare Pages project:

| Setting | Value |
|---|---|
| Project name | `ogi-ux-agents` |
| Root directory | `agentic` |
| Build command | `npm run build:site` |
| Output directory | `site` |

Connect it to the GitHub repo so each merge to `main` deploys and each pull
request gets a preview. Protect it with Cloudflare Access so only OGI accounts
can open it. This has to be set up in the Cloudflare dashboard by someone with
access.

This repository is public, and GitHub Pages publishes it as it is. The source
in this folder can be read on GitHub whatever protects the built site.
