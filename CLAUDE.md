# Buckholt AI instructions

## Purpose

Use the Buckholt design system accurately when building UI.

## Sources of truth

Only use the following Buckholt sources unless explicitly told otherwise:

1. `css/buckholt.css` — implementation and styling truth. Use its real selectors, states and behaviour.
2. The Buckholt documentation extracted into `components/<component>/` — canonical HTML, usage rules, accessibility guidance, variants, icon markup and implementation notes.

Do not use or infer from old SCSS, token maps, previous AI specifications, screenshots, Figma, Bootstrap defaults or remembered Buckholt behaviour unless explicitly asked.

## Core rule

**Build with Buckholt. Do not imitate Buckholt.**

Before implementing a Buckholt component:

- read `components/<component>/rules.md`;
- read `components/<component>/examples.html`;
- use the existing classes and markup documented there;
- rely on `css/buckholt.css` for the visual implementation;
- do not recreate component styling with custom CSS where Buckholt already provides it.

## Missing information

If the documentation or CSS does not support something, say that the information is missing. Do not invent a Buckholt class, variant, state, accessibility rule, token or HTML pattern.

## Custom CSS

Custom CSS may be used for page/demo layout only when necessary. It must not be used to recreate or override Buckholt component styling simply to make an implementation look right.

## Runtime dependencies

When building a standalone Buckholt page or test harness, mirror the dependency setup shown by the live Buckholt documentation.

### Bootstrap

Load Bootstrap 5.1.3 before Buckholt:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
```

### Proxima Nova

Load the Adobe Fonts stylesheet used by the live Buckholt documentation:

```html
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
```

### Font Awesome

Load the Font Awesome kit used by the live Buckholt documentation:

```html
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
```

Do not replace Font Awesome with another icon library.

### Buckholt

Load `css/buckholt.css` after Bootstrap so Buckholt provides the final component styling.

Recommended standalone order:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/buckholt.css">
```
