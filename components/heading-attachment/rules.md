# Heading attachment

## Verification

Source-verified against the Buckholt Heading attachment Usage, Style and Code & specs HTML pages supplied on 7 September 2026. `examples.html` is the canonical source for exact DOM structure.

## Purpose

Heading attachment extends Text block by placing one closely related secondary element alongside a heading. Use it for contextual actions or supporting information that belongs directly to that section.

## Canonical structure

Do not reconstruct Heading attachment markup from prose. Use the exact source examples in `examples.html`.

The Code & specs page documents `.text-block > .heading`, with `.heading-content` first and one attached element after it. Documented examples include:

- a close button;
- a Standalone Link;
- a Tag;
- eyebrow text inside `.heading-content`;
- an inline heading icon wrapped in `.icon`;
- Icon block compositions.

The exact element types, Font Awesome classes, type-set classes and child order vary by example. Preserve them exactly rather than normalising them to another component convention.

For example, one source example uses an inline heading icon inside `<h3 class="headline-02">`, while another uses `<div class="icon-block">` with a solid Sparkles icon and `<h3 class="title-03">`. The final Icon block example uses `.icon-block-xl` and its own documented icon. Do not substitute a generic Ghost icon, change `solid` to `regular`, or add `aria-hidden` to canonical source markup unless that exact example contains it.

## Relationship to Text block

Heading attachment inherits Text block's content, colour and typography rules. The attachment remains a separate documented component such as Link, close Button, Tag or Icon block.

Use one closely related attachment and keep the heading as the primary focus. Do not turn the heading row into a general toolbar.

## Spacing

`buckholt.css` provides the heading-row alignment and spacing. Do not rebuild the row with local flex or margin rules.

## Accessibility

In real product markup, preserve the accessibility requirements of the attached component. Application-level accessibility improvements must not be inserted into `examples.html` and then described as original Buckholt Code & specs markup unless the source itself contains them.

## Agent rules

- Use `examples.html` as canonical DOM evidence.
- Start from `.text-block` and preserve `.heading > .heading-content + attachment` exactly as shown by the selected source example.
- Do not change source heading levels, type-set classes, icon styles/names or wrappers in canonical examples.
- Reuse the attached Buckholt component rather than recreating it.
- Do not infer additional attachments or combinations that the source does not document.
- Do not recreate Heading attachment spacing or alignment with local CSS.
