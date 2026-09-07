# Text area

## Verification

Source-audited against the Buckholt Text area Usage, Style and Code & specs HTML pages supplied on 7 September 2026. Use `examples.html` for exact DOM structure.

## Purpose

Text area captures longer free-form text that needs more space than a single-line Text input.

## Canonical markup

`examples.html` preserves the documented base, helper, counter, validation, disabled and read-only variations.

The source uses `.input`, `.input-label`, `.response.textarea-input` and native `<textarea class="form-control">`. The counter variation places:

```text
.response.textarea-input
├─ textarea.form-control
└─ .counter
   └─ .counting
```

Do not move the counter outside the response or invent another counter wrapper.

## Supporting text and states

Assistive/helper text uses `.form-helper`; validation uses `.invalid-feedback`; disabled and read-only use native `disabled` / `readonly` on the `<textarea>` exactly as shown.

## JavaScript

The supplied `components/form/form.js` contains the documented character-count behaviour for `.counter .counting`. Use that shared script when a counter is present rather than creating a Text-area-specific replacement.

## Agent rules

- `examples.html` is canonical for Text area DOM.
- Preserve `.response.textarea-input` and `.counter > .counting` exactly where documented.
- Use native `maxlength`, `disabled` and `readonly` attributes as shown by source.
- Use the shared Form script for character counting.
- Do not recreate Text area styling or counter behaviour locally.
