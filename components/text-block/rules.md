# Text block

## Verification

Source-audited against the Buckholt Text block Usage, Style and Code & specs HTML pages supplied on 7 September 2026. Use `examples.html` for exact DOM structure.

## Purpose

Text block groups headings and supporting written content using Buckholt's documented typography and optional heading treatments.

## Canonical markup

`examples.html` preserves the Code & specs examples for:

- heading + paragraphs;
- Display, Headline and Title type sets;
- eyebrow text before a heading;
- an inline heading icon using `<span class="icon">`;
- Icon block above a Title heading;
- `.icon-block-xl` above a Headline heading.

The Code & specs examples deliberately demonstrate specific semantic heading elements together with visual type classes. Preserve those exact examples canonically. In a real page, choose the semantic heading level from page hierarchy while using the appropriate documented Buckholt type-set class for appearance.

## Composition rules

Use the documented Eyebrow, inline-icon or Icon-block treatment only where the Text block guidance supports it. Do not combine these treatments arbitrarily or reconstruct their spacing with local CSS.

When using Icon block, follow the Icon block component's own source markup as well.

## Agent rules

- `examples.html` is canonical for Text block DOM examples.
- Keep semantic heading hierarchy separate from visual type-set choice in production.
- Preserve `.eyebrow`, `.icon` and Icon-block placement exactly where documented.
- Use Buckholt Typography rather than Bootstrap font-size/heading utilities.
- Do not recreate Text block spacing or heading treatments with custom CSS.
