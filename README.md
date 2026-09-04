# Buckholt AI

A lean, machine-readable companion for using the Buckholt design system accurately in coding agents such as Claude Code, Cursor and Codex.

## Goal

**Build with Buckholt; do not imitate Buckholt.**

This repository is deliberately evidence-led. It should teach coding agents only patterns that can be traced to the live Buckholt documentation or the real compiled runtime stylesheet.

## Sources of truth

1. `css/buckholt.css` — final browser/runtime truth for selectors, states, dimensions and generated behaviour.
2. `components/<component>/rules.md` — concise usage and implementation guidance rebuilt from the live Buckholt documentation plus runtime CSS.
3. `components/<component>/examples.html` — verified markup examples only.
4. The live Buckholt component URLs recorded inside each `rules.md` file for deeper reference.

Old SCSS, token maps and earlier interpreted AI specifications are intentionally excluded from the implementation path. They may still be useful for investigation, but they must not override the current compiled CSS or verified documentation.

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

More component folders should be added only after the corresponding live documentation and runtime implementation have been reconciled.

## Button coverage

The first rebuilt component is Button.

Current verified coverage includes:

- `.btn` base behaviour;
- `.btn-primary`, `.btn-secondary`, `.btn-ghost`;
- `.btn-sm`, default/medium and `.btn-lg`;
- focus, active and disabled runtime behaviour;
- `.btn-icon` runtime sizing rules;
- button-set layout including `.button-set-stacked`;
- live guidance for hierarchy, content, alignment, sets, icons, icon-only buttons and keyboard interaction.

The live Button Usage page is currently readable. The dedicated Style and Code & specs pages are recorded in `components/button/rules.md`, but their content could not be reliably retrieved by the current crawler during this rebuild. Because of that, canonical danger-button markup and exact icon markup are deliberately left unresolved rather than guessed.

## Runtime dependencies

The live Buckholt documentation site currently shows the following runtime environment.

### Bootstrap

Load Bootstrap 5.1.3 before Buckholt:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
```

### Proxima Nova / Proxima Soft

Use the Adobe Fonts stylesheet shown in the live Buckholt documentation source:

```html
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
```

The compiled Buckholt stylesheet requests `"Proxima-soft", Arial, sans-serif`.

### Font Awesome

Use the Font Awesome kit shown by the live Buckholt documentation:

```html
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
```

Do not substitute a different icon library.

## Recommended standalone page order

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/buckholt.css">
```

## Agent behaviour

Coding agents should read `CLAUDE.md` and the relevant component folder before implementing Buckholt UI. They should use real Buckholt classes and verified markup, and explicitly flag missing evidence instead of inventing design-system behaviour.
