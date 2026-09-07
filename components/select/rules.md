# Select

## Purpose

Use Select when users must choose one value from a predefined list and a compact native control is appropriate.

## Canonical structure

```html
<div class="input">
  <div class="input-label">
    <label for="exampleSelect" class="form-label">Select label</label>
  </div>
  <div class="response select-input">
    <select class="form-select" id="exampleSelect">
      <option selected disabled value="">Choose an option</option>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  </div>
  <div class="invalid-feedback">Validation message</div>
</div>
```

`.input` owns the whole field, `.input-label` the label/help, `.response.select-input` identifies this response type, and `.form-select` is the native select control.

## Placeholder/default option

The documented examples use a disabled, selected empty option such as `Choose an option`. Do not preselect a real value unless the product requirement defines a genuine default.

## States

Use `.is-invalid` on `.form-select` for the documented error treatment and provide `.invalid-feedback`.

For disabled, use the native `disabled` attribute on `<select>`.

For Buckholt read-only Select, add `.readonly` and `disabled` to the `<select>`. Native HTML has no `readonly` state for select controls; Buckholt uses this documented combination to create its review/non-editable treatment.

Disabled and read-only controls do not require helper text that implies editability; provide essential context through the label or surrounding content.

## Agent rules

- Use a real `<select>` and `<option>` elements.
- Use `.response.select-input` and `.form-select`.
- Match the label `for` to the select `id`.
- Use a disabled empty placeholder when no real default exists.
- Use native `disabled` for disabled state.
- Use `.readonly` + `disabled` for Buckholt's documented read-only treatment.
- Use `.is-invalid` plus `.invalid-feedback` for errors.
- Do not replace Select with Dropdown unless the interaction needs Dropdown's richer behaviour.