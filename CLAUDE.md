# Buckholt AI instructions

## Purpose

Use the Buckholt design system accurately when building UI.

## Sources of truth

Use these Buckholt sources together:

1. Buckholt documentation — intended usage, hierarchy, accessibility, canonical markup and design-system meaning.
2. `css/buckholt.css` — current runtime implementation and styling truth for selectors, values, states, dimensions and generated behaviour.
3. `foundations/<foundation>/` — shared design-system guidance and runtime values reconciled from documentation + CSS where relevant.
4. `components/<component>/rules.md` — component guidance rebuilt from documentation and runtime CSS.
5. `components/<component>/examples.html` — verified canonical markup examples.

Old SCSS, old token maps, screenshots, Figma and previous interpreted AI specifications are **not** implementation sources unless explicitly requested for investigation.

## Core rule

**Build with Buckholt. Do not imitate Buckholt.**

Before implementing Buckholt UI:

- read the relevant foundation files when the component depends on colour, typography, spacing, iconography or other shared rules;
- read `components/<component>/rules.md` and `examples.html` for the component;
- use the real Buckholt classes, variables and verified markup;
- do not recreate component styling with custom CSS where Buckholt already provides it.

## Evidence discipline

If documentation and compiled CSS conflict, report the conflict rather than guessing or silently patching it. The documentation expresses intended Buckholt behaviour; the CSS expresses what the current runtime actually renders.

Do not infer Buckholt classes from Bootstrap naming conventions and do not replace documented Buckholt markup with a preferred alternative unless explicitly asked to improve the design system itself.

## Colour foundation

Before choosing or changing colours, read:

- `foundations/colour/rules.md`
- `foundations/colour/palette.md`
- `foundations/colour/foundation-tokens.md`
- `foundations/colour/contrast.md`

Buckholt colour has three tiers: Global palette -> Foundation roles -> Component colours.

Implementation rules:

- prefer component classes and semantic/foundation CSS variables;
- do not copy raw palette hex values into component CSS when a Buckholt variable exists;
- do not substitute Bootstrap semantic colours for Buckholt colour roles;
- preserve the documented feedback meanings: info, success, warning and error;
- validate contrast when creating a colour combination not already defined by Buckholt;
- do not rely on colour alone to communicate important meaning.

## Iconography foundation

Before choosing an icon, read:

- `foundations/iconography/rules.md`
- `foundations/iconography/catalogue.md`

Implementation rules:

- Buckholt uses Font Awesome v7;
- use the exact Buckholt icon mapping from `catalogue.md` when one exists;
- regular is the documented style for most applications, but preserve any `solid` or `brands` mapping explicitly listed in the catalogue;
- do not substitute a visually similar Font Awesome icon because it seems preferable;
- use the documented role as semantic evidence when selecting between icons;
- if an icon has no documented role, do not invent one;
- if no Buckholt icon covers the requirement, report the gap rather than inventing a Buckholt mapping;
- component documentation controls wrappers, accessible names, tooltips and other component-specific icon behaviour.

The current catalogue contains 111 documented Buckholt icons.

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

### Font Awesome

```html
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
```

Do not replace Font Awesome with another icon library. Use documented icon classes when a mapping is available.

### Buckholt CSS

Load `css/buckholt.css` after Bootstrap CSS.

### Bootstrap JavaScript

For Buckholt patterns that use Bootstrap behaviour such as tooltips, also load:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
```

Do not substitute a native `title` tooltip when implementing documented Buckholt tooltip behaviour unless explicitly asked for a no-JS fallback.

## Current component coverage

### Button

Read:

- `components/button/rules.md`
- `components/button/examples.html`
- `foundations/iconography/catalogue.md` when choosing Button icons

Verified in the current rebuild:

- base `.btn` behaviour;
- primary, secondary and ghost variants;
- `.btn-danger` modifier for primary, secondary and ghost;
- small/default/large sizing;
- resting, hover, focus, active and disabled behaviour;
- intentional 3px clickable bottom border on primary/secondary, returning to 1px on focus/active; ghost uses the normal border width;
- `.btn-icon` and `.button-label` structure;
- icon-only button guidance and required tooltips;
- button-set behaviour including stacked sets;
- usage, content, alignment and accessibility guidance.

The Button Usage, Style and Code & specs documentation have all been supplied.
