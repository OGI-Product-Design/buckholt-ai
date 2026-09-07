# Radio

## Verification

Source-audited against the Buckholt Radio Usage, Style and Code & specs HTML pages supplied on 7 September 2026. Use `examples.html` for exact DOM structure.

## Purpose

Use Radio for a defined set of mutually exclusive choices where the user selects one option.

## Canonical markup

`examples.html` preserves the documented single Radio, grouped Radio input, helper-text, validation, disabled, disabled-group and read-only examples exactly as supplied.

Important source details:

- the base control uses `.form-check`, `.form-check-input` and `.form-check-label`;
- grouped Radios use `.input > .input-label + .response.check-input`;
- options in a documented group share the same `name`;
- validation uses `required` and `.invalid-feedback`;
- disabled controls use native `disabled`, and the full disabled-group example also adds `.disabled` to the outer `.input`;
- the read-only example places a literal `readonly` attribute on the Radio input.

The supplied Code & specs disabled-group example contains a mismatched input `id` / label `for` value. That source typo is deliberately preserved in `examples.html`; production markup must use correctly matched ID/label relationships.

## Read-only behaviour

HTML does not natively enforce `readonly` on Radio inputs. Buckholt's supplied `components/form/form.js` prevents changes for the documented read-only treatment while leaving the control focusable.

Do not replace the documented source attribute with a different canonical state class.

## Accessibility

Production Radios must retain native inputs, associated labels and a shared `name` for each mutually exclusive set. Do not communicate state through colour alone.

## Agent rules

- `examples.html` is canonical for Radio DOM.
- Preserve the exact source structures and attributes, including the documented `readonly` form.
- Do not silently correct source typos inside canonical examples; fix relationships in consuming production markup.
- Use the supplied Form JavaScript for Buckholt read-only behaviour.
- Do not recreate Radio styling or state behaviour with custom CSS.
