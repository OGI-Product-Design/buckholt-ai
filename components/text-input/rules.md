# Text input

## Purpose

Text input allows users to enter free-form, single-line text. Use it for short entries that may contain letters, numbers or symbols.

Use a different Buckholt control when the value is inherently a predefined choice, multi-line content or a constrained/bound value better served by another documented component.

## Base structure

```html
<div class="input">
  <div class="input-label">
    <label for="exampleTextInput" class="form-label">Example text input</label>
  </div>

  <div class="response text-input">
    <input type="text" class="form-control" id="exampleTextInput">
  </div>
</div>
```

`.input` is the overall input wrapper. `.input-label` contains the label/assistive material. `.response.text-input` identifies the response area as a Text input. The native `<input>` uses `.form-control`.

## Label

A visible label is mandatory unless an approved accessibility exemption applies.

Use sentence case. Associate the `<label for>` with the input's unique `id`.

Required/optional qualifiers are documented as `<small>` text directly inside the label after the label text:

```html
<label for="email" class="form-label">Email <small>(optional)</small></label>
```

Do not use placeholder text as a replacement for a label.

## Assistive and helper text

Assistive text sits with the label:

```html
<div class="input-label">
  <label for="reference" class="form-label">Reference</label>
  <small class="form-helper">Assistive text</small>
</div>
```

Helper text sits after the response:

```html
<small class="form-helper">Helper text</small>
```

Use these only when they add useful context, instructions or expected format.

## Placeholder

Placeholder text is temporary supporting text that gives a hint or example of the expected value. It is not the label and disappears as the user enters content.

## Size

Buckholt documents medium/default and small Text inputs. The Code & specs page says to add `.form-control-sm` for the small input, but also marks the small input implementation as **pending**.

Therefore:

- use the default/medium Text input as the established canonical implementation;
- treat `.form-control-sm` as documented but pending rather than inventing missing small-input details;
- keep input heights consistent when grouping form controls on the same page.

## Width

The documentation states that input widths may be fixed to reflect the expected value length or may flex to the containing layout. Use documented Form/Input row layout and existing runtime behaviour rather than adding arbitrary visual widths merely to make fields look balanced.

## States

Buckholt documents:

- **Resting** — visible and interactive but not currently being used; may be empty, show a placeholder or contain a value.
- **Focus** — reached by keyboard or click.
- **Active** — the user is actively typing.
- **Error** — invalid input, missing required input or a system error; requires user intervention before the data can be submitted/saved.
- **Disabled** — unavailable for interaction and not suitable when the value still needs to be interpreted.
- **Read-only** — reviewable but not editable; remains accessible/readable.

Use native input state attributes where documented:

```html
<input type="text" class="form-control" disabled>
<input type="text" class="form-control" readonly>
```

Do not use disabled and read-only interchangeably.

## Error and validation

Use `.is-invalid` on the `.form-control` when showing the documented error state, with `.invalid-feedback` in the `.input`:

```html
<div class="input">
  <div class="input-label">
    <label for="postcode" class="form-label">Postcode</label>
  </div>
  <div class="response text-input">
    <input type="text" class="form-control is-invalid" id="postcode">
  </div>
  <div class="invalid-feedback">Enter a valid postcode.</div>
</div>
```

Validation meaning must not rely on colour alone.

## Input icon

A supporting icon is placed inside `.response.text-input` before the input:

```html
<div class="response text-input">
  <i class="input-icon fa-regular fa-circle-info" aria-hidden="true"></i>
  <input type="text" class="form-control" id="exampleWithIcon">
</div>
```

Choose meaningful icons from `foundations/iconography/catalogue.md`. A decorative/supporting icon should be hidden from assistive technology when its meaning is already supplied by text.

## Input action button

Input action buttons provide one closely related action such as showing a password or opening a date picker.

```html
<div class="response text-input">
  <input type="password" class="form-control" id="password">
  <button type="button" class="input-btn" aria-label="Show password">
    <i class="fa-regular fa-eye" aria-hidden="true"></i>
  </button>
</div>
```

Rules:

- use no more than one input action button inside a Text input;
- do not combine an input action button with a separate input icon in the same Text input;
- give icon-only actions an accessible name;
- use the action only when it is directly related to the field.

## Runtime behaviour

The runtime defines the Buckholt layout and visual treatment for `.input`, `.form-label`, `.form-helper`, `.form-control`, focus/validation states and response content. It includes a minimum width for most `.input` wrappers, but this must work with documented layout components such as Input row rather than being recreated with local CSS.

The runtime also hides helper text for disabled/read-only Text inputs. Follow the actual component structure instead of compensating locally.

## Accessibility

- Use an appropriate native input `type` for the data when known.
- Keep label and input programmatically associated.
- Placeholder is supplementary only.
- Ensure validation feedback is understandable as text.
- Preserve focus styling.
- Use `readonly` for information users can review but must not edit; use `disabled` only when the control is genuinely unavailable.
- The documentation requires the input field boundary to meet the relevant 3:1 non-text contrast expectation.

## Related Buckholt guidance

Read:

- `components/form/`
- `components/input-group/`
- `components/input-row/`
- `foundations/colour/`
- `foundations/typography/`
- `foundations/spacing/`
- `foundations/radius/`
- `foundations/iconography/`

## Agent rules

- Use `.input > .input-label + .response.text-input` as the core composition.
- Use `.form-control` on the native input.
- Do not replace labels with placeholders.
- Keep assistive/helper text in the documented positions.
- Use native `disabled` and `readonly` semantics.
- Use `.is-invalid` plus `.invalid-feedback` for the documented error treatment.
- Use at most one `.input-btn`, and never combine it with an input icon.
- Treat the small variant as documented but pending; do not invent missing behaviour.
- Do not recreate input padding, border, radius, typography, focus or validation styling locally.
