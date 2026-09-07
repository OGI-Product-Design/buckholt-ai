# Slider

## Purpose

Slider lets users select a single continuous value within a defined range. Buckholt pairs the range control with a numeric input so users can either drag the handle or enter an exact value directly.

The documentation describes a range-slider variant for selecting two values as **coming soon**. Do not invent or implement a canonical Buckholt range-slider pattern from this component.

## Canonical structure

```html
<div class="input">
  <div class="input-label">
    <label for="slider-example" class="form-label">Slider label text</label>
  </div>

  <div class="response slider-input">
    <div class="slider-container">
      <span class="minmax">0</span>

      <div class="slider-wrapper">
        <input type="range" class="form-slider" id="slider-example"
          min="0" max="100" step="1" value="50">
        <div class="ticks">
          <span class="tick"></span>
          <span class="tick"></span>
          <span class="tick"></span>
          <span class="tick"></span>
          <span class="tick"></span>
        </div>
      </div>

      <span class="minmax">100</span>

      <input type="number" class="form-control"
        id="sliderOutput-example"
        value="50"
        style="width: 4ch;">
    </div>
  </div>

  <div class="invalid-feedback">Validation error message</div>
</div>
```

The documented hierarchy is significant:

- `.input` is the overall form-control wrapper.
- `.input-label` contains the label and optional assistive text.
- `.response.slider-input` identifies this as a Slider response.
- `.slider-container` contains minimum label, slider, maximum label and numeric input.
- `.slider-wrapper` contains the native range input and optional tick marks.
- `.form-slider` is applied to the native `input[type="range"]`.

## Value entry

The range control and numeric input represent the same value. Product implementations must keep them synchronized.

Use native `min`, `max`, `step` and `value` attributes to define the actual range rather than drawing a purely visual slider.

The minimum and maximum values are also displayed using `.minmax` text either side of the track.

## Ticks

Buckholt documents optional visual tick marks inside `.ticks` using repeated `.tick` elements.

Ticks are visual support only. The actual selectable increments come from the range input's `min`, `max` and `step` values.

## Supporting text

Assistive text may appear inside `.input-label` using `.form-helper`.

Additional helper text may appear after the response using `.form-helper`.

Do not place essential meaning only in visually decorative slider elements.

## Error state

For an invalid Slider, the documentation applies `.is-invalid` to both the `.form-slider` and the numeric `.form-control`, with a following `.invalid-feedback` message.

```html
<input type="range" class="form-slider is-invalid" ...>
<input type="number" class="form-control is-invalid" ...>
<div class="invalid-feedback">Validation error message</div>
```

Use a clear textual validation message; do not communicate error only through colour.

## Disabled state

The documented disabled state uses `disabled` on both the range and numeric inputs.

```html
<input type="range" class="form-slider" disabled>
<input type="number" class="form-control" disabled>
```

## Read-only state

Buckholt's documented read-only treatment is intentionally asymmetric because native range inputs do not support `readonly`:

- add `.readonly` and `disabled` to `.form-slider`;
- add `readonly` to the numeric input.

```html
<input type="range" class="form-slider readonly" disabled>
<input type="number" class="form-control" readonly>
```

Follow this documented pattern rather than inventing a custom readonly range interaction.

## Filled-track rendering

The documentation site renders the filled portion of the track with an inline `background-image: linear-gradient(...)` based on the current percentage. Treat this as dynamic runtime presentation: implementations should update the fill to correspond with the actual current value rather than hard-code a decorative percentage.

The Buckholt CSS supplies `--form-slider-filled-background` and the Slider's visual states. Do not recreate the track, thumb or focus treatment with unrelated custom CSS.

## Accessibility and interaction

- Associate the visible `<label>` with the range input via `for`/`id`.
- Retain the native `input[type="range"]` so standard keyboard interaction remains available.
- Keep the numeric input and range value synchronized.
- Preserve meaningful `min`, `max` and `step` attributes.
- Error messages must be available as text, not colour alone.
- Disabled and read-only states must use the documented native attributes.
- If implementation code adds additional ARIA, it must reflect the same real value/range rather than duplicating conflicting information.

## Agent rules

1. Use the documented `.input > .input-label + .response.slider-input` form structure.
2. Use a native `input[type="range"].form-slider`.
3. Keep range and numeric input values synchronized.
4. Use native `min`, `max`, `step`, `value`, `disabled` and `readonly` semantics as documented.
5. Use `.is-invalid` on both controls for the documented error state.
6. Use `.readonly` plus `disabled` on the range control for Buckholt's read-only state.
7. Do not invent the not-yet-documented range-slider variant.
8. Do not recreate Slider track/thumb/focus styling with custom CSS.
