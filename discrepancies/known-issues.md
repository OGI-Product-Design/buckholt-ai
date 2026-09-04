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
