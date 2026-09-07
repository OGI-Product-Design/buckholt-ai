# Input row

## Purpose

Input row is a layout pattern that places related input fields side by side in a single row. It reduces vertical scrolling, keeps connected information visually grouped, and supports faster entry for related values such as payment details.

Use Input row only when the fields genuinely belong together. Default to stacked inputs unless side-by-side placement clearly improves usability.

## Base structure

Input row uses Bootstrap's grid plus Buckholt's `.input-row` class:

```html
<div class="row input-row">
    <div class="col">
        <div class="input">
            ...
        </div>
    </div>
    <div class="col">
        <div class="input">
            ...
        </div>
    </div>
</div>
```

Add `.input-row` to the Bootstrap `.row` so Buckholt applies the documented spacing between fields.

## Column sizing

Use Bootstrap grid classes exactly as documented by Buckholt:

- `.col` for equal-width fields.
- numbered `.col-*` classes for specific relative widths within the 12-column grid.
- Buckholt documents numbered classes from `.col-2` through `.col-12`.

Documented unequal-width example:

```html
<div class="row input-row">
    <div class="col">
        <div class="input">
            ...
        </div>
    </div>
    <div class="col-4">
        <div class="input">
            ...
        </div>
    </div>
</div>
```

Do not substitute responsive classes such as `.col-md-*` into canonical Buckholt markup unless another Buckholt source explicitly documents that variant.

## Spacing

Buckholt recommends **8px / 0.5rem** between input fields to provide clear separation while keeping related fields visually grouped.

## Content

Each field remains an independent input with its own label, helper text and validation. Do not apply one shared validation state across unrelated child fields.

Use Input row for closely related, short/simple inputs that are normally completed together. Avoid it for unrelated fields, complex or long inputs, or situations where side-by-side placement harms readability on smaller screens.

## Writing and typography

Labels use sentence case. Detailed colour and typography guidance is delegated to the individual input components such as Text input, Number input, Select and Dropdown.

## Accessibility

- Preserve each input's label/control relationship.
- Keep visual order consistent with DOM/tab order.
- Every text field should normally have its own visible label; only omit a visible label where context is unmistakable and accessibility guidance supports it.
- Keep validation and helper text associated with the individual field.

## Related guidance

Read:

- `patterns/input-rows/` for higher-level usage guidance;
- the specific input component used in each column;
- `components/form/` when the row is part of a Form;
- `foundations/spacing/`.

## Agent rules

- Use `.row.input-row` as the outer structure.
- Put each complete input inside a Bootstrap column.
- Use `.col` for equal widths or documented numbered `.col-*` classes for intentional ratios.
- Do not invent `.col-md-*` or other responsive variants as canonical Buckholt markup.
- Keep related fields together; unrelated questions should remain stacked.
- Let child components own labels, helper text, validation and states.
- Do not recreate Input row spacing with local CSS.
