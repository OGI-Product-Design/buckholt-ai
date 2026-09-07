# Lookup

## Purpose

Lookup allows users to enter a known value and retrieve related information. It combines input, actions and feedback into one focused interface.

Use it when a known value such as an identifier, reference or formatted input is required to return additional information.

## Base structure

Use `.lookup` to group the input with `.lookup-actions`. The `.lookup-actions` element contains supporting actions such as Buttons and Links.

Canonical markup:

```html
<div class="lookup">
    <div class="input">
        <div class="input-label">
            <label for="lookup-example" class="form-label">Input label</label>
        </div>
        <div class="input-group">
            <span class="input-group-text">GB</span>
            <div class="response text-input">
                <input type="text" class="form-control " id="lookup-example" placeholder="AB12 CDE">
            </div>
        </div> 
    </div> 
    <div class="lookup-actions">
        <div class="button-set">
            <button type="button" class="btn btn-primary ">
                <span class="button-label">Button label</span>   
            </button>
        </div>
        <a class="link-standalone" href="#" target="_self"> 
           Standalone link
        </a>
    </div>
</div>
```

Do not add validation markup or alter this canonical structure unless the relevant Buckholt input component requires it in the implementation being built.

## Lookup summary variation

Buckholt documents a summary variation that incorporates a Versa-tile:

```html
<div class="lookup">
    <div class="input">
        <div class="input-label">
            <label for="lookup-example" class="form-label">Input label</label>
        </div>
        <div class="versatile">
            ...
        </div>
    </div> 
    <div class="lookup-actions">
        <a class="link-standalone" href="#" target="_self"> 
            Standalone link
        </a>
    </div>
</div>
```

The documentation intentionally represents the Versa-tile internals as `...` here. Use the canonical Versa-tile component markup when implementing that nested component; do not expand this Lookup example into an invented local structure.

## Content

- Labels should describe the required input and may include expected formats/examples.
- Placeholder text may show a sample value.
- Buttons should be direct and action-oriented, such as Find or Lookup.
- Alternative actions should clearly describe the alternative route, such as entering details manually.
- Headings and labels use sentence case.

## Styling

Lookup delegates detailed colour and typography to the Input, Link, Versa-tile and Button components. Do not restyle those child components locally.

The documented structure uses 16px and 24px spacing relationships; rely on Buckholt's existing component CSS rather than recreating them with local CSS.

## Related guidance

Read the nested Buckholt components used by the implementation, especially:

- `components/input-group/`
- `components/text-input/`
- `components/button/`
- `components/link/`
- `components/versa-tile/`

Buckholt also has a higher-level Lookup pattern under `patterns/lookup/`; keep that journey/composition guidance separate from this component.

## Agent rules

- Use `.lookup` as the outer wrapper.
- Keep the known-value input inside `.input`.
- Put supporting actions inside `.lookup-actions`.
- Preserve the exact documented base and summary structures from `examples.html`.
- Use the canonical child-component markup for Input group, Text input, Button, Link and Versa-tile.
- Do not invent additional wrappers, validation markup or expanded Versa-tile internals in the canonical Lookup example.
- Do not create Lookup-specific styling for child components already styled by Buckholt.
