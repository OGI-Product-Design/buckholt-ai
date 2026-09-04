# Buckholt AI

A lean, machine-readable companion for using the Buckholt design system accurately in coding agents such as Claude Code, Cursor and Codex.

## Goal

**Build with Buckholt; do not imitate Buckholt.**

This repository is deliberately evidence-led. It should teach coding agents only patterns that can be traced to the Buckholt documentation or the real compiled runtime stylesheet.

## Sources of truth

1. `css/buckholt.css` — final browser/runtime truth for selectors, states, dimensions and generated behaviour.
2. `components/<component>/rules.md` — concise usage and implementation guidance rebuilt from Buckholt documentation plus runtime CSS.
3. `components/<component>/examples.html` — verified canonical markup examples.
4. The Buckholt component URLs recorded inside each `rules.md` file for deeper reference.

Old SCSS, token maps, screenshots, Figma and earlier interpreted AI specifications are intentionally excluded from the implementation path unless explicitly requested for investigation. They must not override the current compiled CSS or verified documentation.

## Structure

```text
buckholt-ai/
├── README.md
├── CLAUDE.md
├── css/
│   └── buckholt.css
└── components/
    └── button/
        ├── rules.md
        └── examples.html
```

More component folders should be added only after the corresponding documentation and runtime implementation have been reconciled.

## Button coverage

The first rebuilt component is Button.

Verified coverage includes:

- `.btn` base behaviour;
- `.btn-primary`, `.btn-secondary`, `.btn-ghost`;
- `.btn-danger` as a modifier for primary, secondary and ghost buttons;
- `.btn-sm`, default/medium and `.btn-lg`;
- resting, hover, focus, active and disabled behaviour;
- the intentional 3px clickable bottom border on primary/secondary buttons, returning to 1px for focus/active; ghost stays at the normal border width;
- `.btn-icon` and `.button-label` structure;
- documented Font Awesome icon mappings for common actions;
- icon-only button guidance and required tooltips;
- button-set layout including `.button-set` and `.button-set-stacked`;
- usage guidance for hierarchy, content, alignment, sets, icons, icon-only buttons and keyboard interaction.

The Button Usage, Style and Code & specs documentation have all been supplied and reconciled with `css/buckholt.css`.

## Runtime dependencies

### Bootstrap CSS

Load Bootstrap 5.1.3 before Buckholt:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
```

### Proxima Nova / Proxima Soft

Use the Adobe Fonts stylesheet shown in the Buckholt documentation source:

```html
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
```

The compiled Buckholt stylesheet requests `"Proxima-soft", Arial, sans-serif`.

### Font Awesome

Use the Font Awesome kit shown by the Buckholt documentation:

```html
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
```

Do not substitute a different icon library.

### Bootstrap JavaScript for interactive Bootstrap behaviours

When a page uses Bootstrap-powered behaviour such as Buckholt tooltips, also load the Bootstrap 5.1.3 bundle:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
```

Buckholt's documentation initialises elements with `data-bs-toggle="tooltip"` using `bootstrap.Tooltip`. A standalone page that demonstrates icon-only button tooltips therefore needs the Bootstrap bundle plus tooltip initialisation.

## Recommended standalone page order

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/buckholt.css">
```

Add the Bootstrap JS bundle before the closing `</body>` when the page uses tooltips or other Bootstrap interactions.

## Agent behaviour

Coding agents should read `CLAUDE.md` and the relevant component folder before implementing Buckholt UI. They should use real Buckholt classes and verified markup, and explicitly flag genuine conflicts instead of inventing design-system behaviour.
