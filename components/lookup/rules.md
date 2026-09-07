# Buckholt Lookup

## Status

Lookup guidance rebuilt from the supplied Buckholt Usage, Style and Code & specs documentation and checked against `../../css/buckholt.css`.

## Purpose

Lookup lets users enter a known value and retrieve related information. It combines the input, validation and supporting actions into one focused component.

Use Lookup when the user already has a value that can be used to retrieve data, for example an identifier, reference or formatted value such as a vehicle registration.

Keep the interaction simple and focused: make clear what value is expected, how to submit it, and what alternative route is available when one is provided.

## Base structure

Use `.lookup` as the outer wrapper. The documented base form contains:

1. one Buckholt `.input` component;
2. a `.lookup-actions` area containing the actions that support the lookup process.

Canonical base example:

```html
<div class="lookup">
  <div class="input">
    <div class="input-label">
      <label for="vehicleRegistration" class="form-label">Enter your registration number</label>
    </div>

    <div class="input-group">
      <span class="input-group-text">GB</span>
      <div class="response text-input">
        <input type="text" class="form-control" id="vehicleRegistration" placeholder="AB12 CDE">
      </div>
    </div>

    <div class="invalid-feedback">Validation message</div>
  </div>

  <div class="lookup-actions">
    <div class="button-set">
      <button type="button" class="btn btn-primary">
        <span class="button-label">Find your car</span>
      </button>
    </div>

    <a class="link-standalone" href="#">Find your car by make &amp; model</a>
  </div>
</div>
```

The input shown in the documentation composes Input group and Text input, but Lookup is a composition component: choose the documented Buckholt input appropriate to the known value rather than rebuilding field styling locally.

## Lookup actions

`.lookup-actions` contains actions that support the lookup process.

The documented example uses:

- a primary Button as the main lookup action;
- an optional standalone Link as an alternative route.

Use Button and Link according to their own Buckholt guidance. Keep the primary lookup action obvious and do not turn `.lookup-actions` into a general-purpose toolbar.

Runtime layout is:

```css
.lookup {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lookup-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
```

Do not recreate these gaps or layout rules locally.

## Validation

Validation belongs to the nested input component. The documented Lookup markup includes `.invalid-feedback` within `.input`.

Follow the chosen input component's validation rules, including its `.is-invalid` state where applicable. Lookup does not define a separate validation system.

## Summary variation

Buckholt documents a Lookup summary variation for displaying retrieved data. In this variation the input area can be replaced by or composed with a Versa-tile summary while the outer `.lookup` and `.lookup-actions` relationship remains.

The documented summary structure uses:

```html
<div class="lookup">
  <div class="input">
    <div class="input-label">
      <label for="lookupSummary" class="form-label">Input label</label>
    </div>

    <div class="versatile">
      <div class="versatile-content">
        <div class="versatile-body">
          <div class="icon-block">
            <i class="fa-regular fa-ghost" aria-hidden="true"></i>
          </div>

          <div class="versatile-meta">
            <div class="versatile-label">Label</div>
            <p class="versatile-text">Body text</p>
          </div>
        </div>

        <div class="versatile-actions">
          <div class="button-set">
            <button type="button" class="btn btn-ghost" aria-label="Edit">
              <div class="btn-icon">
                <i class="fa-regular fa-pencil" aria-hidden="true"></i>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="invalid-feedback">Validation message</div>
  </div>

  <div class="lookup-actions">
    <a class="link-standalone" href="#">Standalone link</a>
  </div>
</div>
```

Use the Versa-tile component exactly as documented; do not create a Lookup-specific summary-card style.

## Content and formatting

- Labels and headings use sentence case.
- Use a visible persistent label for the known value.
- Placeholder text is supplementary only; follow the nested input component's placeholder guidance.
- Use formatting aids such as Input group addons only when supported by the relevant input component and useful to understanding the expected value.
- Keep validation text specific to the value the user needs to correct.
- Keep the main action label task-oriented, for example `Find your car` rather than a generic `Submit` where the documentation/context supports a specific action.
- An alternative Link should describe the alternative route clearly rather than repeat the primary action.

## Styling and composition

Lookup does not define independent colours or typography for its child controls. The Style documentation explicitly refers to the relevant Input, Link, Versa-tile and Button components for those details.

Read and reuse those components rather than styling nested controls through `.lookup` selectors.

## Accessibility

- Use a real `<label>` associated with the input control.
- Preserve the accessibility contract of the chosen input component.
- Use semantic Buttons for actions and Links for navigation/alternative destinations.
- Ensure icon-only actions in the summary variation have an accessible name and follow Button/Iconography guidance.
- Validation must not rely on colour alone.
- Retrieved information presented in a Versa-tile must remain understandable without its icon treatment.

## Component vs pattern

Buckholt also lists a higher-level `Patterns / Lookup` page. This component file documents the **Lookup component** under Forms & inputs only.

Do not infer the future Lookup pattern's journey/layout rules from this component. When the Pattern documentation is ingested, keep it in `patterns/lookup/` and let it compose this component rather than merging the two concepts.

## Related guidance

Read as needed:

- `../text-input/`
- `../input-group/`
- `../button/`
- `../link/`
- `../versa-tile/`
- `../icon-block/`
- `../../foundations/typography/`
- `../../foundations/spacing/`
- `../../foundations/colour/`
- `../../foundations/iconography/`

## Agent rules

- Use `.lookup` to group a known-value input with `.lookup-actions`.
- Let the nested input own its label, formatting, validation and state behaviour.
- Use Buckholt Button for the primary lookup action and Link only for a genuine alternative route/navigation.
- Use the documented Versa-tile variation for retrieved-data summary content.
- Reuse nested Buckholt components rather than recreating their styling inside Lookup.
- Do not turn `.lookup-actions` into a generic toolbar.
- Do not invent higher-level Lookup-pattern behaviour from this component.
- Do not recreate Lookup spacing or child-component colours/typography locally.
