# Response button

## Purpose

Response buttons let users quickly choose from a small set of predefined responses. The default pattern is single select.

## Canonical structure

```html
<div class="input">
  <div class="input-label">
    <label class="form-label">Response button input label</label>
    <small class="form-helper">Assistive text</small>
  </div>

  <div class="response response-btn-input">
    <input type="radio" class="btn-check" name="response" id="response-1" autocomplete="off">
    <label class="btn btn-response" for="response-1">Response 1</label>

    <input type="radio" class="btn-check" name="response" id="response-2" autocomplete="off">
    <label class="btn btn-response" for="response-2">Response 2</label>
  </div>

  <small class="form-helper">Helper text</small>
  <div class="invalid-feedback">Validation message</div>
</div>
```

Use native form controls and matching labels. The `.response-btn-input` class identifies the response type and `.btn-response` provides the Buckholt response-button treatment.

## Selection

Use radio inputs for the documented default single-select pattern. All options in one single-select set must share a `name` so only one can be selected.

Do not use ordinary action Buttons to fake selection state.

## Sizes and icons

The default response button is the standard size. Buckholt also documents a large treatment using `.btn-response-lg`. Icons may be included using the normal Buckholt icon wrapper and documented Font Awesome mapping.

## States and validation

Buckholt documents resting, hover, focus, active/selected, disabled, read-only and error treatments. Validation happens on form submission; a validation message replaces helper text when the error is active.

Disabled/read-only Response buttons do not need assistive/helper text because users cannot modify the value; necessary context should come from labels or surrounding content.

## Agent rules

- Use `.input` with `.response.response-btn-input`.
- Use native radio controls for single selection.
- Pair every input with a `.btn.btn-response` label using matching `id`/`for`.
- Use `.btn-response-lg` only for the documented large treatment.
- Keep option labels concise and mutually exclusive for radio sets.
- Do not recreate selected/focus/error styles in local CSS.
- Reuse Form validation guidance and Iconography when composed.