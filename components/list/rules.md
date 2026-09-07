# List

## Verification

Source-verified against the Buckholt List Usage, Style and Code & specs HTML pages supplied on 7 September 2026. `examples.html` is the canonical source for exact List DOM structure.

## Purpose

List presents related content in a clear, scannable sequence. Use an unordered list when order does not matter and an ordered list when sequence or ranking matters.

Do not use List for complex data requiring sorting, filtering or structured comparison; use the appropriate Table/data pattern instead.

## Canonical markup

Do not reconstruct List examples from prose. Use `examples.html` exactly.

The Code & specs source documents:

- base unordered `.list` with `.list-item` children;
- ordered `.list`, represented with a `...` placeholder in the base ordered example;
- nested unordered and ordered lists;
- `.list-heading` shown as a standalone `<li>` snippet with `value="0"`;
- `.list.list-unstyled` represented with `...`;
- an icon-list example using `.list-icon` and Font Awesome icons.

Preserve those source placeholders. Do not expand the ordered base list, unstyled list or other omitted content into invented canonical examples.

## Nested lists

The source nested examples place the Level 2 `<ul>` or `<ol>` directly inside the parent `.list-item`. Use those exact structures from `examples.html`.

Usage/Style guidance documents distinct markers for nesting levels. Let `buckholt.css` provide markers, indentation and spacing.

## List heading

The Code & specs snippet is:

```html
<li class="list-heading" value="0">List heading</li>
```

This is source evidence for the heading item itself, not a complete reconstructed list. When composing it into an ordered List, preserve the documented semantics and numbering behavior without altering `examples.html`.

## Icons

The Code & specs source places `.list-icon` before item text and uses the exact demonstrated success/error classes and icons. Preserve those icon classes in canonical examples; do not add `aria-hidden` or replace icons there unless the source contains it.

In actual product markup, apply appropriate accessibility semantics so icon/colour are not the only carriers of meaning.

## Agent rules

- Use `examples.html` as canonical DOM evidence.
- Use semantic `<ul>`/`<ol>` and `.list-item` as documented.
- Preserve exact nested-list structure.
- Keep source `...` placeholders rather than filling them by inference.
- Treat the `.list-heading` Code & specs block as the exact snippet supplied, not permission to invent surrounding list markup.
- Preserve exact source icon wrappers/classes in canonical examples.
- Do not recreate markers, indentation, spacing or icon layout with local CSS.
