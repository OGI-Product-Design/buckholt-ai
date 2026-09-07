# Checkbox

## Verification

Source-verified against the Buckholt Checkbox Usage, Style and Code & specs HTML pages supplied on 7 September 2026. For exact DOM structure, use `examples.html`; its component markup is extracted from the Code & specs source.

## Purpose

Use Checkbox when users can select zero, one or multiple independent options. Use Radio when exactly one mutually exclusive option must be selected.

A Checkbox may stand alone or appear in a grouped input. Checkbox labels sit to the right of their controls and vertically arranged groups are preferred where possible for scanning.

## Canonical structure

Do not reconstruct Checkbox markup from this prose. Use `examples.html` for the exact Code & specs structures.

The documented single Checkbox uses:

```text
.form-check
├─ input.form-check-input[type="checkbox"]
└─ label.form-check-label
```

The documented group uses `.input`, `.input-label`, `.response.check-input`, then one or more `.form-check` children.

Assistive text is placed in `.input-label` using `.form-helper`; helper text follows `.response.check-input`.

## Selection states

Buckholt documents unselected, selected and indeterminate states in Usage/Style guidance. Product logic must keep the native checkbox state correct. The browser `checked` property represents selection; indeterminate requires JavaScript through `HTMLInputElement.indeterminate`.

Do not add undocumented visual-state classes to canonical markup unless the exact source example provides them.

## Validation

The Code & specs documentation uses standard Buckholt input validation with `.invalid-feedback`. It discusses Bootstrap/native validation patterns including `:invalid` / `:valid` and `.is-invalid` where required.

Keep validation at the input/group level documented by Buckholt rather than inventing row-level error styling.

## Disabled

Use native `disabled` on the checkbox. The Code & specs source also demonstrates adding `.disabled` to the parent `.input` when the entire checkbox group is disabled.

## Read-only

The Code & specs source places a `readonly` attribute directly on the checkbox input:

```html
<input class="form-check-input" type="checkbox" value="" id="checkbox-checkboxReadonly" readonly>
```

HTML does **not** natively enforce `readonly` on checkbox inputs. Buckholt therefore requires scripting to prevent changes while leaving the control focusable.

Do not use `.state_readonly` as canonical Checkbox markup; that class is not present in the supplied Code & specs HTML.

The shared `components/form/form.js` contains the documented enhancement behaviour for Checkbox/Radio state handling. Use the supplied script rather than creating a different local implementation.

## Accessibility

Keep native checkbox inputs and associated labels. Each `label[for]` must correspond to the actual input ID in a production implementation, even though some documentation demonstration snippets use group labels whose `for` values are illustrative rather than tied to one child control.

Do not use colour alone to communicate checked/error state.

## Agent rules

- Use native `<input type="checkbox">` with `.form-check-input` and `.form-check-label`.
- Use `.form-check` for a single Checkbox.
- Use `.input > .input-label + .response.check-input` for a documented group.
- Use Checkbox only for independent/multi-select choices.
- Use native `disabled` for unavailable controls.
- Preserve the documented `readonly` attribute in canonical markup and use the supplied JS to enforce read-only behaviour.
- Do not invent `.state_readonly`, `.selected`, `.indeterminate` or other canonical classes unless the exact component source supplies them.
- Do not recreate Checkbox styling or state behaviour with custom CSS.
