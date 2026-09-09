# Buckholt AI

A lean, machine-readable companion for using the Buckholt design system accurately in coding agents such as Claude Code, Cursor and Codex.

## Goal

**Build with Buckholt; do not imitate Buckholt.**

This repository is deliberately evidence-led. It teaches coding agents only patterns that can be traced to Buckholt's documentation or the real compiled runtime stylesheet.

## Source hierarchy

1. **Buckholt documentation website** — primary source of truth for intended Digital Product design-system behaviour: usage, hierarchy, accessibility, canonical markup, scales and design-system meaning. The supplied Code & specs pages are committed in **`code-specs-html/`**; `test/source-parity/check-source-parity.py` checks the canonical examples against them.
2. `css/buckholt.css` — current runtime implementation. Use it for real selectors, variables, states and browser behaviour, while recognising that it may contain extra helpers or values added when Buckholt was also used to build the company website. **It is not the same build as the live documentation site's `compiled.css?v=2.3`; see `discrepancies/build-provenance.md`.**
3. `css/buckholt-ai-fixes.css` — verified compatibility corrections only, loaded after the runtime when documented behaviour is known to render incorrectly.
4. `foundations/<foundation>/` — concise shared design-system guidance extracted from documentation and checked against runtime CSS where useful.
5. `patterns/<pattern>/` — composition guidance that teaches agents how Buckholt components are assembled into pages, forms and recurring product interactions.
6. `components/<component>/rules.md` — component guidance rebuilt from Buckholt documentation plus runtime implementation evidence.
7. `components/<component>/examples.html` — verified canonical markup examples.
8. `discrepancies/known-issues.md` — significant verified documentation/runtime differences that could mislead an implementation agent.
9. `discrepancies/build-provenance.md` — how `css/buckholt.css` differs from the live `compiled.css?v=2.3`, including the grid-breakpoint difference.

Extra runtime CSS is useful flexibility, but it does not become canonical Buckholt guidance unless the documentation says so.

Old SCSS, old token maps, screenshots, Figma and earlier interpreted AI specifications are intentionally excluded from the implementation path unless explicitly requested for investigation.

## Structure

```text
buckholt-ai/
├── README.md
├── CLAUDE.md
├── css/
│   ├── buckholt.css
│   └── buckholt-ai-fixes.css
├── foundations/
│   ├── colour/
│   ├── iconography/
│   ├── radius/
│   ├── shadows/
│   ├── spacing/
│   └── typography/
├── patterns/
│   ├── common-actions/
│   ├── forms/
│   ├── input-rows/
│   ├── lookup/
│   └── page-layout/
├── discrepancies/
│   ├── build-provenance.md
│   └── known-issues.md
└── components/
    ├── accordion/
    ├── alert/
    ├── avatar/
    ├── breadcrumb/
    ├── button/
    ├── card/
    ├── checkbox/
    ├── collapse/
    ├── dropdown/
    ├── form/
    ├── heading-attachment/
    ├── icon-block/
    ├── input-group/
    ├── input-row/
    ├── key-value-pair/
    ├── link/
    ├── list/
    ├── lookup/
    ├── menu/
    ├── menu-button/
    ├── modal/
    ├── multi-field-input/
    ├── nested-inputs/
    ├── number-input/
    ├── page-navigation/
    ├── progress-bar/
    ├── radio/
    ├── response-button/
    ├── select/
    ├── slider/
    ├── summary-meta/
    ├── switch/
    ├── table/
    ├── tabs/
    ├── tag/
    ├── text-area/
    ├── text-block/
    ├── text-input/
    ├── toast/
    ├── tooltip/
    └── versa-tile/
```

Each documented component folder contains `rules.md` and `examples.html`. Components with documented behaviour scripts also carry their supplied JavaScript where applicable.

Patterns are guidance for composition. They do not create a competing styling/runtime layer; they teach the AI how to structure pages and combine documented Buckholt components correctly.

## Foundations

Read the relevant foundation before changing shared design decisions:

- `foundations/colour/` — palette, semantic roles and contrast.
- `foundations/iconography/` — Font Awesome v7 rules and documented icon catalogue.
- `foundations/radius/rules.md` — documented radius scale and runtime-extension guidance.
- `foundations/shadows/rules.md` — elevation and feedback shadows.
- `foundations/spacing/rules.md` — core spacing, padding and margin scales.
- `foundations/typography/` — Proxima Soft, type scales and named type sets.

Prefer Buckholt semantic classes/tokens over hard-coded values or generic Bootstrap styling when Buckholt defines the role.

## Pattern coverage

### Page layout

Read `patterns/page-layout/rules.md` **before creating a complete Buckholt page or substantial page section**.

Page layout teaches the AI how to start from structure rather than from isolated components. It covers Buckholt's eight base CSS-Grid layouts, semantic Header / Sidebar / Main / Footer regions, and the nested main-content hierarchy:

```text
Page body
└─ Frame
   └─ Pane
      └─ Panel
         └─ Components & patterns
```

Main is the only required base-layout region. Panels group directly related content with a documented 32px item gap; Panes group Panels with a 64px gap; Frames wrap Panes with 64px vertical / 48px horizontal padding and a 64px gap (the horizontal value is 4rem minus half the container gutter, so a `.container` child's content still sits 64px from the frame edge). Bootstrap `.container`, `.row` and `.col-*` provide horizontal/responsive scaffolding while Buckholt Frame/Pane/Panel control hierarchy and vertical rhythm.

### Forms

Read `patterns/forms/rules.md` when creating a complete form experience. It covers top-aligned labels, simple-vs-complex required/optional labelling, action placement, longer forms, progressive disclosure, inline editing, Accordion forms, multistep forms, Modal forms and side-panel forms.

### Input rows

Read `patterns/input-rows/rules.md` when deciding whether related fields should appear inline. Default to stacked fields; use Input rows sparingly and only where side-by-side placement clearly improves usability. Bootstrap breakpoints control responsive stacking and each input validates independently.

### Lookup

Read `patterns/lookup/rules.md` for the full known-value retrieval flow. It distinguishes Lookup from exploratory Search and covers input, result/refinement and summary/confirmation phases.

### Common actions

Read `patterns/common-actions/rules.md` when choosing labels/icons for recurring actions such as Add, Copy, Delete, Download, Edit, External link, Logout, Save, Search, Settings and Upload. Use the documented icon mapping consistently and apply visual hierarchy/destructive treatment through Button/Menu guidance.

## Component coverage

Current component guidance is available for:

**Accordion, Alert, Avatar, Breadcrumb, Button, Card, Checkbox, Collapse, Dropdown, Form, Heading attachment, Icon block, Input group, Input row, Key-value pair, Link, List, Lookup, Menu, Menu button, Modal, Multi-field input, Nested inputs, Number input, Page navigation, Progress bar, Radio, Response button, Select, Slider, Summary Meta, Switch, Table, Tabs, Tag, Text area, Text block, Text input, Toast, Tooltip and Versa-tile.**

Read the component's `rules.md` and `examples.html` before implementation. Important distinctions include:

- **Page navigation vs Tabs:** Page navigation links to separate sibling pages; Tabs switch content in place.
- **Response button:** radio inputs are the default single-select form; checkbox inputs are the documented multi-select form.
- **Select:** uses a native `<select>`; Buckholt's read-only treatment is `.readonly` plus `disabled`.
- **Switch:** default, small and always-active are separate documented behaviours; always-active means permanently/enforced on, not merely disabled.
- **Tabs:** use Bootstrap pill behaviour plus Buckholt's supplied overflow script where needed.
- **Text area:** uses the shared Form script for the documented character counter.
- **Table:** currently supported as provisional/WIP because the available Buckholt source does not yet provide the same complete formal specification as the other components.

## Runtime dependencies

```html
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/buckholt.css">
<link rel="stylesheet" href="css/buckholt-ai-fixes.css">
```

> **Do not load Bootstrap CSS separately.** `buckholt.css` is a complete, self-contained
> Bootstrap 5.3 build with Buckholt as the theme. The live Buckholt documentation site has
> its Bootstrap stylesheet commented out and loads only its own compiled CSS — this is the
> verified contract.
>
> Bootstrap **JavaScript is a separate dependency and is required**: the live site loads
> the 5.1.3 bundle, active, for the ten components with `data-bs-*` hooks. Keep it.
> See `CLAUDE.md` → Runtime dependencies.


For Bootstrap-driven Buckholt behaviour such as tooltips, dropdown menus, alerts, accordions, modals, tabs and toasts, also load:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
```

Use the component-supplied scripts only when their documented behaviour is needed:

```html
<script src="components/dropdown/dropdown.js"></script>
<script src="components/form/form.js"></script>
<script src="components/tabs/tabs.js"></script>
```

`form.js` contains shared documented Form behaviours including the Text area character counter. `tabs.js` adds Buckholt's scroll-button behaviour when Tabs overflow. Do not rewrite these behaviours as local component scripts unless the implementation environment genuinely requires an adapter.

## Agent behaviour

For a complete page, coding agents should read in this order:

1. `CLAUDE.md`
2. `patterns/page-layout/rules.md`
3. any other relevant pattern guidance (`forms`, `input-rows`, `lookup`, `common-actions`)
4. relevant foundations
5. every component folder used in the page
6. `discrepancies/known-issues.md` where applicable

Start with page structure and content grouping before selecting individual components. Follow documented Buckholt intent first, use the runtime CSS to implement it accurately, and apply only verified corrections from `css/buckholt-ai-fixes.css`.

Do not invent missing components, variants, states, responsive behaviour, page wrappers or design tokens. If the documentation does not establish something, report the gap rather than approximating Buckholt with custom CSS.