# Input group

## Purpose

Input groups pair an input with addons (prefix/suffix) or optional inline buttons to provide context or quick actions.

Use them when an input value benefits from immediate context, such as a unit or prefix, or when a shortcut action can populate the field. Avoid them when the same context can be handled clearly by the field label/helper text, or when several complex controls would crowd the input.

## Base structure

The base structure follows other Buckholt input components, with grouped items wrapped by `.input-group`. Inside that wrapper, place the `.response` plus any supporting addon/action items.

Documented end-addon example:

```html
<div class="input">
    <div class="input-label">
        <label for="inputgroup-example" class="form-label">Input label</label>
    </div>
    <div class="input-group">
        <div class="response text-input">
            <input type="text" class="form-control" id="inputgroup-example">
        </div>
        <span class="input-group-text">End addon</span>
    </div>
</div>
```

Documented start-addon example:

```html
<div class="input">
    <div class="input-label">
        <label for="inputgroup-example" class="form-label">Input label</label>
    </div>
    <div class="input-group">
        <span class="input-group-text">Start addon</span>
        <div class="response text-input">
            <input type="text" class="form-control" id="inputgroup-example">
        </div>
    </div>
</div>
```

To create start or end addons, place `.input-group-text` before or after `.response` inside `.input-group`.

## Action buttons

Buckholt documents action buttons in the same grouped position as addons. Place a `<button>` with `.btn .btn-response` after `.response`:

```html
<div class="input">
    <div class="input-label">
        <label for="inputgroup-actionexample" class="form-label">Action button example</label>
    </div>
    <div class="input-group">
        <div class="response text-input">
            <input type="text" class="form-control" id="inputgroup-actionexample">
        </div>
        <button type="button" class="btn btn-response">
            <span class="button-label">Action</span>
        </button>
    </div>
</div>
```

Multiple buttons may be placed side by side when needed.

## Supported input types

Buckholt documents Input groups with Text input, Number input, Select and Dropdown. The contained component keeps its own markup, states and validation rules.

## Content

Addon labels should be short and unambiguous, typically a symbol or one word. Prefer full words for units when space allows. Action labels should be specific, actionable and sentence case, following Response button guidance.

## Size

The Input group follows the sizing of the contained input components and Response buttons. Do not introduce additional canonical Input group size variants unless Buckholt documentation explicitly defines them.

## States and validation

Input groups inherit resting, focus, error, disabled and read-only states from the input components and Response buttons they contain. Validation follows the rules of the individual contained component.

## Style

Buckholt documents addon styling through the Input group specification. Detailed input/action colours and typography continue to come from the relevant Text input, Number input, Select, Dropdown and Response button components.

## Agent rules

- Wrap `.response` and its addon/action items in `.input-group`.
- Use `.input-group-text` before/after `.response` for start/end addons.
- Use `.btn.btn-response` for the documented inline action button.
- Preserve the exact markup of the contained input component.
- Keep addons concise and meaningful.
- Let each contained component own its validation and interactive states.
- Do not add undocumented wrappers, validation markup, size classes or local styling to the canonical examples.
