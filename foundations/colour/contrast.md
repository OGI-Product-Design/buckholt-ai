# Buckholt colour contrast

## Source

Buckholt Colour contrast documentation:
`https://buck.88mph.design/styles/colour/colour-contrast/`

## Minimum ratios

Buckholt's colour guidance references WCAG contrast targets:

- text below 24px: minimum **4.5:1**;
- large text at 24px and above: minimum **3:1**;
- visual elements such as icons and charts: minimum **3:1**.

The dedicated contrast page tests each palette colour against a minimum 4.5:1 pairing.

## How to read Buckholt's contrast grids

The documentation describes two rows:

- **Top row** — the colour is paired with Buckholt Black or White, whichever provides sufficient contrast.
- **Bottom row** — the colour is paired with the closest colour in the Buckholt palette that still passes the accessibility check.

If no palette pairing meets the standard, the documentation marks the result as failed.

## Implementation guidance

- Do not assume neighbouring tonal steps have sufficient contrast.
- Do not use colour alone to communicate status or meaning.
- Text, icons and important graphical information must meet the appropriate contrast target for their use.
- Prefer documented semantic/component colour combinations. Those combinations exist to preserve both hierarchy and accessibility.
- When creating a new combination not already covered by a Buckholt component, validate contrast rather than choosing by appearance.

## Palette step guidance

The colour overview also documents that required tonal separation varies according to the contrast target. Do not convert this into a universal 'N steps apart' rule across every hue; use the documented contrast tables or calculate the actual ratio for the pair in question.
