# Multi-field input

## Verification

Source-audited against the Buckholt Multi-field input Usage, Style and Code & specs HTML pages supplied on 7 September 2026. Use `examples.html` for exact DOM structure.

## Purpose

Use Multi-field input when several closely related values belong to one labelled response and should be understood as one combined input rather than separate questions.

## Canonical markup

Do not reconstruct Multi-field input markup from prose. The Code & specs source in `examples.html` documents:

- `.input` with `.input-label` and one `.response.multi-input` wrapper;
- multiple Text inputs using `.response.multi-input.text-input`;
- a mixed Select + Text input example using `.response.multi-input.select-input.text-input`;
- the stacked variant using `.multi-input-stacked` on the response wrapper.

The Code & specs source does **not** add `.invalid-feedback` to the canonical base examples. Do not insert validation markup into those examples by inference.

## Layout

Default Multi-field input places the related controls together horizontally. Add `.multi-input-stacked` only for the documented stacked arrangement.

Use the nested control classes exactly as shown by the source. Do not replace the combined response wrapper with an Input row or arbitrary Bootstrap columns.

## Validation and states

Usage/Style guidance may describe validation, disabled and read-only behaviour, but the child controls remain the actual native inputs. Apply their documented states when a product implementation needs them; do not silently add state markup to the canonical Code & specs examples.

Where the documentation describes error-icon behaviour for grouped fields, do not duplicate multiple error indicators within one combined response.

## Accessibility

Keep the visible group label and the native semantics of each control. Production IDs and accessible relationships must be unique and correct, even where documentation examples reuse illustrative labels/IDs.

## Agent rules

- `examples.html` is canonical for Multi-field input DOM.
- Use `.response.multi-input` plus the documented child input classes.
- Use `.multi-input-stacked` only for the documented stacked variant.
- Do not add validation wrappers, additional labels, grid wrappers or other structure unless the exact source documents them.
- Use Input row instead when separate questions merely need side-by-side layout rather than one combined response.
