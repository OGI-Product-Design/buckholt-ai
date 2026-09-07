# Icon block

## Verification

Source-verified against the Buckholt Icon block Usage, Style and Code & specs HTML pages supplied on 7 September 2026. `examples.html` is the canonical source for exact Icon block DOM structure.

## Purpose

Icon block is a prominent contained icon used alongside content to draw attention and reinforce context, tone or categorisation.

Use it where a visual cue genuinely helps. Avoid repeated decorative use where the content is already clear or the icon would add clutter.

## Canonical markup

Do not reconstruct Icon block markup from prose. Use `examples.html` exactly.

The base source example is:

```html
<div class="icon-block">
    <i class="fa-regular fa-ghost"></i>
</div>
```

The Code & specs source does not add `aria-hidden="true"` to these canonical examples. Real product implementations should apply the appropriate accessibility treatment according to whether the icon is decorative or meaningful, but do not alter the canonical source markup and then describe it as verbatim Buckholt documentation.

## Sizes

Buckholt documents:

- `.icon-block-xs`
- `.icon-block-sm`
- default/medium with no modifier
- `.icon-block-lg`
- `.icon-block-xl`
- `.icon-block-xxl`

The exact source examples use different demonstration icons for each size. Preserve those Font Awesome style/name combinations in `examples.html`; do not normalise them to a preferred catalogue icon.

## Expressive colours

Buckholt documents `.expressive-light` and `.expressive-dark`. Primary is the default expressive palette. Other palette modifiers are:

- `.expressive-secondary`
- `.expressive-tertiary`
- `.expressive-quaternary`

Use the exact combinations shown in `examples.html` for canonical source evidence.

## Icon choice in product implementation

For real product UI, use `foundations/iconography/` to choose the documented Buckholt icon mapping when one exists. That implementation guidance must not rewrite demonstration icons explicitly present in the Icon block Code & specs examples.

## Composition

When Icon block is used within another component such as Text block or Heading attachment, follow that component's exact composition source as well. Do not infer wrapper, alignment or spacing changes locally.

## Accessibility

An Icon block should not be the sole carrier of essential meaning. In actual product markup, decorative/supporting icons should be hidden from assistive technology where appropriate and meaningful icons should have suitable accessible context. Keep those application semantics separate from the immutable canonical Code & specs examples.

## Agent rules

- Use `examples.html` as canonical DOM evidence.
- Use `.icon-block` plus only documented size and expressive modifiers.
- Preserve exact source icon classes in canonical examples.
- Do not add `aria-hidden`, replace icons, change Font Awesome style, or otherwise 'improve' canonical source markup unless the source contains that change.
- Use the Iconography foundation for real product icon choice, not for rewriting source examples.
- Do not recreate Icon block dimensions, radius, colours or alignment with local CSS.
