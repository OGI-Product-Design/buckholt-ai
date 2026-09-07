# Number input

## Verification

Source-audited against the Buckholt Number input Usage, Style and Code & specs HTML pages supplied on 7 September 2026. Use `examples.html` for exact DOM structure.

## Purpose

Use Number input when users need to enter or adjust a numeric value with increment/decrement controls.

## Canonical markup

The supplied Code & specs source uses `.response.num-input` containing:

- an `<input type="text" class="form-control">`;
- `.input-btn.step-btn.step-add` with `fa-regular fa-plus`;
- `.input-btn.step-btn.step-minus` with `fa-regular fa-minus`.

Preserve that exact source in canonical examples. Do **not** change the documented text input to `type="number"`, add a default value, or add attributes such as `aria-label` that are not present in Code & specs.

`examples.html` also documents assistive/helper text, an optional `.input-icon`, validation feedback, disabled and read-only examples.

## Supporting text and states

Assistive text uses `.form-helper` inside `.input-label`; helper text follows the response. Validation uses `.invalid-feedback` as shown by Code & specs.

Disabled is documented with `disabled` on the input. Read-only is documented with `readonly` on the input. Do not invent additional state classes or attributes in canonical markup.

## JavaScript dependency

The supplied `components/form/form.js` contains the Number input step-button behaviour: plus/minus change the current value by 1, an empty field is first treated as `0`, and the script emits `change` after updating the value.

Load the supplied Form script when this documented enhancement is required rather than recreating a different Buckholt stepper API.

## Agent rules

- `examples.html` is canonical for Number input DOM.
- Preserve the documented `<input type="text">` and exact step-button classes/icons.
- Do not add invented accessibility/state attributes to canonical examples; production implementations may add required accessible names without rewriting Buckholt source evidence.
- Reuse `.input-icon`, `.form-helper`, `.invalid-feedback`, `disabled` and `readonly` only as documented.
- Use the supplied Form JavaScript for the documented step behaviour.
- Do not recreate Number input styling with local CSS.
