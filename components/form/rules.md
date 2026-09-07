# Form

## Verification

Source-verified against the Buckholt Form Usage, Style and Code & specs HTML pages supplied on 7 September 2026. `examples.html` is the canonical source for exact Form DOM structure.

## Purpose

A Form is a collection of related input controls that enables users to enter data or configure options. Form provides the composition layer around Buckholt inputs; each input retains its own labels, states, validation and interaction behaviour.

## Canonical structure

Do not reconstruct Form markup from prose. Use `examples.html` exactly.

The documented structure is:

```text
form.form
├─ .text-block                      optional heading/intro
├─ .form-body                       one or more sections
│  ├─ .text-block                   optional section intro
│  └─ documented Buckholt inputs
└─ .form-actions
   ├─ documented Button
   └─ documented Standalone Link
```

The Code & specs source demonstrates `<form class="form" id="formExample">`, an introductory Text block with `<h3 class="headline-03">`, `.form-body` sections, and `.form-actions` containing a large primary Button followed by a Standalone Link.

Canonical examples deliberately use `type="button"` because they are documentation demonstrations. Preserve that exact source in `examples.html`. In a real product implementation, use genuine submit semantics when the action actually submits the form; that application-level semantic decision must not rewrite the canonical Buckholt source example.

## Form body

`.form-body` groups form controls. Multiple `.form-body` sections may be used, and the documentation demonstrates an optional `.text-block` at the beginning of sections.

Reuse documented Buckholt input markup rather than recreating controls or spacing locally.

## Form actions

Use `.form-actions`. The rendered documentation examples and `buckholt.css` use this class. Source prose elsewhere mentions `.form-buttons`, but that does not match the rendered Code & specs markup or current runtime and is recorded in `discrepancies/known-issues.md`.

Do not use `.form-buttons` as canonical Buckholt markup.

## JavaScript enhancements

The supplied `components/form/form.js` provides documented shared enhancements including input clearing, Checkbox/Radio behaviour, Text area character counting and Number input step controls. Use the supplied source rather than rewriting these behaviours.

Where that source depends on jQuery, ensure the implementation environment loads its dependency before `form.js`.

## Runtime

Use `buckholt.css` for Form width, gaps, action spacing and contained component styling. Do not reproduce those values with local CSS.

## Accessibility

- Use a real `<form>` for actual form submission workflows.
- Preserve each child control's documented label, validation and state semantics.
- Keep semantic heading hierarchy appropriate to the product page while preserving the Code & specs example unchanged in the canonical source file.
- Use actual submit behaviour where the product action submits; do not alter `examples.html` to express that application-specific behaviour.

## Agent rules

- Read `examples.html` for exact Form DOM; do not reconstruct it from this prose.
- Use `.form`, `.form-body` and `.form-actions` as documented.
- Do not use `.form-buttons` as canonical markup.
- Preserve optional Text block placement shown by the source.
- Reuse exact child-component markup for inputs, Buttons and Links.
- Do not replace the documentation's `type="button"` in canonical examples with an inferred `type="submit"`.
- Do not recreate Form widths, gaps or action spacing locally.
