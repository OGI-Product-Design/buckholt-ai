# Slider

## Verification

Source-audited against the Buckholt Slider Usage, Style and Code & specs HTML pages supplied on 7 September 2026. Use `examples.html` for exact DOM structure.

## Purpose

Slider lets users choose a value along a defined range. Buckholt documents a single-value range control with minimum/maximum labels and either a numeric input or an output treatment.

## Canonical markup

`examples.html` preserves the supplied Code & specs variations exactly. The documented structure uses `.input`, `.response.slider-input`, `.slider-container`, `.slider-wrapper`, native `input[type="range"].form-slider`, `.minmax` labels and the documented ticks/output controls.

Important source details:

- the base example includes five `.tick` elements and an `<input type="number" class="form-control" style="width: 4ch;">` output field;
- the output-only variation uses `.form-slider-output` plus `<output>`;
- helper/assistive text uses `.form-helper`;
- validation uses `.invalid-feedback`;
- disabled uses native `disabled` on both range and numeric output;
- read-only uses `.readonly` + `disabled` on the range and `readonly` on the numeric field.

Do not invent the two-handle/range-selection variant; it is not established by the supplied canonical Code & specs source.

## Behaviour and accessibility

Keep the native range control and real min/max/step values. Product code must keep any numeric/output value synchronized with the Slider. Do not fabricate constraints that are not part of the product requirement.

## Agent rules

- `examples.html` is canonical for Slider DOM.
- Preserve `.slider-container`, `.slider-wrapper`, `.form-slider`, `.ticks`, `.minmax` and the documented output form.
- Preserve disabled/read-only structure exactly where used.
- Do not create a two-handle Slider or custom range styling and call it Buckholt.
- Let `buckholt.css` provide Slider appearance and states.
