# Buckholt documentation/runtime notes

The Buckholt documentation website is the primary source of truth for intended Digital Product design-system behaviour.

`css/buckholt.css` is the current runtime implementation. It may also contain additional helpers or values added while Buckholt was used to build the company website. Those additions can provide useful flexibility, but they should not automatically be promoted to canonical Buckholt guidance.

Only record an issue here when a runtime difference is likely to mislead an agent implementing documented Buckholt behaviour.

## Radius runtime extensions

The Radius documentation defines the intended documented scale through `full` at `2rem` / `32px`.

The runtime CSS additionally exposes:

```css
--border-radius-xxl: 2rem;
--border-radius-full: 625rem;
--border-radius-round: 50%;
```

Treat these as runtime extensions unless and until the documentation explicitly adopts them. Do not block implementation merely because they exist.

For normal Buckholt design decisions, follow the documented Radius scale. A component may still use an additional runtime radius if its own documented/runtime implementation requires it.

## Link visited icon colour

The Link Style documentation defines the visited state for both link text and icon as **Expressive secondary deep (`#5731d6`)**.

The current compiled runtime instead contains:

```css
a.link-standalone:visited .icon {
  color: #1748D0;
}
```

This means a visited standalone link can render its icon in Text active blue while its text follows the documented visited colour.

For design intent, treat `#5731d6` as canonical because it is the documented Link state. Do not create local one-off overrides in generated product UI merely to compensate; the underlying runtime should be corrected deliberately if the team chooses to align implementation with the documentation.
