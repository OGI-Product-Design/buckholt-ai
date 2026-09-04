# Buckholt AI

A lean, machine-readable companion for using the Buckholt design system accurately in coding agents such as Claude Code, Cursor and Codex.

## Goal

**Build with Buckholt; do not imitate Buckholt.**

This repository is deliberately evidence-led. It teaches coding agents only patterns that can be traced to Buckholt's documentation or the real compiled runtime stylesheet.

## Source hierarchy

1. **Buckholt documentation website** — primary source of truth for intended Digital Product design-system behaviour: usage, hierarchy, accessibility, canonical markup, scales and design-system meaning.
2. `css/buckholt.css` — current runtime implementation. Use it for real selectors, variables, states and browser behaviour, while recognising that it may contain extra helpers or values added when Buckholt was also used to build the company website.
3. `foundations/<foundation>/` — concise shared design-system guidance extracted from documentation and checked against runtime CSS where useful.
4. `components/<component>/rules.md` — component guidance rebuilt from Buckholt documentation plus runtime implementation evidence.
5. `components/<component>/examples.html` — verified canonical markup examples.

Extra runtime CSS is useful flexibility, but it does not become canonical Buckholt guidance unless the documentation says so. Only significant runtime differences that could mislead an implementation agent are noted in `discrepancies/known-issues.md`.

Old SCSS, old token maps, screenshots, Figma and earlier interpreted AI specifications are intentionally excluded from the implementation path unless explicitly requested for investigation.

## Structure

```text
buckholt-ai/
├── README.md
├── CLAUDE.md
├── css/
│   └── buckholt.css
├── foundations/
│   ├── colour/
│   ├── iconography/
│   ├── radius/
│   ├── shadows/
│   ├── spacing/
│   └── typography/
│       ├── rules.md
│       └── type-sets.md
├── discrepancies/
│   └── known-issues.md
└── components/
    ├── button/
    │   ├── rules.md
    │   └── examples.html
    ├── link/
    │   ├── rules.md
    │   └── examples.html
    └── text-block/
        ├── rules.md
        └── examples.html
```

## Foundation coverage

### Colour
Read `foundations/colour/` for the global palette, semantic/foundation colour roles and contrast guidance.

### Iconography
Read `foundations/iconography/` for Buckholt's Font Awesome v7 usage and the full documented icon catalogue.

### Radius
Read `foundations/radius/rules.md` before adding or overriding border radius. Follow the documented scale for design decisions; additional runtime radius values may be used where an existing Buckholt implementation requires them.

### Shadows
Read `foundations/shadows/rules.md` before adding elevation. Buckholt documents five shadow levels (`xs` through `xl`) and feedback shadow treatments. Shadows should be purposeful, subtle and used only for genuinely elevated UI.

### Spacing
Read `foundations/spacing/rules.md` before introducing margins, padding or gaps. It records the documented core spacing scale plus Buckholt's dedicated padding and margin tokens. Prefer tokens over hard-coded spacing values.

### Typography
Read `foundations/typography/rules.md` and `foundations/typography/type-sets.md` before choosing or changing typography. Buckholt uses Proxima Soft with the documented `Proxima-soft, Arial, sans-serif` stack, a ten-step type scale, and named type sets for display, headline, title, body, support, action, form, label and key-value roles. Prefer the documented type-set class over arbitrary font styling or Bootstrap typography helpers.

## Component coverage

### Button
Read `components/button/rules.md` and `components/button/examples.html`, plus the relevant foundations when choosing colour, icons, radius, spacing, typography or other shared styling.

### Link
Read `components/link/rules.md` and `components/link/examples.html`, plus colour, iconography, spacing and typography where relevant. The Link guidance covers inline and standalone links, icon use, new-tab/external-link treatment, interaction states and horizontal/stacked Link sets.

A documented/runtime difference for the visited standalone-link icon is recorded in `discrepancies/known-issues.md`; documentation remains the source of truth for intended state colour.

### Text block
Read `components/text-block/rules.md` and `components/text-block/examples.html`, plus Typography, Spacing, Iconography and Colour foundations. Text block covers semantic heading structure, Buckholt display/headline/title type sets, paragraphs, eyebrow text, inline heading icons and icon blocks.

Important composition rules include: use semantic heading levels independently of visual type style; do not combine icon blocks with eyebrow text or inline heading icons; use inline icons rather than icon blocks with display-sized headings.

## Runtime dependencies

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/buckholt.css">
```

For Buckholt behaviours that use Bootstrap JavaScript such as tooltips, also load:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
```

## Agent behaviour

Coding agents should read `CLAUDE.md`, the relevant foundation files and the relevant component folder before implementing Buckholt UI. Follow documented Buckholt intent first, use the runtime CSS to implement it accurately, and do not invent design-system behaviour from undocumented runtime extras.
