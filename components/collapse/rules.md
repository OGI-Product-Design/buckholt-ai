# Collapse

## Verification

Source-verified against the Buckholt Collapse Usage, Style and Code & specs HTML pages supplied on 7 September 2026. `examples.html` is the canonical source for exact Collapse DOM structure.

## Purpose

Collapse lets users show or hide additional content on the same page without navigating away. Use it for a single disclosure where secondary detail can remain hidden until needed. Use Accordion when several related sections form a coordinated expandable set.

## Canonical markup

Do not reconstruct Collapse markup from prose. Copy the relevant structure from `examples.html` exactly.

The base Code & specs example uses:

```text
.collapse-item
├─ a.collapse-trigger
└─ .collapse-card.collapse
   └─ .collapse-content
      └─ .text-block
         ├─ h6.collapse-title
         └─ p
```

The trigger uses `data-bs-toggle="collapse"`, `href`, `role="button"`, `aria-expanded` and `aria-controls`. Its target must match the `id` on `.collapse-card`.

## Close-button variation

Buckholt documents a separate close-button variation. In that variation `.btn-close` is a sibling of `.collapse-content` inside `.collapse-card` and toggles the same target.

Use the exact close-button structure in `examples.html`; do not add the close button to the base example by default.

## Context-bar variation

Buckholt also documents a Context bar variation. The source example contains `.collapse-contextbar` inside `.collapse-content` and composes the documented List and Standalone Link markup within it.

Do not treat Context bar content as mandatory Collapse structure.

## Initial state and Bootstrap dependency

Collapse uses Bootstrap 5.1.3 Collapse behaviour. The normal source example is collapsed initially (`aria-expanded="false"`, no `.show`). The Context bar demonstration source is shown open with `aria-expanded="true"` and `.show`.

Load the Bootstrap bundle where Collapse behaviour is required. Do not replace it with bespoke visibility JavaScript.

## Content and accessibility

- Keep trigger labels meaningful and closely related to the revealed content.
- Keep `href`, `aria-controls` and the target `id` aligned.
- Preserve keyboard-operable trigger semantics and visible focus behaviour.
- Reuse Buckholt components inside `.collapse-content` rather than recreating their styling.

## Agent rules

- Use `examples.html` as canonical DOM evidence.
- Use `.collapse-item`, `.collapse-trigger`, `.collapse-card.collapse` and `.collapse-content` exactly where documented.
- Do not merge the base, Close button and Context bar variations into one invented canonical example.
- Use Bootstrap Collapse behaviour and matching unique IDs.
- Do not recreate Collapse spacing, card styling, transitions or close treatment with local CSS.
