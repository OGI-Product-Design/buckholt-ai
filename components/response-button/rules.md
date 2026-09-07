# Response button

## Purpose

Response buttons let users quickly choose from a small set of predefined responses. Buckholt supports both single-select and multi-select variants.

Use them when the available options are short, predictable and easy to scan. Do not use Response buttons when there are too many options, the choices need long descriptions/complex inputs, or users need to enter a custom value.

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

Use native form controls and matching labels. `.response-btn-input` identifies the response type and `.btn-response` provides the Buckholt response-button treatment.

## Single select

Single select is the default. Use `type="radio"` and give all options in the same set the same `name` so only one can be selected.

## Multi select

For the documented multi-select variant, change each input from `radio` to `checkbox`. The surrounding `.response.response-btn-input` and `.btn.btn-response` label structure stays the same.

```html
<div class="response response-btn-input">
  <input type="checkbox" class="btn-check" id="multi-response-1">
  <label class="btn btn-response" for="multi-response-1">Response 1</label>

  <input type="checkbox" class="btn-check" id="multi-response-2">
  <label class="btn btn-response" for="multi-response-2">Response 2</label>
</div>
```

Do not use ordinary action Buttons to fake selection state.

## Sizes and icons

The default response button is the standard size. Buckholt also documents a large treatment using `.btn-response-lg`. Icons may be included using the normal Buckholt icon wrapper and documented Font Awesome mapping.

Keep labels concise and predictable. Buckholt recommends single words where possible and generally no more than three words. Labels use sentence case. If labels become too long, consider a Select instead.

## States and validation

Buckholt documents resting, hover, focus, active/selected, disabled, read-only and error treatments. Validation happens on form submission; a validation message replaces helper text when the error is active.

Disabled/read-only Response buttons do not need assistive/helper text because users cannot modify the value; necessary context should come from labels or surrounding content.

## Agent rules

- Use `.input` with `.response.response-btn-input`.
- Use native radio controls for single selection.
- Use native checkbox controls for the documented multi-select variant.
- Pair every input with a `.btn.btn-response` label using matching `id`/`for`.
- Use `.btn-response-lg` only for the documented large treatment.
- Keep labels short and sentence case; consider Select when choices are numerous or labels become unwieldy.
- Do not recreate selected/focus/error styles in local CSS.
- Reuse Form validation guidance and Iconography when composed.