# Input group

## Purpose

Input group pairs an input with a start/end addon or related inline response button to provide context or a quick action.

Examples include a username prefixed with `@`, a distance suffixed with `miles`, or a response button beside an input.

Input group is a composition around an existing Buckholt input. The nested input component still owns its label, value, validation and input-specific behaviour.

## Base structure

```html
<div class="input">
  <div class="input-label">
    <label for="inputGroupExample" class="form-label">Input label</label>
  </div>

  <div class="input-group">
    <div class="response text-input">
      <input type="text" class="form-control" id="inputGroupExample">
    </div>
    <span class="input-group-text">End addon</span>
  </div>

  <div class="invalid-feedback">Validation message</div>
</div>
```

`.input-group` replaces the direct response position inside `.input` and contains the `.response` plus addon/action elements.

## Start and end addons

Use `.input-group-text` immediately before or after the `.response`:

```html
<div class="input-group">
  <span class="input-group-text">@</span>
  <div class="response text-input">
    <input type="text" class="form-control" id="username">
  </div>
</div>
```

```html
<div class="input-group">
  <div class="response text-input">
    <input type="text" class="form-control" id="distance">
  </div>
  <span class="input-group-text">miles</span>
</div>
```

Use addon text to clarify the value's meaning, format, unit or prefix/suffix. Do not add decoration that does not help users understand the field.

## Action buttons

The documented grouped action uses a Buckholt response button after the `.response`:

```html
<div class="input-group">
  <div class="response text-input">
    <input type="text" class="form-control" id="lookup">
  </div>
  <button type="button" class="btn btn-response">
    <span class="button-label">Action</span>
  </button>
</div>
```

Multiple response buttons may be placed side by side when genuinely needed. Follow the Response button component guidance once that component is ingested rather than inventing variants here.

Do not confuse this grouped response-button pattern with `.input-btn` inside a Text input. `.input-btn` is the single compact action contained within a Text input; `.btn.btn-response` is an item in an Input group.

## States

Input groups share the states of their contained input/response-button components. Addons visually respond to disabled and read-only states as provided by the runtime.

For an error, apply the documented invalid state to the actual input and keep `.invalid-feedback` associated with the outer `.input`:

```html
<div class="input">
  <div class="input-label">
    <label for="amount" class="form-label">Amount</label>
  </div>
  <div class="input-group">
    <span class="input-group-text">£</span>
    <div class="response text-input">
      <input type="text" class="form-control is-invalid" id="amount">
    </div>
  </div>
  <div class="invalid-feedback">Enter a valid amount.</div>
</div>
```

## Size

The runtime contains Bootstrap-style `.input-group-sm` and `.input-group-lg` selectors. Do not treat those runtime selectors as canonical Buckholt variants unless the Input group documentation explicitly defines their use. Follow the documented size of the contained input/response components.

## Runtime behaviour

The compiled runtime makes `.input-group` a wrapping flex container and allows normal response areas to flex. It also joins adjoining borders/radii between group elements and provides the actual `.input-group-text` styling.

Buttons in a group receive their documented separation from the runtime. Do not reproduce connected borders, radii, addon dimensions or action spacing with local CSS.

## Accessibility

- Keep the real form control labelled through its containing `.input` structure.
- Addon text should supplement the label, not replace it.
- If an addon communicates a unit or prefix that is essential to understanding the value, ensure that meaning remains clear to assistive-technology users through appropriate semantic labelling/context.
- Action buttons must be real `<button>` controls with clear accessible names.
- Preserve the child input's native disabled/read-only and validation semantics.

## Related Buckholt guidance

Read:

- the nested input component, especially `components/text-input/` where applicable;
- `components/form/`;
- `components/input-row/` when the whole grouped control appears alongside another input;
- Button/Response button guidance for grouped actions;
- Colour, Typography, Spacing and Radius foundations.

## Agent rules

- Use `.input-group` around `.response` plus addons/actions.
- Use `.input-group-text` before/after `.response` for start/end addons.
- Keep the actual input component's canonical markup inside `.response`.
- Use `.btn.btn-response` for the documented grouped action pattern; do not substitute `.input-btn`.
- Let the contained control own validation, disabled/read-only and other states.
- Do not promote runtime `.input-group-sm`/`.input-group-lg` into design guidance without documentation support.
- Do not recreate joined borders, addon styling or spacing locally.
