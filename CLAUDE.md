# Buckholt AI instructions

## Purpose

Use the Buckholt design system accurately when building UI.

## Sources of truth

Use these Buckholt sources in this order:

1. `css/buckholt.css` — final runtime implementation and styling truth: selectors, states, dimensions and generated behaviour.
2. `components/<component>/rules.md` — concise component guidance rebuilt from Buckholt documentation and runtime CSS.
3. `components/<component>/examples.html` — verified canonical markup examples.
4. The Buckholt component documentation URLs recorded in each component's `rules.md` when more detail is required.

Old SCSS, token maps, screenshots, Figma and previous interpreted AI specifications are **not** implementation sources for this repository unless explicitly requested for investigation.

## Core rule

**Build with Buckholt. Do not imitate Buckholt.**

Before implementing a Buckholt component:

- read `components/<component>/rules.md`;
- read `components/<component>/examples.html`;
- use the real Buckholt classes and verified markup documented there;
- rely on `css/buckholt.css` for visual implementation and interaction states;
- do not recreate component styling with custom CSS where Buckholt already provides it.

## Evidence discipline

If documentation and compiled CSS conflict, report the conflict rather than guessing. The compiled CSS remains final browser/runtime truth for what actually renders.

Do not infer Buckholt classes from Bootstrap naming conventions and do not replace documented Buckholt markup with a preferred alternative unless explicitly asked to improve the design system itself.

## Custom CSS

Custom CSS may be used for page/demo layout only when necessary. It must not be used to recreate or override Buckholt component styling simply to make an implementation look right.

## Runtime dependencies

### Bootstrap CSS

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
```

### Proxima Nova / Proxima Soft

```html
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
```

The compiled Buckholt CSS requests `"Proxima-soft", Arial, sans-serif`.

### Font Awesome

```html
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
```

Do not replace Font Awesome with another icon library. Use the documented icon classes in the component rules/examples rather than generic placeholders when a mapping is available.

### Buckholt CSS

Load `css/buckholt.css` after Bootstrap CSS.

### Bootstrap JavaScript

For Buckholt patterns that use Bootstrap behaviour such as tooltips, also load the Bootstrap 5.1.3 bundle:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
```

Buckholt documentation initialises `[data-bs-toggle="tooltip"]` with `bootstrap.Tooltip`. Do not substitute a native `title` tooltip when implementing the documented Buckholt tooltip behaviour unless explicitly asked for a no-JS fallback.

## Current component coverage

### Button

Read:

- `components/button/rules.md`
- `components/button/examples.html`

Verified in the current rebuild:

- base `.btn` behaviour;
- primary, secondary and ghost variants;
- `.btn-danger` modifier for primary, secondary and ghost;
- small/default/large sizing;
- resting, hover, focus, active and disabled behaviour;
- intentional 3px clickable bottom border on primary/secondary, returning to 1px on focus/active; ghost uses the normal border width;
- `.btn-icon` and `.button-label` structure;
- documented common-action Font Awesome mappings;
- icon-only button guidance and required tooltips;
- button-set behaviour including stacked sets;
- usage, content, alignment and accessibility guidance.

The Button Usage, Style and Code & specs documentation have all been supplied. Do not treat danger or icon markup as unresolved.
