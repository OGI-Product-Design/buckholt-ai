# Input row

## Purpose

Input row is a layout component/pattern that places related input fields side by side in one row. It reduces vertical scrolling, strengthens the visual relationship between connected values and can make related data entry faster, such as expiry date + security code.

Use Input row only when the fields genuinely belong together. Do not place unrelated questions side by side merely to save space.

## Base structure

Input row uses Bootstrap's grid plus Buckholt's `.input-row` class:

```html
<div class="row input-row">
  <div class="col">
    <div class="input">
      <!-- documented Buckholt input -->
    </div>
  </div>

  <div class="col">
    <div class="input">
      <!-- documented Buckholt input -->
    </div>
  </div>
</div>
```

The documentation explicitly requires `.input-row` on the Bootstrap `.row` so the correct field spacing is applied.

## Column sizing

Use Bootstrap grid classes documented by Buckholt:

- `.col` for equal-width fields;
- numbered `.col-*` classes for intentional relative widths in the 12-column grid;
- responsive grid classes such as the documented `.col-md-*` form only when that breakpoint behaviour is intended.

Example:

```html
<div class="row input-row">
  <div class="col">
    <!-- wider field -->
  </div>
  <div class="col col-md-4">
    <!-- narrower field -->
  </div>
</div>
```

Do not invent fixed pixel widths where the documented grid solves the relationship.

## Content

Each column contains a complete Buckholt input component. The input itself remains responsible for:

- label and assistive text;
- response control;
- helper text;
- validation;
- disabled/read-only behaviour;
- colour, typography and control-specific states.

Input row should not restyle its children.

## Writing and typography

Headings and labels use sentence case. The Input row documentation delegates detailed colour and typography behaviour to the individual input components such as Text input, Number input, Select and Dropdown.

## Responsive behaviour

Input row is built on Bootstrap's grid, so the selected column classes determine responsive behaviour. Do not assume or invent automatic stacking rules beyond what the chosen Bootstrap classes actually express.

## Accessibility

- Preserve each input's complete semantic label/control relationship.
- Keep the visual row order consistent with DOM/tab order.
- Do not group fields horizontally when doing so makes the relationship or reading order ambiguous.
- Error/helper text belongs to the individual field and should remain associated with that field.

## Relationship to future patterns

The Buckholt Input row component page links to an **Input rows** pattern. Keep this component focused on the documented side-by-side layout primitive; do not invent higher-level multi-row form patterns here. Those belong in `patterns/` when their documentation is ingested.

## Related Buckholt guidance

Read:

- the specific input component used in each column;
- `components/form/` when the row is part of a Form;
- `components/text-input/` for Text inputs;
- `components/input-group/` when a field is itself an Input group;
- `foundations/spacing/`.

## Agent rules

- Use `.row.input-row` as the outer structure.
- Put each complete input inside a Bootstrap `.col`.
- Use `.col` for equal widths or documented Bootstrap `.col-*` sizing for intentional ratios.
- Keep related fields together; unrelated questions should remain separate.
- Let child components own their colour, typography, labels, validation and states.
- Do not recreate Input row gaps with local CSS.
- Do not invent responsive stacking behaviour not expressed by the selected grid classes.
