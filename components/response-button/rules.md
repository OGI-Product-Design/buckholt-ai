# Response button

## Verification

Source-audited against the Buckholt Response button Usage, Style and Code & specs HTML pages supplied on 7 September 2026. Use `examples.html` for exact DOM structure.

## Purpose

Response buttons present a small set of prominent predefined answers. Buckholt documents native Radio inputs for single selection and native Checkbox inputs for multiple selection.

## Canonical markup

Do not reconstruct Response button markup from prose. `examples.html` preserves the documented variations, including:

- `.input > .input-label + .response.response-btn-input`;
- hidden native `.btn-check` inputs paired with `<label class="btn btn-response">`;
- Radio inputs with a shared `name` for single-select groups;
- Checkbox inputs for multi-select groups;
- `.btn-response-lg` for the documented large/icon treatment;
- `.icon` directly inside the response label where the source shows an icon;
- assistive/helper text and `.invalid-feedback` variations;
- native `disabled` examples;
- the documented read-only example, which places `.readonly` on one `.btn-response` label while its native Radio is disabled;
- `.response-btn-equal` as an abbreviated documented variant.

Do not replace the source Radio/Checkbox relationship with ordinary action Buttons.

## Usage

Use Response buttons when the answer set is small, clear and benefits from being immediately visible. Use ordinary Radio/Checkbox controls when the response set is larger or does not need this emphasis.

## States and accessibility

Selection remains backed by the native form control. Keep every label `for` paired with its input ID and preserve the group's real single/multi-select semantics. Validation and disabled/read-only treatment must follow the documented source rather than visual-only state classes invented locally.

## Agent rules

- `examples.html` is canonical for Response button DOM.
- Use Radio for documented single-select and Checkbox for documented multi-select.
- Preserve `.btn-check`, `.btn.btn-response`, `.btn-response-lg`, `.readonly`, `.icon` and `.response-btn-equal` only where the source shows them.
- Do not turn Response buttons into action Buttons or recreate their selection styling with custom CSS.
