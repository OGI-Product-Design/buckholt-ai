# Multi-field input

## Purpose

Use Multi-field input when several closely related values belong to one labelled response and should be understood as a single input group rather than separate questions.

## Canonical structure

Multi-field input follows Buckholt's normal input structure but places more than one field inside the `.response` container. Add `.multi-input` to the response wrapper together with the relevant field-type class such as `.text-input` or `.select-input`.

```html
<div class="input">
  <div class="input-label">
    <label for="multi-field-1" class="form-label">Input label</label>
  </div>

  <div class="response multi-input text-input">
    <input type="text" class="form-control" id="multi-field-1" placeholder="Placeholder">
    <input type="text" class="form-control" id="multi-field-2" placeholder="Placeholder">
  </div>

  <div class="invalid-feedback">Validation message</div>
</div>
```

## Field types

The documentation explicitly supports composing Multi-field input from Text input and Select fields. When mixing field types, keep each field's real Buckholt classes and semantics; do not restyle generic inputs to imitate them.

## Layout

The default form presents fields together horizontally. Use `.multi-input-stacked` for the documented stacked arrangement:

```html
<div class="response multi-input multi-input-stacked text-input">
  ...
</div>
```

Do not invent new density or alignment modifiers beyond the documented classes.

## States

Multi-field inputs inherit the normal states of the fields they contain, including resting, focus, disabled, read-only and error. The child field type owns the detailed interaction and accessibility behaviour.

## Validation

Treat the whole Multi-field input as one labelled response, but do not duplicate error indicators across its fields.

Buckholt specifically documents that:

- grouped text inputs should show the error icon only in the first text field;
- if the group begins with a Select, the error icon is displayed alongside the error message instead;
- never show more than one error icon within one Multi-field input.

Use one `.invalid-feedback` message for the group where the documented example does so.

## Accessibility

- Keep a visible label for the combined response.
- Every native field still needs its own unique `id` and any field-specific accessible relationship required by its component.
- Do not remove the semantics of the individual native controls merely because they are visually grouped.

## Agent rules

- Read the guidance for every child field type used in the group.
- Use `.response.multi-input` plus the applicable child-input class.
- Use `.multi-input-stacked` only for the documented stacked variant.
- Do not use Multi-field input simply to place unrelated questions on one row; use Input row for that composition.
- Do not duplicate validation icons.