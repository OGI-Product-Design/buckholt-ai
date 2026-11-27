# Build brief: OGI UX Agents website

Owner: Laurence Abbott (backup: Jon)
For: Claude Code, working in the Buckholt prototyping repo
Status: ready to build

---

## 1. What we are building

A full internal website that explains and runs alongside the OGI UX team's agentic design workflow: the 12 agents, the stages and gates, the toolset, the repo rules, the templates, the Azure DevOps set-up, how we fit with product management, and step-by-step set-up guides.

It is built **in our repo, with Buckholt**, and published at a shareable URL. The site is itself an example of the workflow: Buckholt core is used as-is, anything new is a flagged extension, and the site must pass our own Audit checks.

**Audience:** the UX team first, then product managers, engineers, Jim and anyone onboarding to the workflow.

**Success looks like:** someone new can open the URL, understand the whole workflow in five minutes from the home page, find any agent's rules in two clicks, and set up a tool by following a guide without asking anyone.

---

## 2. Non-negotiable rules (read before writing any code)

1. **Never edit `/buckholt`.** Read it, link to it, use its CSS, tokens and HTML patterns. Do not modify a single file in it.
2. **Never edit `/legacy`.**
3. **Use Buckholt first.** Before creating any component, check Buckholt core, its HTML/CSS reference and its documentation for an existing one.
4. **Anything Buckholt does not have** goes in `/extensions/ux-site/`:
   - its own `extensions.css`, separate from Buckholt's CSS
   - Buckholt tokens only (CSS custom properties); no hard-coded colours, spacing, radii or fonts
   - class prefix `.x-` and attribute `data-buckholt="false"`
   - one entry per component in `/context/extensions-register.md` using the register template
5. **No customer data** anywhere in the site.
6. **Follow `/.cursor/rules` and `/agents`** if they exist in the repo. Where they conflict with this brief, stop and ask.
7. **Ask before adding any framework or dependency** beyond those listed in section 4.

---

## 3. Before you start

1. Explore the repo and report back:
   - where Buckholt core lives, how its CSS and tokens are loaded, and whether there is an HTML/CSS reference or Storybook
   - what build tooling the repo already uses, if any (npm scripts, Eleventy, Vite, Astro and so on)
   - how existing prototypes are structured and deployed (we have used Cloudflare for prototypes)
   - whether `/context`, `/agents` and `/.cursor/rules` exist yet
2. Propose a short plan: folder location, build approach, page list, and which Buckholt components you will use for each page element.
3. **Wait for Laurence to approve the plan** before building.

---

## 4. Technical approach

- **Location:** `/site` at the repo root, unless the repo has a clear convention for internal sites. Output to `/site/dist`.
- **Stack:** static HTML built from content files, styled only with Buckholt CSS plus `/extensions/ux-site/extensions.css`.
  - If the repo already uses a static site tool, use that.
  - If not, use a small Node build script (Markdown to HTML with `marked` or `markdown-it`, plus simple HTML layout templates). No front-end framework.
- **JavaScript:** small, progressive enhancement only: mobile navigation, copy-to-clipboard on code blocks, client-side search, "on this page" highlighting. The site must be fully readable with JavaScript off.
- **Content is data, not hard-coded pages:**
  - `/site/content/*.md` holds the written content (exported from the source doc; see section 7)
  - `/site/data/agents.json` holds the 12 agents (provided with this brief)
  - each agent page also reads the live rules file from `/agents/[id].md` if present, so the site always shows the current rules
- **Agent tags in content:** write agent mentions as `{{agent:map}}` in Markdown. The build turns them into the agent tag component. Do not auto-replace plain words: "Map", "Build" and "Range" are also ordinary words.

---

## 5. Information architecture

Top-level navigation, in this order:

1. **Home**
2. **Workflow**: stages, gates, stage statuses, fast track, test loop, cadence under scaled agile
3. **Agents**: index of all 12, plus one page per agent
4. **Toolset**: Microsoft 365 side, Cursor side, the bridge, access needed
5. **Repo and Buckholt**: repo zones, locks, extensions, sandbox, styling modes (legacy, hybrid, Buckholt), rules files
6. **Artifacts and templates**: the seven artifacts, who writes and reads each, every template with a copy button
7. **Azure DevOps**: design board, design item, fields, columns, swimlanes, links to product and engineering, Delivery Plans
8. **Working with product**: the contract, what we consume, what we publish, rules for working alongside other agents
9. **Set-up guides**: the nine guides, each its own page, in order, with progress shown (guide 3 of 9)
10. **How-to guides**: run a feature end to end, fast-track a change, add a non-Buckholt component, onboard a legacy product, update a product pack
11. **Governance and rollout**: ownership, reviews, measures, rollout phases, open questions

Also: a 404 page, and a "Last updated" date in the footer taken from the build date.

---

## 6. Page designs

### Home
- One-sentence statement: designers decide at two gates; agents do the work in between.
- The workflow diagram (section 8), full width.
- Three principles: designers lead; agents extend and check; Buckholt never changes.
- The 12 agents as a compact grid of tags, grouped by stage, each linking to its page.
- "Start here" links: Workflow, Set-up guides, Agent rules.

### Agents index
- Agents grouped by stage (Foundation, Discover, Explore, Design, Prototype, Handoff).
- Each card: agent tag, one-line job, tool, link.

### Agent page (one template, 12 pages)
- Header: agent tag (large), stage, tool, one-line job.
- At-a-glance strip: Triggered by · Reads · Produces · Human gate.
- Steps (numbered).
- Never (clearly styled as a constraint list).
- Done when.
- Owner and backup.
- Full rules file in a code block with a copy button and a "View in repo" link.
- Where it sits: the workflow diagram with this agent highlighted.
- Previous and next agent in workflow order.

### Set-up guide page (one template, 9 pages)
- Title, why it matters (one sentence), numbered steps, code blocks with copy buttons.
- "Docs" and "Watch" link groups at the end, clearly marked as external links.
- Previous and next guide; progress indicator.

### All other pages
- Lead sentence that states the point.
- Diagram where the section has one (section 8).
- "On this page" contents on long pages (desktop only).

---

## 7. Content

The full content is in the source doc, "UX agentic design workflow", which has three tabs: **Workflow**, **Agent rules** and **Set-up guides**.

1. Laurence exports each tab as Markdown (doc menu, Export, Markdown) into `/site/content/source/`.
2. Split the content into page files under `/site/content/`, one per page in section 5.
3. Replace agent names with `{{agent:id}}` tokens where they refer to agents.
4. Replace the embedded-diagram placeholders with the SVG diagrams in section 8.
5. **Check every agent tag after export.** The export can garble the agent tags. `/site/data/agents.json` is the source of truth for agent names and stages.

Writing rules: British English, sentence case headings, no dash characters in titles, short sentences, no marketing language.

---

## 8. Diagrams

Reference images of all seven are in `/site/content/diagrams/` (01 to 07, numbered as below). Use them for layout and content only. Do not publish the PNGs, and do not copy their colours: rebuild each one as inline SVG using Buckholt tokens for every colour and Buckholt's font. Every diagram needs a `<title>`, a `<desc>`, real text labels and a layout that still works on mobile, either by reflowing or by stacking into a list.

1. **Workflow** (home and Workflow page): foundations (SharePoint, Azure DevOps, Archive) → Discover (Brief, Insight, Map) → Explore (Range, Critic) → Gate: shortlist → Designers: anchor screens → Design (Extend, Align) → Gate: design sign-off → Prototype and handoff (Build, Audit, Observe, Relay) → Engineering stories. Show the fast track (Discover straight to Design) and the test loop (Prototype back to Design).
2. **Toolset bridge**: Microsoft 365 (Copilot, SharePoint, Teams, Azure DevOps, Lucid) and Cursor (Cursor, Figma MCP, LogRocket MCP, repo, Playwright and axe, Lucid MCP), joined by the bridge that Archive keeps in sync.
3. **Dependencies**: foundations (repo and locks, product packs, design board, SharePoint site) → connectors and access → agents by stage.
4. **Repo zones**: Locked (`/buckholt`, `/legacy`), Agents create here (`/extensions`, `/sandbox`, `/prototypes`), Context and control (`/context`, `/agents`, `/.cursor/rules`, `/tests`).
5. **Artifact flow**: written by → artifact and where it lives → read by, for all seven artifacts.
6. **Azure DevOps links**: Portfolio epic → Feature → Design item → Engineering stories, with the design status rolling up and hyperlinks to the SharePoint brief, Figma and the prototype.
7. **Product contract**: what product owns, what UX owns, and the two things that cross between them (Ready for design; UX outputs on stories).

On each agent page, reuse diagram 1 with that agent highlighted.

---

## 9. Visual direction

- **Precise and restrained**, in the spirit of premium automotive brands: a strong grid, generous whitespace, few colours, clear hierarchy, nothing decorative.
- Buckholt type scale and spacing only. One accent at a time.
- **Agent tags:** each agent always appears as its tag. Colour by stage, using Buckholt colour tokens:
  - Foundation: Archive
  - Discover: Brief, Insight, Map
  - Explore: Range, Critic
  - Design: Extend, Align
  - Prototype: Build, Audit, Observe
  - Handoff: Relay

  If Buckholt has no tag or badge component, build one in Extensions and flag it.
- **Gates** are visually distinct from stages everywhere (for example a Buckholt warning or status token).
- **Avoid:** gradients, glows, heavy shadows, emoji, stock illustrations, sparkle or "AI" iconography, robot imagery, title case, and dashes in titles.
- Light theme required. Add a dark theme only if Buckholt supports one.

---

## 10. Accessibility and quality

- WCAG 2.2 AA throughout.
- Skip link, landmarks, one H1 per page, logical heading order, visible focus, keyboard navigation for every control, `prefers-reduced-motion` respected, contrast checked.
- Add `/tests/site.spec.ts` using Playwright and `@axe-core/playwright`: open every page, run an axe scan, and check keyboard access to navigation, search and copy buttons.
- Add a check that fails the build if any file in `/buckholt` or `/legacy` has changed.
- Add a check that fails the build if `/extensions/ux-site/extensions.css` contains hard-coded colour values.
- Lighthouse: aim for 95+ on accessibility and best practices.

---

## 11. Hosting and URL

The site is internal, so access must be restricted.

- **Preferred: Cloudflare Pages**, since we already use Cloudflare for prototypes.
  - Project name: `ogi-ux-agents`, which gives `https://ogi-ux-agents.pages.dev` by default.
  - Build command: `npm run build:site`. Output directory: `site/dist`.
  - Connect to the GitHub repo so every merge to main deploys, and every pull request gets a preview URL.
  - **Protect it with Cloudflare Access** so only OGI accounts can open it.
  - Later: a custom domain such as `ux-agents.[ogi domain]` (ask IT).
- **Alternative: GitHub Pages**, only if the GitHub plan supports access-restricted Pages for private repositories. Confirm before using it.
- Add `npm run build:site`, `npm run dev:site` (local server with live reload) and `npm run test:site` to `package.json`.

---

## 12. Order of work and checkpoints

Stop at each checkpoint and show Laurence the result before continuing.

1. Explore the repo and propose a plan (section 3). **Checkpoint.**
2. Build the layout: header, navigation, footer, page template, agent tag component, code block with copy. Build the Home page with the workflow diagram. **Checkpoint.**
3. Build the agents index and all 12 agent pages from `agents.json` and `/agents/*.md`. **Checkpoint.**
4. Build the remaining pages from the content files.
5. Build the remaining six diagrams. **Checkpoint.**
6. Add search, the accessibility tests and the build checks; fix every issue.
7. Set up deployment and access protection, and share the URL. **Checkpoint.**

---

## 13. Definition of done

- [ ] Every page in section 5 exists and is linked from the navigation
- [ ] All 12 agent pages are generated from data, and show the live rules file
- [ ] Every agent mention is shown as its tag
- [ ] All 7 diagrams are inline SVG, accessible, and work on mobile
- [ ] Buckholt core and legacy folders are untouched (the build check passes)
- [ ] Every extension is flagged and registered
- [ ] Playwright and axe tests pass with no serious or critical issues
- [ ] The site is deployed behind access control, with a working URL
- [ ] A README in `/site` explains how to update content, add an agent and deploy

---

## Prompt to paste into Claude Code

> Read `site/CLAUDE-CODE-BRIEF.md` and `site/data/agents.json` in full, and look at every reference image in `site/content/diagrams/`. Then do step 1 of section 12 only: explore the repo, report what you find about Buckholt, tooling and deployment, and propose a build plan. Do not write any site code until I approve the plan. Never modify anything in /buckholt or /legacy.
