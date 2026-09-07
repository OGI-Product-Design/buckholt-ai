# Radio

## Purpose

Use Radio when presenting a defined set of mutually exclusive choices where the user may select only one option. Selecting a new option automatically deselects the previously selected option in the same group.

## Canonical control

Buckholt uses the standard `.form-check` structure. The native `<input>` and `<label>` are siblings; connect them with matching `id` and `for` values.

```html
<div class="form-check">
  <input class="form-check-input" type="radio" name="radioGroup" id="radio-option-1">
  <label class="form-check-label" for="radio-option-1">Radio label</label>
</div>
```

All options in one mutually exclusive group must share the same `name`.

## Canonical Radio input group

For a labelled group, compose radios inside Buckholt's standard Input structure and use `.response.check-input`:

```html
<div class="input">
  <div class="input-label">
    <label class="form-label">Radio input label</label>
  </div>

  <div class="response check-input">
    <div class="form-check">
      <input class="form-check-input" type="radio" name="radioGroup" id="radio-1">
      <label class="form-check-label" for="radio-1">Radio #1</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="radioGroup" id="radio-2">
      <label class="form-check-label" for="radio-2">Radio #2</label>
    </div>
  </div>
</div>
```

## Supporting text

Use `<small class="form-helper">` inside `.input-label` for assistive text. Use the same class after `.response` for helper text. Put `.invalid-feedback` at the bottom of `.input`.

## Validation

Buckholt supports native HTML validation through `:valid` / `:invalid`, scoped by a parent `.was-validated` (normally the `<form>`) so required radios do not show errors before validation is triggered.

For server-side validation, `.is-invalid` is the documented fallback. Validation messages belong at the bottom of `.input`.

## States

Radio supports unselected, selected, focus, disabled, read-only and error states.

### Disabled

Use the native `disabled` attribute on individual radios. When the entire radio group is disabled, Buckholt also documents a disabled state on the outer `.input` so the group label reflects the state and assistive/helper text can be hidden.

### Read-only

HTML does not natively support `readonly` on radio controls. Buckholt documents adding a `readonly` attribute for the visual state and using JavaScript to block changes while keeping the control focusable and available to assistive technology.

The supplied `components/form/form.js` includes the Buckholt read-only prevention behaviour for `.form-check-input[readonly]` and state helpers used by the documentation examples. The script depends on jQuery.

## Accessibility

- Keep each label explicitly associated with its radio.
- Use one shared `name` per mutually exclusive set.
- Keep the group question visible and programmatically understandable in the surrounding form structure.
- Do not use disabled state where the user still needs to understand or review the value; use the documented read-only treatment instead.

## Agent rules

- Use Radio only for mutually exclusive choices.
- Reuse `.form-check`, `.form-check-input` and `.form-check-label`; do not recreate the radio control with custom elements.
- Use `.response.check-input` for a labelled group.
- Use native `checked`, `disabled`, `required` and group `name` semantics.
- Use the supplied `form.js` when implementing Buckholt's read-only behaviour.
- Do not duplicate helper/validation text or locally recreate interaction styling.