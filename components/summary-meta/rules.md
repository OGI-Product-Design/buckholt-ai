# Summary Meta

## Verification

Source-audited against the Buckholt Summary-meta Usage, Style and Code & specs HTML pages supplied on 7 September 2026. Use `examples.html` for exact DOM structure.

## Purpose

Summary Meta presents a prominent summary made from an Icon block plus headline, label and body text. Buckholt also documents a stacked variation.

## Canonical markup

The Code & specs source in `examples.html` uses:

- outer `.summary-meta`;
- `.icon-block.icon-block-xxl.expressive-dark.expressive-primary`;
- `.summary-meta-body`;
- `.summary-meta-headline`, `.summary-meta-label` and `.summary-meta-text`;
- `.summary-meta-stacked` for the abbreviated stacked variant.

Preserve that markup exactly in canonical examples, including the literal `.expressive-primary` class shown by Code & specs.

## Documentation/runtime note

The current runtime does not require a dedicated `.expressive-primary` modifier for the primary expressive palette; primary is the default palette. This is therefore a documentation/runtime discrepancy, not permission to remove the class from the canonical source example. See `discrepancies/known-issues.md`.

## Composition

Use the Icon block and Typography/Colour foundations rather than recreating Summary Meta internals with local styling. Do not infer the omitted internals of the source's `.summary-meta-stacked` `...` example.

## Agent rules

- `examples.html` is canonical for Summary Meta DOM.
- Preserve `.expressive-primary` in the canonical source example even though runtime primary behaviour is default.
- Do not invent the contents of abbreviated source placeholders.
- Use `buckholt.css` for Summary Meta layout, colour and typography.
