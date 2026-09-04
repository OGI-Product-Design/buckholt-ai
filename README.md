# Buckholt AI

Machine-readable, AI-consumable guidance for implementing the Buckholt design system accurately in coding agents such as Claude Code, Cursor and Codex.

## Goal

AI should **build with Buckholt, not imitate Buckholt**.

This repository combines:

- Buckholt source/compiled CSS for the real browser-facing implementation;
- tool-neutral design guidance in `design.md`;
- structured token facts in `tokens.json`;
- component-specific contracts in `components/`;
- agent-specific instructions such as `CLAUDE.md`;
- small validation harnesses in `test/`.

## Evidence model

Use each source for a different purpose:

1. **SCSS source** — architecture, maps, mixins and implementation intent.
2. **Compiled `css/buckholt.css`** — final selectors, resolved values, generated classes, breakpoints and runtime dependencies.
3. **Buckholt documentation** — usage, accessibility, naming and examples.
4. **Figma** — visual truth and designer-facing variants.
5. **AI specification** — concise reconciled guidance for coding agents.

Do not invent missing selectors, variants or tokens. If sources disagree or information is missing, flag the gap.

## Repository structure

```text
buckholt-ai/
├── README.md
├── CLAUDE.md
├── design.md
├── tokens.json
├── css/
│   └── buckholt.css
├── components/
│   └── button.md
├── assets/
│   └── fonts/
│       └── .gitkeep
└── test/
    └── button-showcase/
        └── index.html
```

## Fonts

Buckholt uses `"Proxima-soft", Arial, sans-serif`.

Licensed Proxima font binaries are intentionally not committed until the organisation confirms that the licence permits repository distribution. Put approved local font files in `assets/fonts/` and add the relevant `@font-face` declarations in the consuming project.

## Font Awesome

The compiled Buckholt CSS uses a mixture of embedded Font Awesome SVG data and font-based Font Awesome glyphs. A consuming application must load the appropriate Font Awesome dependency for glyph-based icons such as dropdown carets and generated icon content.

## Working rule for AI agents

Where Buckholt already exposes a class or component, use it. Do not recreate the same visual treatment with one-off CSS.

Example:

```html
<button type="button" class="btn btn-primary">
  <span class="button-label">Continue</span>
</button>
```

Prefer this over recreating the button colour, spacing, radius or focus state manually.

## Current coverage

The foundation layer is documented and Button is the first component family to be reconciled from SCSS, compiled CSS, Figma and Buckholt documentation.

Next milestone: validate the Button specification in Claude Code using the real compiled Buckholt CSS, then correct the shared specification rather than adding one-off prompt fixes.
