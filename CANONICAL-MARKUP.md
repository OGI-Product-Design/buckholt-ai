# Canonical markup policy

This repository exists to let coding agents reproduce Buckholt accurately. Canonical markup must therefore be evidence-preserving, not reconstructed or improved by an agent.

## Hard rule

**When Buckholt documentation provides a Code & specs HTML example for a component or variation, that documented HTML structure is the canonical source. Preserve it structurally.**

Do not add, remove, rename, wrap, normalise or substitute elements/classes merely because another Buckholt component uses a similar convention.

Examples of changes that are **not allowed** in canonical examples unless Buckholt itself documents them:

- inserting `<span class="icon">` around an icon that Buckholt places directly in a link;
- replacing a documented `<div class="btn-icon">` with another icon wrapper;
- adding a semantic wrapper such as `<nav>` when the documented component example starts at `<ul>`;
- adding `aria-current`, roles, helper wrappers or extra classes that are sensible in production but absent from the documented canonical example;
- replacing a documented icon because it is absent from the shared icon catalogue;
- changing documented placeholder labels, structure or element order to make an example look more realistic;
- borrowing markup from Link, Button, Tag, Text block or another component to fill a gap in a different component.

## Evidence order for markup

For exact component markup use this order:

1. Buckholt **Code & specs** example for that exact component/variation.
2. Other Buckholt documentation for that exact component when Code & specs does not cover the variation.
3. Current `css/buckholt.css` only to verify selectors/runtime behaviour, not to invent missing DOM structure.
4. If no exact markup evidence exists, **report the gap**. Do not create a plausible canonical example.

A generic foundation or another component never overrides exact component-specific Code & specs markup.

## `examples.html`

`components/<component>/examples.html` must contain only examples that are directly supported by Buckholt documentation.

When an exact Code & specs example exists, keep the documented DOM hierarchy, class placement, element order and icon placement. Formatting/indentation may be cleaned up for readability, but the structure must not change.

If an application implementation needs additional accessibility attributes, real URLs, IDs, labels or framework integration, those may be added by the consuming application. They must not be silently written back into the repository as though Buckholt documented them.

## `rules.md`

`rules.md` may explain usage, accessibility and implementation considerations, but prose must distinguish:

- **documented canonical markup**;
- **documented usage/accessibility guidance**;
- **runtime implementation evidence**;
- **application-level additions**.

Do not describe an inferred structure as canonical.

## Icons

Icon markup is component-specific.

If the component documentation says an icon goes directly inside an element, preserve that structure even if another Buckholt component uses `.icon`, `.btn-icon`, `.input-icon` or another wrapper.

The shared Iconography catalogue helps choose documented icons. It does **not** authorise rewriting component-specific icon markup or rejecting an icon explicitly shown in that component's Code & specs example.

## Verification requirement

Before declaring a newly ingested component complete:

1. compare every variation in `examples.html` against its Buckholt source;
2. verify wrappers, classes, element types, order, attributes and icon placement;
3. check `rules.md` does not introduce unsupported canonical structure;
4. only then call the example canonical.

If this comparison has not been performed, say that the component still requires source-parity verification rather than presenting it as fully verified.