# Claude instructions for Buckholt AI

This repository is the machine-readable companion to the Buckholt design system.

## Primary rule

**Build with Buckholt; do not imitate Buckholt.**

Where Buckholt already provides a class, token or component, use it rather than recreating the same visual treatment with custom CSS.

## Read order

Before implementing Buckholt UI, read:

1. `design.md` for foundation and usage guidance.
2. The relevant file in `components/`, for example `components/button.md`.
3. `tokens.json` when exact token facts are required.
4. `css/buckholt.css` to confirm the final browser-facing implementation.

## Source roles

- SCSS source explains architecture and intent.
- `css/buckholt.css` is the final runtime implementation truth.
- Buckholt documentation explains intended usage and accessibility.
- Figma is visual truth.
- The markdown/JSON files in this repository are the reconciled AI-facing interpretation.

If sources conflict or a rule is missing, flag the gap instead of guessing.

## Implementation rules

- Load `css/buckholt.css` in Buckholt test/prototype pages.
- Prefer existing Buckholt classes and CSS custom properties.
- Do not invent spacing, colour, radius, type or focus values when Buckholt already defines them.
- Do not replace semantic tokens with arbitrary raw colours.
- Do not recreate Buckholt components with one-off CSS simply to match a screenshot.
- Preserve native semantics and accessibility states.
- Do not use Bootstrap defaults as substitutes where Buckholt overrides them.

## Typography and icons

Buckholt expects `"Proxima-soft", Arial, sans-serif`.

If Proxima Soft is not available locally, report that the visual result is using the Arial fallback; do not silently substitute another font.

Buckholt uses Font Awesome through both embedded SVG data and font-based glyphs. If a font-based icon cannot render because Font Awesome is not loaded, report the missing dependency rather than swapping to another icon library.

## Current component coverage

Button is the first component family with an AI-facing contract. Read `components/button.md` before implementing buttons.

## Validation rule

For the current test phase, avoid adding custom CSS to “fix” visual mismatches until you have checked whether the mismatch comes from:

1. missing Proxima Soft;
2. missing Font Awesome;
3. incorrect Buckholt class usage;
4. a gap or error in the shared Buckholt specification.

If the shared specification is wrong, identify the rule that needs correcting rather than masking it in the test page.
