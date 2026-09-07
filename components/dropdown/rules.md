# Dropdown

## Verification

Source-verified against the Buckholt Dropdown Usage, Style and Code & specs HTML pages supplied on 7 September 2026. `examples.html` is the canonical source for exact Dropdown DOM structure.

## Purpose

Dropdown presents a predefined list of options. Buckholt documents standard single select, Multiselect using checkboxes and Tags, and Type-ahead for narrowing a long predefined list.

Use Dropdown when choices are predefined and an always-visible control is less suitable. Keep option text concise and easy to scan; do not nest Dropdowns or use decorative imagery in options.

## Canonical single select

Do not rebuild the DOM from this prose. The exact base structure is in `examples.html` and includes:

```text
.input
├─ .input-label
│  └─ label.form-label
└─ .response.dropdown-input
   └─ .dropdown
      ├─ button.dropdown-toggle
      │  └─ .dropdown-label
      └─ ul.dropdown-menu.dropdown-menu-panel
         └─ li.dropdown-item[role="option"]
```

Preserve the exact source attributes, including IDs, `aria-expanded`, `aria-labelledby`, `aria-selected` and `tabindex`, when using a source example as canonical evidence. Do not add validation markup to the base example unless that specific Code & specs variation contains it.

## Assistive/helper text

Buckholt documents assistive text inside `.input-label` using `<small class="form-helper">`, and helper text after `.response.dropdown-input`. Use the exact variation from `examples.html`.

## Disabled and read-only

The documented disabled variation uses native `disabled` on `.dropdown-toggle`.

The documented read-only variation uses:

```text
button.dropdown-toggle.readonly[disabled]
```

Preserve that documented combination rather than inventing a different read-only mechanism.

## Multiselect

The Code & specs source keeps the menu open with `data-bs-auto-close="false"` and places native Checkbox inputs and labels directly inside each `.dropdown-item`.

Selected options are represented as Buckholt Tags by the supplied Dropdown enhancement script. The Code & specs page separately demonstrates selected Tags, Select all, collapsible Tags and their data attributes. Use those exact snippets from `examples.html`; do not expand the documented `...` placeholders by inference.

## Type-ahead

The Type-ahead source changes the trigger to an `<input type="text" class="dropdown-toggle">` and places a sibling `.input-btn.input-clear` before the dropdown menu. Use the exact source structure and options from `examples.html`.

## Size

Buckholt documentation mentions medium/default and a small treatment, but Code & specs marks the small Dropdown implementation as pending. Do not invent a completed `.dropdown-sm` canonical implementation.

## JavaScript dependencies

Dropdown requires Bootstrap's Dropdown behaviour plus the supplied `components/dropdown/dropdown.js` for Buckholt-specific selection ordering, Tags, Select all/indeterminate state, collapsed Tags, menu positioning and Type-ahead behaviour.

Load Bootstrap before the Buckholt enhancement script. Do not recreate those behaviours in page-specific code.

## Agent rules

- Use `examples.html` as the exact DOM authority.
- Preserve `.input`, `.response.dropdown-input`, `.dropdown`, `.dropdown-toggle`, `.dropdown-menu.dropdown-menu-panel` and `.dropdown-item` only as shown by the relevant source variation.
- Do not add `.invalid-feedback` to the base canonical example; validation belongs only where the source/child input rules establish it.
- Preserve native Checkbox markup in Multiselect.
- Preserve `.readonly` plus `disabled` for the documented read-only Dropdown variation.
- Preserve source `...` placeholders instead of filling them in by inference.
- Load the supplied Dropdown JavaScript after Bootstrap when the documented enhanced behaviour is required.
- Do not promote pending small-Dropdown behaviour into canonical guidance.
- Do not recreate Dropdown visual or interaction behaviour with local CSS/JS.
