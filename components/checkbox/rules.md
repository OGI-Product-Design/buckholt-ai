# Checkbox

## Purpose

Use Checkbox when users can select zero, one or multiple independent options. Do not use Checkbox for a choice where only one option may be selected; use Radio for mutually exclusive choices.

A Checkbox may be used on its own or as a grouped input. In a group, use a group label to describe the related choices.

## Canonical single Checkbox

```html
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="checkbox-example">
  <label class="form-check-label" for="checkbox-example">
    Checkbox label
  </label>
</div>
```

Keep the native checkbox input and associated `<label>`. The `for` and `id` values must match.

## Checkbox group input

Use the normal Buckholt input composition for a group:

```html
<div class="input">
  <div class="input-label">
    <label for="checkInput-example" class="form-label">Group label</label>
    <small class="form-helper">Assistive text</small>
  </div>

  <div class="response check-input">
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="checkbox-one">
      <label class="form-check-label" for="checkbox-one">Option one</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="checkbox-two">
      <label class="form-check-label" for="checkbox-two">Option two</label>
    </div>
  </div>

  <small class="form-helper">Helper text</small>
  <div class="invalid-feedback">Validation message</div>
</div>
```

Assistive text belongs inside `.input-label` beneath the group label. Helper text follows `.response.check-input`.

Checkbox labels sit to the right of their inputs. Prefer vertically arranged Checkbox groups where possible for readability and scanning.

## States

Buckholt documents three selection states:

- unselected — default;
- selected;
- indeterminate — for a parent/group Checkbox when only some child options are selected.

The documentation examples use `.selected` and `.indeterminate` classes to demonstrate those visual states. Product logic must keep the native checkbox state synchronized with the visual state. The native `checked` property represents selection; JavaScript is required to set `HTMLInputElement.indeterminate` because indeterminate is not an HTML attribute.

Checkbox also documents focus, disabled, read-only and error treatments.

### Disabled

Use native `disabled` semantics on the checkbox. A disabled Checkbox is unavailable for interaction.

### Read-only

HTML does not natively support `readonly` for checkbox inputs. Buckholt documents a read-only visual state using `.state_readonly` and states that scripting is required to prevent changes while leaving the checkbox focusable and part of the form layout.

Do not treat `readonly` alone as sufficient browser behaviour for a checkbox.

### Error

For grouped Checkbox validation, use the Buckholt input-level `.invalid-feedback` message and the documented error treatment rather than inventing a local validation style.

Disabled and read-only Checkbox groups do not require assistive/helper text because users cannot modify the value; provide necessary context through labels or surrounding content instead.

## Content

Use concise, scannable labels. The group label should explain the dimension being chosen; individual Checkbox labels should describe the options themselves.

Do not phrase a Checkbox group as mutually exclusive when more than one option may be chosen.

## JavaScript dependency

The Checkbox Code & specs documentation explicitly identifies `form.js` as a Buckholt JavaScript enhancement dependency. That source file was not supplied in this ingestion batch, so this repository does not invent or reconstruct it.

Use the supplied Buckholt form JavaScript when available for documented enhanced behaviours such as non-native read-only handling and state synchronization. Do not replace those behaviours with speculative Buckholt-specific scripting.

## Composition

When Checkbox is used inside Form, Input row, Dropdown or another Buckholt component, let the parent component control layout and let Checkbox own its native selection semantics and labels.

Read `components/form/`, `components/input-row/` and `components/dropdown/` when composing Checkbox there.

## Agent rules

- Use native `<input type="checkbox">` and a matching `<label>`.
- Use `.form-check`, `.form-check-input` and `.form-check-label` rather than recreating checkbox styling.
- Use `.input > .input-label + .response.check-input` for a labelled group.
- Use Checkbox only for independent/multi-select choices; use Radio for exactly one choice.
- Do not preselect options unless the product requirement provides a real default.
- Use indeterminate only for partial parent/group selection.
- Do not assume `readonly` works natively on checkboxes.
- Do not recreate focus, error, disabled, selection or indeterminate styling with custom CSS.
- Do not invent the missing `form.js`; use the real Buckholt source when it is available.
