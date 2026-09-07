# Select

## Verification

Source-audited against the Buckholt Select Usage, Style and Code & specs HTML pages supplied on 7 September 2026. Use `examples.html` for exact DOM structure.

## Purpose

Select uses a native `<select>` for choosing one option from a predefined list. Use it when native browser selection behaviour is suitable; use Dropdown only when the documented richer Dropdown behaviours are required.

## Canonical markup

`examples.html` preserves the documented base, helper, validation, disabled and read-only examples exactly.

The structure uses `.input`, `.input-label`, `.response.select-input` and `select.form-select`.

Important source details:

- the base example includes a selected disabled placeholder option;
- helper/assistive content uses `.form-helper`;
- validation uses `.invalid-feedback`;
- disabled uses native `disabled` on the `<select>`;
- read-only uses `class="form-select readonly"` **and** native `disabled`, because `<select>` has no native `readonly` attribute.

Do not convert this component into a custom Dropdown or invent a separate read-only control.

## Accessibility

Keep a real associated `<label>` and native Select semantics. Production IDs must be unique and correctly paired with their labels.

## Agent rules

- `examples.html` is canonical for Select DOM.
- Use a native `<select class="form-select">` inside `.response.select-input`.
- Preserve `.readonly` plus `disabled` for the documented read-only treatment.
- Do not recreate the Select arrow, border, states or spacing with custom CSS.
