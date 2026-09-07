# Switch

## Verification

Source-audited against the Buckholt Switch Usage, Style and Code & specs HTML pages supplied on 7 September 2026. Use `examples.html` for exact DOM structure.

## Purpose

Switch controls an immediate on/off setting. Buckholt documents default, small, status, helper, always-active, grouped and disabled forms.

## Canonical markup

`examples.html` preserves the exact Code & specs variations. The base structure uses `.form-check.form-switch`, a native input with `role="switch"`, and `.input-label > .form-check-label`.

Documented modifiers/structures include:

- `.form-switch-sm` — small;
- `.form-switch-status` combined with small in the source status example;
- `.form-helper` inside `.input-label`;
- `.form-switch-active` for the documented always-active treatment;
- `.switch-set` for a group;
- native `disabled` for disabled state.

The always-active Code & specs example literally uses `<input type="radio" role="switch" ... checked>`. Preserve that exact source markup rather than normalising it to a checkbox.

## Usage

Always-active means the setting is permanently/enforced on in that context, not merely a normal disabled switch. Use it only where the product meaning requires that treatment.

## Accessibility

Production controls must retain associated labels and correctly represent their actual state. Do not rely on visual position/colour alone.

## Agent rules

- `examples.html` is canonical for Switch DOM.
- Preserve the exact native input type and modifiers shown for each documented variation.
- Do not rewrite the always-active Radio example as a Checkbox in canonical source.
- Use `.switch-set` only for the documented grouped form.
- Let `buckholt.css` provide Switch appearance and states.
