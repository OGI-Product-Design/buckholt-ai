# Buckholt Progress bar

## Status

Progress bar guidance rebuilt from the supplied Buckholt Usage, Style and Code & specs documentation and checked against `../../css/buckholt.css`.

## Purpose

Progress bars communicate the status of an ongoing process. Buckholt supports both determinate progress, where the amount completed can be measured, and indeterminate progress, where progress is active but cannot yet be quantified.

Use a Progress bar when users benefit from knowing that work is in progress or how far a process has advanced. Do not use it as decoration or as a substitute for a simple static status label.

## Base structure

The core visual structure is `.progress` containing `.progress-bar`:

```html
<div class="progress" role="progressbar"
     aria-label="Progress label"
     aria-valuenow="50"
     aria-valuemin="0"
     aria-valuemax="100">
  <div class="progress-bar" style="width: 50%"></div>
</div>
```

For full Buckholt content around the bar, use `.progress-container`. `.progress-header` groups the required label and optional note.

```html
<div class="progress-container">
  <div class="progress-header">
    <label for="progress-example" class="progress-label">Progress label</label>
    <span class="progress-note">Progress note</span>
  </div>

  <div id="progress-example" class="progress" role="progressbar"
       aria-label="Progress label"
       aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
    <div class="progress-bar" style="width: 50%"></div>
  </div>

  <small class="progress-helper">Helper text</small>
  <div class="invalid-feedback">Validation message</div>
</div>
```

## Content anatomy

Buckholt documents these elements:

- **Label text** - describes the process. It may be visually hidden where appropriate but must always be present for accessibility.
- **Helper text** - optional supporting context. Determinate progress may show percentage, fraction or numeric progress here. Indeterminate progress must not show quantitative progress that is not actually known.
- **Note text** - optional extra context such as a readable percentage or target/expected completion information.
- **Track** - the fixed background representing the whole process.
- **Indicator bar** - visually represents current completion.
- **Status icon** - communicates states such as success or error.

Keep labels short and consistent throughout the process.

## Sizes

Buckholt documents two bar heights:

- default/large: 8px;
- small: 4px using `.progress-sm`.

The large/default bar suits standalone or spacious layouts. Use `.progress-sm` in compact areas such as Cards, tables or side panels.

## Determinate progress

For measurable progress, set `aria-valuenow`, `aria-valuemin` and `aria-valuemax` and set the `.progress-bar` width to the corresponding percentage.

Do not display a percentage or numeric value that does not reflect real progress.

## Indeterminate progress

Use `.progress-bar-indeterminate` when the process is active but measurable progress is unavailable:

```html
<div class="progress-container">
  <div class="progress-header">
    <label for="progress-indeterminate" class="progress-label">Processing</label>
  </div>
  <div id="progress-indeterminate" class="progress" role="progressbar" aria-label="Processing">
    <div class="progress-bar progress-bar-indeterminate"></div>
  </div>
</div>
```

Indeterminate helper text may describe what is happening but must not claim a specific percentage or amount completed.

An indeterminate bar may transition to determinate progress when sufficient data becomes available.

## Success

Buckholt uses `.is-valid` on `.progress` for success. The runtime fills the bar to 100% and applies the success treatment/status icon.

```html
<div class="progress is-valid" role="progressbar"
     aria-label="Complete" aria-valuenow="100"
     aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar"></div>
</div>
```

## Error

Use `.is-invalid` on `.progress` for error. Buckholt fills the bar, applies the error treatment and displays `.invalid-feedback`; the error feedback replaces helper content where present.

```html
<div class="progress-container">
  <div class="progress-header">
    <label for="progress-error" class="progress-label">Progress error</label>
  </div>
  <div id="progress-error" class="progress is-invalid" role="progressbar"
       aria-label="Progress error" aria-valuenow="100"
       aria-valuemin="0" aria-valuemax="100">
    <div class="progress-bar"></div>
  </div>
  <div class="invalid-feedback">Describe the error and what the user should do next.</div>
</div>
```

Error messaging must provide context; colour and icon alone are not sufficient.

## Inactive

Use `.progress-inactive` on `.progress` for the documented inactive state. The runtime sets the visual bar to full width for that state.

## Interaction and page behaviour

If progress affects only part of a page, unaffected controls may remain interactive. If a process affects a whole Card/container or a defined section, disable only the affected area for the duration of the process rather than unnecessarily blocking unrelated UI.

## Accessibility

- Always provide a meaningful progress label.
- Use `role="progressbar"` on the progress element.
- Determinate progress must expose `aria-valuenow`, `aria-valuemin` and `aria-valuemax`.
- Do not expose a false numeric value for indeterminate progress.
- Error states need readable error text, not only red colour or an icon.
- Do not use Progress bar alone to communicate important completion/error information if users also need explicit textual confirmation.

## Runtime implementation

The current runtime provides `.progress-container`, `.progress-header`, `.progress-label`, `.progress-note`, `.progress-helper`, `.progress`, `.progress-bar`, `.progress-sm`, `.progress-bar-indeterminate`, `.is-valid`, `.is-invalid` and `.progress-inactive` behaviour.

Let Buckholt control bar height, colours, status icons, animation, feedback placement and state styling. Do not recreate these with local CSS.

## Agent rules

- Use `.progress-container` when label, note/helper or feedback content is present.
- Always provide a progress label.
- Use `.progress` with child `.progress-bar` for the visual bar.
- Use `.progress-sm` only for the documented 4px compact form; default is 8px.
- Use real ARIA range values for determinate progress.
- Use `.progress-bar-indeterminate` when progress cannot be measured; do not invent percentages.
- Use `.is-valid` for success and `.is-invalid` plus `.invalid-feedback` for error.
- Use `.progress-inactive` only for the documented inactive state.
- Do not reproduce state colours, icons, heights, animation or internal spacing with custom CSS.
