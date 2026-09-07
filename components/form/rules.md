# Form

## Purpose

A Form is a collection of related input controls that enables users to enter data or configure options.

Use Form as the composition layer around Buckholt input components. The Form controls layout, grouping and actions; the individual input components remain responsible for their own labels, states, validation and interaction behaviour.

## Structure

The documented Form structure is:

1. `.form` — the main form wrapper.
2. optional `.text-block` — heading and/or description that explains the purpose of the form.
3. one or more `.form-body` sections — input components and optional section-level Text blocks.
4. an actions area at the bottom — see the known documentation/runtime naming issue below.

Canonical structure:

```html
<form class="form" id="formExample">
  <div class="text-block">
    <h3 class="headline-03">Heading text</h3>
  </div>

  <div class="form-body">
    <!-- Buckholt input components -->
  </div>

  <div class="form-buttons">
    <button type="submit" class="btn btn-primary btn-lg">
      <span class="button-label">Submit</span>
    </button>
    <a class="link-standalone" href="#">Cancel</a>
  </div>
</form>
```

## Form body

- `.form-body` contains the form controls.
- Multiple `.form-body` sections may be used when the form needs distinct sections.
- A `.text-block` may appear at the start of a Form or at the start of an additional `.form-body` to introduce that section.
- Reuse documented Buckholt input components rather than recreating controls locally.
- Runtime `.form-body` has a maximum width of `36rem` and a `2rem` vertical gap; do not reproduce this with local CSS.

## Form controls

Buckholt groups form controls into three interaction types:

- **Free-form inputs** — unrestricted text/number entry such as Text input and Text area.
- **Selection controls** — predefined choices such as Checkbox, Radio, File uploader, Switch and Select-style controls.
- **Bound entry controls** — constrained values such as dates, times, number inputs and range controls.

Choose the appropriate component by interaction need rather than appearance.

## Form actions

Place completion/exit actions at the bottom of the Form and reuse Buckholt Button and Link components.

There is a verified naming inconsistency in the source:

- explanatory Form code documentation calls this wrapper `.form-buttons`;
- several rendered/documented HTML examples use `.form-actions`;
- the compiled runtime styles `.form-buttons`, not `.form-actions`.

Until upstream documentation/runtime is reconciled, use `.form-buttons` when implementing Buckholt so the documented action-area spacing is actually applied. See `discrepancies/known-issues.md`.

Do not invent local action spacing to make `.form-actions` look correct.

## States and validation

Form-level documentation demonstrates states through the controls contained within the Form. Apply resting, focus/active, error, disabled and read-only behaviour through the relevant input component rather than inventing a Form-level visual state.

Use the validation API documented by each control. Do not rely on colour alone for validation meaning.

## Runtime behaviour

The compiled runtime provides:

```css
.form,
.form-buttons,
.form-body {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-body {
  max-width: 36rem;
}

.form-body + .form-body {
  margin-top: 2rem;
}

.form-buttons {
  margin-top: 2rem;
}
```

The runtime also contains `.nested-questions` and `.short-form`. Treat these as implementation helpers unless their specific use is documented by a component/pattern; do not promote them into general Form guidance solely because they exist in CSS.

## Accessibility

- Use a real `<form>` when content is a form.
- Give every control the semantic labelling and accessible state required by its own component guidance.
- Keep headings semantic; use Buckholt type-set classes for appearance rather than choosing heading levels by visual size.
- Use real submit behaviour when the primary action submits the form; examples in the documentation may use `type="button"` only as non-functional component demonstrations.
- Do not disable content that users still need to perceive; prefer the documented read-only treatment where review without editing is required.

## Related Buckholt guidance

Read as needed:

- `components/text-input/`
- `components/input-group/`
- `components/input-row/`
- `components/button/`
- `components/link/`
- `components/text-block/`
- `foundations/spacing/`
- `foundations/typography/`
- `foundations/colour/`

## Agent rules

- Build Forms from documented Buckholt controls.
- Use `.form` and `.form-body`; use `.form-buttons` for the runtime-correct actions wrapper until the known naming mismatch is resolved.
- Keep optional introductory/section content in Text block.
- Reuse Button and Link for actions.
- Do not recreate Form widths, gaps or action spacing locally.
- Do not infer unsupported validation, progressive-disclosure or submission behaviour from the Form container alone.
