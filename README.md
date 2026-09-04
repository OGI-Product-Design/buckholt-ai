# Buckholt AI

A lean, machine-readable companion for using the Buckholt design system accurately in coding agents such as Claude Code, Cursor and Codex.

## Goal

**Build with Buckholt; do not imitate Buckholt.**

This repository is deliberately evidence-led. It should teach coding agents only patterns that can be traced to the Buckholt documentation or the real compiled runtime stylesheet.

## Sources of truth

1. Buckholt documentation — intended usage, hierarchy, accessibility, canonical markup and design-system meaning.
2. `css/buckholt.css` — current browser/runtime implementation: selectors, values, states, dimensions and generated behaviour.
3. `foundations/<foundation>/` — shared design-system rules and values extracted from the documentation and reconciled with runtime CSS where relevant.
4. `components/<component>/rules.md` — concise component guidance rebuilt from Buckholt documentation plus runtime CSS.
5. `components/<component>/examples.html` — verified canonical markup examples.

If documentation and runtime CSS disagree, record/report the discrepancy rather than silently deciding that one should replace the other. Verified discrepancies are recorded in `discrepancies/known-issues.md`.

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
│   └── radius/
│       └── rules.md
├── discrepancies/
│   └── known-issues.md
└── components/
    └── button/
        ├── rules.md
        └── examples.html
```

## Foundation coverage

### Colour
Read `foundations/colour/` for the global palette, semantic/foundation colour roles and contrast guidance.

### Iconography
Read `foundations/iconography/` for Buckholt's Font Awesome v7 usage and the full documented icon catalogue.

### Radius
Read `foundations/radius/rules.md` before adding or overriding border radius.

The documentation states that larger components generally use larger radii and that components have an appropriate radius applied by default. The documented scale is 4, 6, 8, 16, 24 and 32px for xs, sm, md, lg, xl and `full` respectively.

The current runtime agrees for xs–xl, but differs at the top end: it exposes `--border-radius-xxl: 2rem`, `--border-radius-full: 625rem` and `--border-radius-round: 50%`. This mismatch is recorded in `discrepancies/known-issues.md`; agents must not silently remap the names.

## Button coverage

The first rebuilt component is Button. Read `components/button/rules.md` and `components/button/examples.html`, plus the relevant foundations when choosing colour, icons or radius.

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

Coding agents should read `CLAUDE.md`, relevant foundation files and the relevant component folder before implementing Buckholt UI. They should use real Buckholt classes, variables and approved icon mappings, and explicitly flag genuine conflicts instead of inventing design-system behaviour.
