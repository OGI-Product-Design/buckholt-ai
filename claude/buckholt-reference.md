# Buckholt Design System: Chat Reference

**Source:** github.com/OGI-Product-Design/buckholt-ai (public), checked at commit `211e365` on 19 Oct 2026 (PR #95).
**Status:** a summary of the parts that change slowly. The repo changes almost every day. Where this doc and the repo disagree, the repo is right.
**Read-only:** chats in this project never write to the repo. Changes go through Claude Code.

---

## 1. Who does what

Chats in this project (design discussion, discovery, spec writing) decide **what** gets built and **why**. Claude Code decides **how**, working from the live repo.

| Chats decide | Claude Code decides, from the live repo |
|---|---|
| Flows, screens, states, data, business rules, copy | Markup, classes, CSS, scripts |
| Which Buckholt component or pattern to use, **by name** (e.g. "Modal", "Response button", "Page body > Frame > Pane > Panel") | The exact DOM and variant markup for that component |
| Where Buckholt has no answer (a gap), stated outright | How to handle the gap without inventing Buckholt |
| Acceptance criteria | Running `test/` and recording deviations in `PROTOTYPE.md` |

**Rule for specs:** never prescribe HTML, class names, hex values, pixel spacing or icon class strings. There are three reasons:

1. `AGENTS.md` excludes "previous interpreted AI specifications" from the implementation path. Claude Code is told not to trust them.
2. This doc goes out of date. The live repo does not.
3. Exact component markup is checked against Buckholt's saved Code & specs pages by `test/source-parity.py`. A spec that dictates markup can only make the build worse.

Exception: a measured value from Figma that Buckholt does not cover (e.g. "row count sits about 24px below the table") is allowed. Label it as a Figma measurement.

---

## 2. Repo map

| Area | What it is | How to treat it |
|---|---|---|
| `AGENTS.md` | The one rules file for Claude Code, Cursor and Codex. There is deliberately no `CLAUDE.md`. | Claude Code reads it first |
| `css/`, `components/` (41), `foundations/`, `patterns/`, `code-specs-html/`, `discrepancies/`, `verification/`, `responsive/` | **Buckholt.** The source of truth | Read-only evidence |
| `prototypes/` | Mobius PAS application work built **with** Buckholt | Examples of use only. **Never** evidence of what Buckholt is |
| `test/`, `tools/` | CLI checks (source parity, about 300 prototype assertions), style guide, runtime harness | Quality gates |

**Live reference pages:**
- Style guide (every documented component rendered): https://ogi-product-design.github.io/buckholt-ai/tools/style-guide/
- Runtime verification harness: https://ogi-product-design.github.io/buckholt-ai/tools/runtime-verification/

---

## 3. Source hierarchy (what wins when sources disagree)

1. Buckholt documentation site and its **Code & specs** pages (saved in `code-specs-html/`)
2. The live build `compiled.css?v=2.3`. This is the **reference build** (confirmed by Mark, 9 Sep 2026). The repo's `css/buckholt.css` is a newer, *different* build and does not override the docs.
3. `css/buckholt-ai-fixes.css`: verified corrections only
4. Foundations > Patterns > Component `rules.md` / `examples.html`
5. `discrepancies/` and `verification/`

**Not implementation sources:** old SCSS, token maps, screenshots, **Figma**, and earlier AI-written specs. Figma informs layout and intent in a spec. It never overrides Buckholt component behaviour.

---

## 4. Rules that affect design decisions

**Core rule:** build with Buckholt, do not imitate it. If Buckholt does not establish a variant, state or behaviour, the correct output is a **reported gap**, not an approximation.

### Page structure (`patterns/page-layout/`)
- Eight CSS-Grid base layouts. Regions: Header, Sidebar/Aside, Footer (all optional) and Main (required). Don't add optional regions just because the template allows them.
- Inside Main: **Page body > Frame > Pane > Panel > components**.
  - Panel: directly related items, 32px gap.
  - Pane: related Panels, 64px gap.
  - Frame: one or more Panes, 64px vertical / 48px horizontal padding (content still lands 64px in via the container), plus an optional frame header.
- The Bootstrap grid handles width and columns only. Frame, Pane and Panel handle hierarchy and vertical rhythm.
- Reference breakpoints come from the live scale **896 / 1088 / 1312 / 1520 / 1720**. The local build uses stock Bootstrap values, which are not canonical.

### Forms (`patterns/forms/`)
- Top-aligned labels only. Fields stacked by default.
- Mostly-required forms label only the optional fields. Mostly-optional forms label only the required fields.
- Dedicated-page forms: Primary action first, left-aligned. No submit actions at the top.
- Modal, side-panel and wizard forms: actions right-aligned, Primary after Secondary/Ghost.
- Modal forms suit **fewer than 5 inputs**. Side-panel forms suit **more than 5**. No Accordion forms inside Modals.

### Other patterns
- **Input rows:** side by side only when the fields are genuinely related. Each field validates on its own.
- **Lookup:** for retrieving a known value (input > result > summary), not for exploratory search.
- **Common actions:** fixed label and icon mapping for Add, Copy, Delete, Download, Edit, External link, Logout, Save, Search, Settings, Upload. Delete uses the danger treatment. The mapping does not decide button hierarchy.

### Distinctions that are easy to get wrong
- **Page navigation** links to sibling pages. **Tabs** switch content in place.
- **Response button:** radios for single-select, checkboxes for multi-select.
- **Select** is a native select. Read-only means `.readonly` plus `disabled`.
- **Switch:** default, small and *always-active*. Always-active means enforced on, not disabled.
- **Slider:** single value plus a number input. The two-handle range is "coming soon": don't spec it as if it exists.

### Accessibility
- Native controls first. Every icon-only control needs an accessible name **and** the documented Tooltip.
- Colour must never carry meaning alone. Labels must match their controls.

### Runtime facts (useful when reading prototypes)
- Proxima Soft (Typekit), Font Awesome v7 kit.
- `buckholt.css` is a complete Bootstrap 5.3 build. Bootstrap JS 5.1.3 is required for 10 components.
- Prototypes are no-build HTML/CSS/JS.

---

## 5. Component inventory (41)

Accordion, Alert, Avatar, Breadcrumb, Button, Card, Checkbox, Collapse, Dropdown, Form, Heading attachment, Icon block, Input group, Input row, Key-value pair, Link, List, Lookup, Menu, Menu button, Modal, Multi-field input, Nested inputs, Number input, Page navigation, Progress bar, Radio, Response button, Select, Slider, Summary meta, Switch, Table, Tabs, Tag, Text area, Text block, Text input, Toast, Tooltip, Versa-tile.

### Known limits (from `discrepancies/known-issues.md`)

| Component | Limit | What it means for a spec |
|---|---|---|
| **Table** | **Provisional / source-partial.** No documented pagination, filters, density, column pinning or selected-row state. Its `data-cdt-*` controller is not supplied. Sortable headers exist in the work-in-progress source. | Describe table behaviour in full in the spec and mark anything beyond basic rows and sorting as an **application-level addition / gap** |
| Tag | Selection and dismiss behaviour not supplied | Filter chips and removable chips are gaps |
| Card | Selectable state and hit target not supplied | Clickable-card behaviour is a gap |
| Dropdown | Single-select label behaviour not supplied | State the label behaviour in the spec |
| Slider | Range and number sync not supplied | Avoid, or state the behaviour in full |
| Link | Visited state not implemented | n/a |

---

## 6. What Buckholt does not cover (relevant to Open GI work)

| Need | Buckholt status | Precedent |
|---|---|---|
| Drawer / side panel (CH User drawer, Audit details drawer) | **No component.** Side-panel *forms* are a documented context, but there is no drawer component | `prototypes/shared/blade.*` (Mobius "Blade", not Buckholt) |
| Pagination | None | n/a |
| Filter bar / filter chips | None (Tag selection not supplied) | n/a |
| Empty and no-results states | No pattern | Originators spec defines its own |
| Stepper / wizard navigation | No component (Number input "stepper" is unrelated) | n/a |
| Segmented toggle (e.g. Audit Centre Grouped / Individual) | None. Response button is the closest documented option | n/a |
| Calendar / date grid | None | `prototypes/shared/calendar/` |
| Application chrome (top bar, left nav, tenant selector) | None | `prototypes/shared/app-shell.*` (Mobius PAS chrome only) |
| Loading / skeleton states | No pattern | n/a |

Every gap a spec relies on should appear in the spec's **Buckholt gaps** section, so that Claude Code builds it under `prototypes/` (not `components/`) and it feeds `SPEC-CHANGES.md` section C (tickets for Buckholt).

---

## 7. Existing prototypes and the spec house format

| Prototype | Feature | Live |
|---|---|---|
| Originators | Accounts > BACS > Originators | https://ogi-product-design.github.io/buckholt-ai/prototypes/Originators/ |
| BACS-import | Accounts > BACS > Import | https://ogi-product-design.github.io/buckholt-ai/prototypes/BACS-import/ |
| BACS-calendar | Accounts > BACS > Calendar | https://ogi-product-design.github.io/buckholt-ai/prototypes/BACS-calendar/ |
| Mobius-navigation | Mobius navigation shell | Cloudflare Worker `mobius-nav` |

Each prototype folder holds three documents:
- `<feature>-spec.md`, **the input** (written by design). This is what chats in this project produce. Template: `prototype-spec-template.md`.
- `PROTOTYPE.md`, written by Claude Code: what was built, the Buckholt components used, and every deviation or judgement call.
- `SPEC-CHANGES.md`, written by Claude Code: findings sent back to (A) the spec, (B) Figma frames and (C) Buckholt tickets.

The cycle: spec > build > `PROTOTYPE.md` and `SPEC-CHANGES.md` > revise spec and Figma > rebuild. Bring `SPEC-CHANGES.md` back into the chat to revise the spec.

---

## 8. Configuration Hub specifics

- **None of the CH work exists in the repo yet.** Every prototype so far is Mobius PAS. The first CH prototype needs a **CH shell spec**: header with OGI logo and "Configuration Hub", tenant selector or Live/Test toggle, Mobius link, avatar menu, breadcrumb, app-card home. Write that once as a shared spec (planned prototype ID `CH-SHELL`) and refer to it from every CH feature spec. Don't redescribe it in each one.
- CH production is Angular micro-frontends. The prototypes are no-build HTML. A prototype proves **behaviour, flow and Buckholt fit**. It is not production code for Kinetic Flow.
- CH relies on parts that go beyond Buckholt: the shared CH table (sort, filter bar, pagination, avatars, truncation tooltips), drawers and status pills. Specs must describe their behaviour in full and list them as gaps (section 6).
- The `Brand - Language and Tone of Voice.pdf` in Project files governs copy.

---

## 9. Keeping this doc current

- Re-check before writing a spec for a new feature, or when a spec depends on a component listed in section 5 as having limits.
- To refresh: ask a Cowork session in this project to "diff buckholt-ai since `<commit>` and update `buckholt-reference.md`". Only stable rules belong here. Detail stays in the repo.
