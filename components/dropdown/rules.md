# Dropdown

## Purpose

Dropdown presents a predefined list of options for the user to choose from. Buckholt documents three forms:

- standard single-select Dropdown;
- Multiselect Dropdown using checkboxes and Tags;
- Type-ahead Dropdown for narrowing a long list by typing.

Use Dropdown when the available choices are predefined and the number or presentation of options makes an always-visible control less suitable. Keep options simple, concise and easy to scan; do not nest Dropdowns or put decorative imagery inside options.

## Canonical single-select structure

```html
<div class="input">
  <div class="input-label">
    <label for="dropdown-example" class="form-label">Dropdown label</label>
  </div>

  <div class="response dropdown-input">
    <div class="dropdown">
      <button id="dropdown-example"
              class="dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false">
        <span class="dropdown-label">Choose an option…</span>
      </button>

      <ul class="dropdown-menu dropdown-menu-panel"
          role="menu"
          aria-labelledby="dropdown-example">
        <li id="dropdown-option-1"
            class="dropdown-item"
            role="option"
            aria-label="Option 1"
            aria-selected="false"
            tabindex="0">Option 1</li>
      </ul>
    </div>
  </div>

  <div class="invalid-feedback">Validation message</div>
</div>
```

The `.input` structure, label, assistive/helper text and validation follow the normal Buckholt form-input model. Use unique IDs and keep the menu's `aria-labelledby` tied to its trigger.

## Single select behaviour

Use a standard Dropdown when the user chooses one option from a predefined list.

Selecting an option closes the menu, replaces the placeholder/label with the selected option text and marks the option active/selected so it can be found again when the Dropdown is reopened.

Option text should be short, clear and factual. Present options alphabetically where that supports scanning. Avoid multiple lines of option text.

## Multiselect

Use Multiselect when users may choose multiple predefined options, such as filtering or sorting by several criteria. Each selectable option contains a native Checkbox.

Canonical structure uses the same `.dropdown` and menu but keeps the menu open with `data-bs-auto-close="false"` and places `.form-check-input` plus `.form-check-label` inside each `.dropdown-item`.

Selected options are represented as Buckholt Tags inside the Dropdown field. The supplied Dropdown JavaScript creates and removes `.tag-set` and `.tag.tag-dismissible.expressive-light` elements from the native selected state.

Selected options are moved to the top of the menu in alphanumeric order when reopened.

### Select all

Buckholt documents an optional parent Checkbox as the first option. The supplied JavaScript identifies it by an item ID ending in `-0` and maintains unselected, selected and indeterminate states based on the remaining options.

Use neutral text such as “All” or a clear noun phrase such as “All permissions”; do not phrase the parent option as an action.

### Collapsing tags

For a Multiselect where many selections would create too many Tags, add data attributes to `.dropdown`:

```html
<div class="dropdown"
     data-collapse-threshold="2"
     data-summary-label="selected">
```

`data-collapse-threshold` defines when individual Tags collapse to one summary Tag. `data-summary-label` customises the word after the count, for example `5 chosen`.

Use this when the expected number of selections would otherwise overwhelm the field.

## Type-ahead

Use Type-ahead to narrow a long predefined list by typing.

The trigger becomes a text input:

```html
<input type="text"
       class="dropdown-toggle"
       id="dropdown-country"
       placeholder="Type to search"
       data-bs-toggle="dropdown"
       aria-expanded="false"
       value="">
<button type="button" class="input-btn input-clear" aria-label="Clear"></button>
```

The supplied JavaScript filters options, keeps matching items visible, can autocomplete a matching prefix, supports keyboard confirmation, shows the clear action when text exists and restores the full list when cleared.

## Supporting text

Use `<small class="form-helper">` for both assistive and helper text:

- assistive text belongs inside `.input-label`, beneath the label;
- helper text follows `.response.dropdown-input`.

Placeholder text is optional and supplementary. Do not place crucial instructions only in the placeholder.

## Size

Buckholt documents medium/default and small heights, with `.dropdown-sm` named for the small variant. However, the Code & specs page explicitly marks the small Dropdown implementation as pending. Do not invent missing small-Dropdown behaviour or styling.

## States

Dropdown documents focus, error, disabled and read-only states.

### Disabled

Use native `disabled` on `.dropdown-toggle`. Let Buckholt runtime styling represent the disabled state.

### Error

Use the documented Buckholt validation treatment and `.invalid-feedback`. Do not create a custom error border/message system.

### Read-only

Follow the documented Buckholt read-only state when source markup establishes it. Do not convert a Dropdown into a fake disabled control or invent custom interaction rules.

## Accessibility and interaction

Dropdown options use `role="option"`, `aria-selected` and `tabindex="0"` in the canonical markup. The trigger uses `aria-expanded`. Preserve those states and keep them synchronized with the actual UI.

Buckholt documents keyboard access through `Tab` and option navigation using arrow keys, with selection via Enter/Space. The supplied JavaScript explicitly handles Enter/Space on menu items and the Type-ahead input.

## JavaScript dependencies

Dropdown requires both:

1. Bootstrap 5.1.3 bundle for the underlying Dropdown behaviour;
2. Buckholt's additional `dropdown.js` enhancement script for Buckholt-specific selection, Multiselect Tags, Select-all/indeterminate state, collapsed Tags, menu positioning and Type-ahead behaviour.

The supplied source is stored at `components/dropdown/dropdown.js`. Load it after Bootstrap:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="components/dropdown/dropdown.js"></script>
```

Do not omit `dropdown.js` and then recreate its documented behaviour ad hoc in page code.

## Composition

Read `components/checkbox/` for Multiselect Checkbox semantics, `components/tag/` for generated selected Tags, and Form/Input-row guidance when Dropdown is composed inside larger forms.

## Agent rules

- Use `.input > .input-label + .response.dropdown-input` for a labelled Dropdown.
- Use `.dropdown`, `.dropdown-toggle`, `.dropdown-menu.dropdown-menu-panel` and `.dropdown-item` as documented.
- Keep IDs, `aria-labelledby`, `aria-expanded` and `aria-selected` aligned.
- Use single select for one predefined choice, Multiselect for multiple choices and Type-ahead for long filterable lists.
- Use native Checkbox inputs inside Multiselect options.
- Load the supplied `components/dropdown/dropdown.js` after Bootstrap when implementing Buckholt Dropdown.
- Do not invent a replacement Tag system, Select-all algorithm, Type-ahead filter or menu-positioning script.
- Do not promote `.dropdown-sm` into completed canonical behaviour while the documentation marks it pending.
- Do not recreate Dropdown visual states, borders, spacing, menus or Tags with local CSS.
