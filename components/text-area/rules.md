# Text area

## Purpose

Use Text area for longer free-form text that may span multiple lines. Use Text input for short single-line values.

## Canonical structure

```html
<div class="input">
  <div class="input-label">
    <label for="exampleTextarea" class="form-label">Text area label</label>
    <small class="form-helper">Assistive text</small>
  </div>

  <div class="response textarea-input">
    <textarea class="form-control" id="exampleTextarea" rows="3" placeholder="Placeholder" maxlength="250"></textarea>
    <div class="counter"><span class="counting">0</span> / 250</div>
  </div>

  <small class="form-helper">Helper text</small>
  <div class="invalid-feedback feedback-icon">Validation message</div>
</div>
```

Use `.input` as the field wrapper and `.response.textarea-input` to identify the response type. The textarea itself uses `.form-control`.

## Character limit and counter

Buckholt documents a character counter inside `.response.textarea-input` using `.counter` and `.counting`. The visible maximum must correspond to the textarea's `maxlength` value.

The supplied shared `components/form/form.js` contains Buckholt's Text area character-count behaviour. Use that script rather than creating a different counter implementation.

## Assistive/helper text

Assistive text belongs beneath the label inside `.input-label`. Helper text follows the response. Validation feedback takes priority over helper text when an error is shown.

## States

Use the documented `.form-control` input states. Validation uses the component's error treatment plus `.invalid-feedback.feedback-icon`.

For disabled/read-only Text areas, use the native semantics documented by the shared Form/input system and avoid helper copy that implies the value can be edited.

## Content

Use a clear label that explains what kind of longer response is required. Use placeholder text only as supplementary guidance; do not use it in place of a visible label.

## Agent rules

- Use a real `<textarea>`.
- Use `.response.textarea-input` and `.form-control`.
- Match label `for` to textarea `id`.
- Use native `maxlength` when a maximum is required.
- If a counter is shown, use `.counter > .counting` and keep it synchronized through the supplied `form.js`.
- Use `.invalid-feedback.feedback-icon` for documented validation markup.
- Do not recreate Text area borders, focus, disabled, readonly or counter styling with local CSS.