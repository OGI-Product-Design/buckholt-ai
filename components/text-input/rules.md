# Text input

## Verification

Source-audited against the Buckholt Text input Usage, Style and Code & specs HTML pages supplied on 7 September 2026. Use `examples.html` for exact DOM structure.

## Purpose

Text input captures a single line of free-form text. Use it for short values where a dedicated specialised control is not more appropriate.

## Canonical markup

`examples.html` preserves the documented base, helper, icon, required-label, action-button, clear-button, validation, disabled and read-only variations.

Important source details:

- base structure is `.input > .input-label + .response.text-input` with `input.form-control`;
- `.input-icon` sits directly in `.response.text-input` before the input where documented;
- the required example writes `<small>(required)</small>` inside the label;
- an inline action uses `<button class="input-btn">` with the documented icon;
- clear uses `.input-btn.input-clear` with `aria-label="Clear"`;
- validation uses native `required`, helper text and `.invalid-feedback`;
- disabled/read-only use native `disabled` / `readonly` on the input.

Do not replace `.input-icon` or `.input-btn` with Button/Link wrappers from other components.

## JavaScript

The supplied `components/form/form.js` contains the documented clear-button behaviour. Load that shared script when using `.input-clear` rather than inventing another Buckholt clear-control API.

## Accessibility

Keep real labels and correctly paired IDs in production. Placeholder text is supplementary and should not replace a visible label.

## Agent rules

- `examples.html` is canonical for Text input DOM.
- Preserve `.input-icon`, `.input-btn`, `.input-clear`, helper/validation and state attributes exactly where documented.
- Use the shared Form script for documented clear behaviour.
- Do not recreate Text input styling or action-button behaviour with local CSS.
