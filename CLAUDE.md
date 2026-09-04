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

### Proxima Nova

Load the approved Adobe Fonts stylesheet in the document head:

```html
<link rel="stylesheet" href="https://use.typekit.net/aio4aoz.css">
```

Use the font family exposed by that stylesheet together with the font-family expected by `css/buckholt.css`. Do not download, commit or substitute font binaries unless explicitly instructed.

Additional icon/runtime dependencies will be documented when supplied.
