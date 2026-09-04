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

### Proxima Nova

Use the approved Adobe Fonts stylesheet:

```html
<link rel="stylesheet" href="https://use.typekit.net/aio4aoz.css">
```

Other dependencies, including icons, will be added only when their approved source is supplied.

## Agent behaviour

Coding agents should read `CLAUDE.md` and the relevant component folder before implementing Buckholt UI. They should use the real classes and markup already provided by Buckholt and should flag missing information instead of inventing new design-system behaviour.
