# Buckholt AI

A lean, machine-readable companion for using the Buckholt design system accurately in coding agents such as Claude Code, Cursor and Codex.

## Goal

**Build with Buckholt; do not imitate Buckholt.**

## Sources of truth

This repository deliberately uses only two Buckholt sources unless explicitly instructed otherwise:

1. `css/buckholt.css` — the implementation and styling source of truth.
2. Buckholt documentation extracted into `components/<component>/` — the source of truth for canonical HTML, usage, accessibility, variants, icon markup and implementation notes.

Old SCSS, token maps and previous interpreted AI specifications are intentionally excluded.

## Structure

```text
buckholt-ai/
├── README.md
├── CLAUDE.md
├── css/
│   └── buckholt.css
└── components/
    └── <component>/
        ├── rules.md
        └── examples.html
```

Component folders are added as the live Buckholt documentation is extracted.

## Runtime dependencies

The live Buckholt documentation site currently shows the following runtime environment.

### Bootstrap

Buckholt documentation loads Bootstrap 5.1.3 before Buckholt:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
```

Load Bootstrap before `css/buckholt.css` so Buckholt can provide the final component styling.

### Proxima Nova

Use the Adobe Fonts stylesheet shown in the live Buckholt documentation source:

```html
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
```

### Font Awesome

Use the Font Awesome kit script shown in the live Buckholt documentation source:

```html
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
```

The optional DNS-prefetch line:

```html
<link rel="dns-prefetch" href="//kit.fontawesome.com">
```

does not load Font Awesome by itself; the kit script above is what provides the icon runtime.

Do not substitute a different icon library.

## Recommended standalone page order

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/buckholt.css">
```

## Agent behaviour

Coding agents should read `CLAUDE.md` and the relevant component folder before implementing Buckholt UI. They should use the real classes and markup already provided by Buckholt and should flag missing information instead of inventing new design-system behaviour.
