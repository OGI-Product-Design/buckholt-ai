# Switch

## Purpose

Use Switch for an immediate on/off setting or state. Buckholt provides default and small variants plus an always-active treatment for non-interactive enforced states.

## Canonical structure

```html
<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" role="switch" id="exampleSwitch">
  <div class="input-label">
    <label class="form-check-label" for="exampleSwitch">Example switch</label>
    <small class="form-helper">Helper text</small>
  </div>
</div>
```

The native checkbox remains the interactive control and uses `role="switch"`. Keep `id`/`for` matched.

## Default and small

The default switch is intended for forms/full-page contexts and must include a visible label and status tag. Runtime CSS renders the status text as `Off` / `On`.

Use `.form-switch-sm` for the compact variant. Small switches are intended for condensed or inline contexts; label and status text may be optional. Buckholt's small checked state includes a checkmark to retain a non-colour cue.

Use `.form-switch-status` with the small variant when the documented status tag is required.

## Disabled

Use native `disabled` on the input. Disabled switches may be either on or off.

## Always active

Use `.form-switch-active` only for states that are permanently/enforced on and cannot be changed by the user, such as system policy or a feature that cannot be disabled. The runtime hides the switch control and displays `Always active`.

Do not use always-active as a substitute for disabled. It communicates a distinct non-interactive but active condition.

## Agent rules

- Use `.form-check.form-switch` with native checkbox semantics and `role="switch"`.
- Use `.form-switch-sm` only for the documented compact variant.
- Use `.form-switch-status` only where status text is required on small Switch.
- Use `.form-switch-active` only for genuinely enforced/permanent active state.
- Preserve a visible label for default switches.
- Use native `checked` and `disabled` state.
- Do not recreate track/handle/status visuals with local CSS.