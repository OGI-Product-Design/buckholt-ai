# Buckholt AI Design System — Foundations v0.5

> Status: extracted from `buckholt.scss`, `_variables.scss`, `_root.scss`, `_type.scss`, `_layout.scss`, `_grid.scss` and `_accent.scss`.  
> This is an AI-facing, tool-agnostic design specification reconciled from SCSS, compiled CSS, Buckholt documentation and Figma where available.

## Purpose

This file describes the meaning and usage of Buckholt foundations. Exact token values live in `tokens.json`.

The aim is for Claude Code, Cursor, Codex and other coding agents to implement Buckholt consistently without guessing visual values.

## Evidence hierarchy

Buckholt AI specifications should be reconciled from the available sources using distinct roles:

1. **SCSS source** — architecture, maps, mixins, source tokens and implementation intent.
2. **Compiled `buckholt.css`** — final browser-facing selectors, resolved values, generated classes, breakpoints and runtime dependencies.
3. **Buckholt documentation site** — intended usage, accessibility, naming, examples and do/don't guidance.
4. **Figma** — visual truth, component variants and designer-facing behaviour.
5. **AI specification** — concise neutral interpretation consumed by Claude Code, Cursor, Codex and other agents.

For implementation testing, prefer loading the real compiled `buckholt.css` rather than recreating Buckholt CSS from the AI specification.

Do not invent a missing source file or selector simply because the documentation describes a pattern. Record the known UX rule and mark the technical selector unresolved if the source is not present.

## Source-of-truth order

1. Existing Buckholt implementation (SCSS/CSS) for technical values.
2. Buckholt Figma library for visual and behavioural validation.
3. This AI specification as the concise machine-consumable interpretation.

Where sources disagree, flag the discrepancy rather than silently choosing a value.

## Implementation principles

- Use existing Buckholt tokens and CSS custom properties where available.
- Do not invent colours, spacing, type sizes, radii, borders or focus treatments when a Buckholt token exists.
- Preserve semantic tokens such as `text-*`, `ui-background-*`, `ui-border-*` and `action-*` rather than replacing them with arbitrary raw colours.
- Treat component-level rules as unresolved until the relevant component SCSS and Figma references have been reviewed.

## Colour

Buckholt separates raw palettes from semantic colour roles.

Raw palettes currently captured:
- Neutral
- Primary
- Danger
- Caution
- Valid
- Info

Semantic roles currently captured:
- Text
- UI backgrounds
- UI borders
- State colours
- Action colours

Buckholt also defines three accent palettes. Each has a 10–100 scale, a prime colour at level 60, and a separate tint scale.

- Accent 01 prime → `#5731D6` (purple)
- Accent 02 prime → `#DB1256` (pink/red)
- Accent 03 prime → `#0E80A4` (blue/teal)

Agents should not treat these as interchangeable decorative colours. Their semantic/usage rules still need to be validated against Figma or design-system documentation.

### Important semantic examples

- Primary text → `#1a1a1a`
- Secondary text → neutral 90
- Active text/focus → info 60
- Success → valid 60
- Error → danger 60
- Body background → UI background 02 / neutral 10

Agents should prefer semantic roles over picking a palette colour directly.

## Spacing

Buckholt uses a 1rem / 16px base.

Core spacer scale:
- 0 → 0
- 01 → 2px
- 02 → 4px
- 03 → 8px
- 04 → 16px
- 05 → 24px
- 06 → 32px
- 07 → 48px
- 08 → 64px
- 09 → 128px

Buckholt also defines separate component padding and margin scales. Use those scales for component implementation rather than arbitrary values.

## Typography

Primary stack:
`'Proxima-soft', Arial, sans-serif`

Root size: 16px  
Body size: 16px  
Body weight: 300 (Light)  
Body line-height: 1.5  
Base letter-spacing: 0.16px

### Type scale

- 01 → 12px
- 02 → 14px
- 03 → 16px
- 04 → 20px
- 05 → 24px
- 06 → 28px
- 07 → 32px
- 08 → 36px
- 09 → 40px
- 10 → 56px

### Heading mapping

- H1 → 40px / semibold
- H2 → 32px / semibold
- H3 → 28px / semibold
- H4 → 24px / semibold
- H5 → 20px / semibold
- H6 → 16px / semibold

Heading line-height is 1.2.

### Typography utility classes

`_type.scss` generates typography utility classes from a `$typography` map using the pattern:

`.{type}-{scale}`

For each generated class Buckholt applies:
- font size from the map;
- font weight from the map;
- a mapped line-height adjustment, or a fallback of `font-size + 0.5rem`;
- a mapped letter-spacing value, or Buckholt's base letter-spacing;
- these values are applied with `!important`.

The compiled CSS verifies the generated typography utilities. Agents should prefer those existing utilities where appropriate rather than inventing type styles.

## Borders and radius

Default border:
- Width: 1px
- Style: solid
- Semantic colour: UI border 02

Radius scale:
- xs → 4px
- sm → 6px
- md → 8px
- lg → 16px
- xl → 24px
- full → 32px

Do not assume a component's radius from this scale alone. Component SCSS must determine which radius token that component uses.

## Focus

Base focus ring:
- Width: 2px
- Blur: 0
- Opacity: 1
- Colour: focus 01 / info 60

Component-specific focus behaviour should follow the real compiled component implementation.

## Layout

Buckholt has an explicit application-layout system implemented with CSS Grid.

### Base application layout

`.layout`:
- display → grid
- width / height → 100%
- minimum height → 100vh
- default columns → `auto 1fr`
- default rows → `auto 1fr auto`

The named layout areas are:
- `header`
- `footer`
- `main`
- `sidebar`

The source SCSS includes multiple application arrangements, while the compiled CSS currently exposes the runtime layout rules consumed by the browser. Use existing runtime selectors rather than inventing page grids.

### Page hierarchy

Buckholt defines structural page primitives around page body/section, pane, panel and content grouping.

Important behaviour:
- page containers are vertical flex structures;
- large page spacing comes from Buckholt page spacing tokens;
- `page-pane` uses the pane gap;
- `page-panel` uses the panel gap and Bootstrap horizontal gutter;
- `content-group` is a vertical stack using the content-spacing token.

Current global values:
- Body background → UI background 02
- Text max width → 54rem / 864px
- Grid gutter → 32px
- Page body spacing → 64px x/y
- Page section gap → 64px
- Page pane gap → 64px
- Page panel gap → 32px
- Content spacing → 24px

These are global tokens, not a guarantee that every Buckholt screen uses all of them.

## Grid

Buckholt supports Bootstrap's row/column grid and CSS Grid.

The compiled CSS confirms runtime breakpoints:

- xs → 0
- sm → 576px
- md → 768px
- lg → 992px
- xl → 1200px
- xxl → 1400px

The standard runtime gutter is 32px.

## Technical architecture discovered

`buckholt.scss` shows that Buckholt:
- builds on Bootstrap SCSS;
- overrides Bootstrap variables before Bootstrap's own variables are loaded;
- supplies Buckholt maps, mixins and root variables;
- replaces Bootstrap reboot with a Buckholt reboot;
- uses custom layout, grid, typography, components and patterns;
- exposes many foundation values as CSS custom properties via `_root.scss`;
- currently has dark mode disabled;
- has CSS Grid enabled.

The compiled CSS is an important validation source because it shows the final runtime API, including generated selectors and external dependencies.

## Runtime dependencies

Buckholt expects `"Proxima-soft", Arial, sans-serif`.

The compiled CSS also uses Font Awesome in two ways:
- embedded SVG data URLs;
- font-based glyphs through variables such as `--fa-font-regular` and `--fa-font-solid`, with some explicit Font Awesome 6 Pro references.

If these runtime dependencies are missing, agents should report the dependency rather than silently substitute a different design asset.

## Component specifications

Component-level design guidance is kept separately so the foundation file remains concise.

- `components/button.md` — Button component v0.3 (SCSS + compiled CSS + Figma + Buckholt documentation reconciled; ready for implementation testing).

## Current validation phase

The foundation layer and Button are sufficiently documented to run the first controlled Claude implementation test.

Use the real compiled Buckholt CSS in the test. If the result differs from Figma/documentation, diagnose whether the cause is missing fonts/icons, incorrect Buckholt class usage, or an error in this shared specification before adding any one-off CSS fixes.
