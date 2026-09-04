# Buckholt AI instructions

## Purpose

Use the Buckholt design system accurately when building UI.

## Sources of truth

Use these Buckholt sources in this order:

1. `css/buckholt.css` — final runtime implementation and styling truth: selectors, states, dimensions, generated classes and dependencies.
2. `components/<component>/rules.md` — concise component guidance rebuilt from the live Buckholt documentation and runtime CSS.
3. `components/<component>/examples.html` — only markup examples that have been explicitly verified.
4. The live Buckholt component documentation URLs recorded in each component's `rules.md` when more detail is required.

Old SCSS, token maps, screenshots and previous interpreted AI specifications are **not** implementation sources for this repository unless explicitly requested for investigation. Figma may be used as a visual check, but it must not override verified runtime classes or documented markup.

## Core rule

**Build with Buckholt. Do not imitate Buckholt.**

Before implementing a Buckholt component:

- read `components/<component>/rules.md`;
- read `components/<component>/examples.html`;
- use the real Buckholt classes and verified markup documented there;
- rely on `css/buckholt.css` for visual implementation and interaction states;
- do not recreate component styling with custom CSS where Buckholt already provides it.

## Evidence discipline

A component rule may be marked unresolved when the live documentation cannot be retrieved or the exact runtime selector/markup has not been verified.

When something is unresolved:

- say what is missing;
- do not infer a class from Bootstrap conventions;
- do not invent icon markup;
- do not invent danger/destructive modifiers;
- do not silently fall back to a visually similar custom style.

It is better to leave one example out than to teach future coding agents a false Buckholt pattern.

## Custom CSS

Custom CSS may be used for page/demo layout only when necessary. It must not be used to recreate or override Buckholt component styling simply to make an implementation look right.

## Runtime dependencies

When building a standalone Buckholt page or test harness, mirror the dependency setup shown by the live Buckholt documentation.

### Bootstrap

Load Bootstrap 5.1.3 before Buckholt:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
```

### Proxima Nova / Proxima Soft

Load the Adobe Fonts stylesheet used by the live Buckholt documentation:

```html
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
```

The compiled Buckholt CSS requests `"Proxima-soft", Arial, sans-serif`.

### Font Awesome

Load the Font Awesome kit used by the live Buckholt documentation:

```html
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
```

Do not replace Font Awesome with another icon library. Do not guess individual Font Awesome class names when Buckholt's canonical markup has not been verified.

### Buckholt

Load `css/buckholt.css` after Bootstrap so Buckholt provides the final component styling.

Recommended standalone order:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/buckholt.css">
```

## Current component coverage

### Button

Read:

- `components/button/rules.md`
- `components/button/examples.html`

Verified in the current rebuild:

- base `.btn` behaviour;
- primary, secondary and ghost variants;
- small/default/large sizing;
- disabled and focus behaviour;
- button-set runtime behaviour;
- live usage, content, alignment and accessibility guidance.

The canonical danger modifier and exact icon markup remain unresolved until the live Button Code & specs page can be reliably retrieved. Do not guess them.
