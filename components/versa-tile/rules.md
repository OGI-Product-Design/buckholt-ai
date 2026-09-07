# Versa-tile

## Verification

Source-audited against the Buckholt Versa-tile Usage, Style and Code & specs HTML pages supplied on 7 September 2026. Use `examples.html` for exact DOM structure.

## Purpose

Versa-tile is a flexible compact content container for a label/body summary, with optional Icon block, actions and progress composition.

## Canonical markup

`examples.html` preserves the exact Code & specs structures. The source establishes:

- `.versatile > .versatile-content`;
- `.versatile-body` containing `.versatile-meta`;
- `.versatile-label` and `.versatile-text`;
- optional `.icon-block` before metadata;
- optional `.versatile-actions` containing a `.button-set` placeholder;
- a documented Progress-bar composition after `.versatile-content`.

Do not remove `.versatile-text`; it is explicitly present in the supplied rendered Code & specs source. Do not invent the internals of the source's `...` Button-set placeholders.

## Actions and progress

Actions use real Buckholt Button/Button-set guidance. The Progress example uses the documented `.progress.progress-sm` structure and keeps it as a sibling after `.versatile-content`.

The compatibility stylesheet contains the verified `flex-shrink: 0` correction for `.versatile-actions`; do not duplicate that fix in local page CSS.

## Agent rules

- `examples.html` is canonical for Versa-tile DOM.
- Preserve `.versatile-content`, `.versatile-body`, `.versatile-meta`, `.versatile-label`, `.versatile-text` and `.versatile-actions` as documented.
- Do not fill abbreviated Button-set content by inference.
- Reuse Icon block, Button set and Progress rather than recreating them inside Versa-tile.
- Let `buckholt.css` and the verified compatibility stylesheet provide layout/styling.
