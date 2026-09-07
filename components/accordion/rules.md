# Accordion

## Verification

Source-verified against the Buckholt Accordion Usage, Style and Code & specs HTML pages supplied on 7 September 2026. `examples.html` is the canonical source for exact Accordion DOM structure.

## Purpose

Accordion is a vertical group of headers that expand and collapse to reveal related content. Use it to reduce visual density while keeping several related sections available in the same view.

## Usage

- Default Accordions should load collapsed so users can scan available sections.
- Medium/default is appropriate for grouped Accordions.
- Large Accordions are for single, standalone collapsible cards rather than repeated groups.
- Multiple items may remain open by default.
- Use the documented `data-bs-parent` form when only one item should remain open at a time.

## Canonical markup

Do not reconstruct Accordion markup from this prose. Use the exact Code & specs examples in `examples.html`.

The source documents:

- a default `.accordion` containing multiple `.accordion-item` elements;
- a large variant represented as `<div class="accordion accordion-lg">...</div>`;
- a single-open variant where each `.accordion-collapse` has `data-bs-parent="#accordionSingleExpand"`.

Preserve the source's `button.accordion-button`, `data-bs-toggle="collapse"`, `data-bs-target`, `aria-expanded`, `aria-controls`, matching collapse `id`, `.accordion-body` and nested `.text-block` structure.

Do not replace source `...` placeholders in the large variant with inferred markup inside the canonical example.

## Initial state

The supplied Code & specs examples are collapsed initially. If a real product requirement needs an item initially open, use Bootstrap's actual Collapse state consistently (`.show`, `aria-expanded="true"`, and the appropriate button state), but do not rewrite the canonical source examples to demonstrate an undocumented variant.

## Size

Buckholt documents:

- default/medium — `.accordion`
- large — `.accordion.accordion-lg`

Use `.accordion-lg` only for the documented large standalone treatment.

## Behaviour and accessibility

Accordion uses Bootstrap Collapse behaviour. Keep IDs unique and all target/ARIA relationships aligned. Preserve keyboard-operable native Buttons and visible focus treatment. Reuse Buckholt components inside `.accordion-body`.

## Agent rules

- Use `examples.html` as canonical DOM evidence.
- Preserve the exact default, large-placeholder and single-open source examples.
- Do not invent an expanded-by-default canonical example merely because Bootstrap supports it.
- Use `.accordion-lg` only for the documented large treatment.
- Use `data-bs-parent` only for the documented one-open-at-a-time pattern.
- Do not recreate Accordion spacing, states, disclosure icon or animation with local CSS/JS.
