# Number input

## Purpose

Use Number input when the user needs to enter or adjust a numeric value. Buckholt combines a native number field with increment and decrement actions.

## Canonical structure

```html
<div class="input">
  <div class="input-label">
    <label for="number-example" class="form-label">Example number input</label>
  </div>

  <div class="response num-input">
    <input type="number" class="form-control" id="number-example" value="0">
    <button type="button" class="input-btn step-btn step-add" aria-label="Increase value">
      <i class="fa-regular fa-plus" aria-hidden="true"></i>
    </button>
    <button type="button" class="input-btn step-btn step-minus" aria-label="Decrease value">
      <i class="fa-regular fa-minus" aria-hidden="true"></i>
    </button>
  </div>
</div>
```

The `.input` wrapper contains `.input-label` and `.response`; `.num-input` identifies the response as a Number input. Buckholt documents two action buttons inside the response using `.input-btn.step-btn.step-add` and `.input-btn.step-btn.step-minus`.

## Supporting text

Assistive text uses `<small class="form-helper">` inside `.input-label`. Helper text uses the same class after `.response`. Validation text uses `.invalid-feedback`.

## Icons and prefixes

The documentation shows an optional `.input-icon` before the native number field, for example a currency symbol. Use only when the icon conveys meaningful input context and use the documented Iconography mapping.

## Sizes

Buckholt documents medium/default and small Number inputs. Preserve the documented size class when implementing the small form rather than recreating its dimensions locally.

## States

Number input supports resting, focus, active, error, disabled and read-only states.

- Error: apply `.is-invalid` to the native `.form-control` and provide `.invalid-feedback`.
- Disabled: use native disabled semantics for the field and disable the step actions as required by the product implementation.
- Read-only: the user can review but not modify the value; keep the field accessible/focusable according to the documented read-only treatment and prevent the step actions from changing it.

## JavaScript dependency

Buckholt's supplied `form.js` contains the Number input step-button behaviour. `.step-add` increments the current value by 1 and `.step-minus` decrements it by 1; an empty field is first set to `0`. The script then triggers `change` on the field.

Load `components/form/form.js` when Buckholt form enhancement behaviour is required. The supplied script depends on jQuery.

Do not invent an alternative Buckholt stepper implementation when the supplied script is available.

## Agent rules

- Keep `type="number"` on the actual numeric control.
- Use `.response.num-input` and the documented two step buttons.
- Give icon-only step buttons accessible names.
- Preserve native numeric attributes such as `min`, `max` and `step` when the product requirements define them; do not invent constraints.
- Use `.input-icon` only for meaningful context.
- Load the supplied `form.js` for documented step-button behaviour.
- Do not recreate Number input borders, spacing, buttons or states with local CSS.