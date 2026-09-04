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
6. `discrepancies/known-issues.md` — verified documentation/runtime conflicts that must not be silently resolved.

Old SCSS, old token maps, screenshots, Figma and previous interpreted AI specifications are **not** implementation sources unless explicitly requested for investigation.

## Core rule

**Build with Buckholt. Do not imitate Buckholt.**

Before implementing Buckholt UI:

- read the relevant foundation files when the component depends on colour, typography, spacing, iconography, radius or other shared rules;
- read `components/<component>/rules.md` and `examples.html` for the component;
- use the real Buckholt classes, variables and verified markup;
- check `discrepancies/known-issues.md` when a documented value appears to disagree with runtime CSS;
- do not recreate component styling with custom CSS where Buckholt already provides it.

## Evidence discipline

If documentation and compiled CSS conflict, report the conflict rather than guessing or silently patching it. The documentation expresses intended Buckholt behaviour; the CSS expresses what the current runtime actually renders.

## Foundations

### Colour
Read `foundations/colour/` before choosing or changing colours.

### Iconography
Read `foundations/iconography/rules.md` and `foundations/iconography/catalogue.md` before choosing an icon. Use the exact Buckholt mapping when one exists.

### Radius
Read `foundations/radius/rules.md` before adding or changing border radius.

Rules:
- prefer the radius already applied by the Buckholt component;
- do not hard-code arbitrary radius values when a Buckholt variable/component rule exists;
- do not infer radius from Bootstrap defaults;
- do not treat documented `$border-radius-full` as equivalent to runtime `--border-radius-full` while the recorded discrepancy remains unresolved.

## Custom CSS

Custom CSS may be used for page/demo layout only when necessary. It must not be used to recreate or override Buckholt component styling simply to make an implementation look right.

## Runtime dependencies

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/buckholt.css">
```

For Buckholt patterns that use Bootstrap behaviour such as tooltips, also load:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
```

## Current component coverage

### Button
Read:
- `components/button/rules.md`
- `components/button/examples.html`
- relevant foundation files, especially colour, iconography and radius

The Button Usage, Style and Code & specs documentation have all been supplied.
