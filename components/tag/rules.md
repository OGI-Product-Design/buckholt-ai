# Tag

## Verification

Source-audited against the Buckholt Tag Usage, Style and Code & specs HTML pages supplied on 7 September 2026. Use `examples.html` for exact DOM structure.

## Purpose

Tags display compact labels, statuses or selectable/dismissible values. Buckholt documents read-only, dismissible, selectable, status, small, icon, expressive and grouped Tag forms.

## Canonical markup

`examples.html` preserves the exact Code & specs variations. Important source structures include:

- base `.tag > .tag-label`;
- `.tag-dismissible` with `.btn-close.btn-close-sm`;
- `.tag-selectable` as a `<span>` with `type="option"` and `aria-selected`, containing a native Radio or Checkbox plus `.tag-label`;
- `.tag-status-*` for info/success/warning/error;
- `.tag-sm` for small;
- `.icon` wrapper where Code & specs explicitly shows an icon;
- `.expressive-light` with secondary/tertiary/quaternary palette modifiers;
- `.tag-set` for grouped Tags.

Do not replace the documented selectable span/input structure with Buttons or another custom selection API.

## Status and icons

When using a documented status variation, preserve its Tag/status classes and source icon structure. The visible label must still communicate the meaning; colour/icon alone should not be the only signal.

## Agent rules

- `examples.html` is canonical for Tag DOM.
- Preserve native Radio/Checkbox controls in selectable Tags.
- Use `.btn-close.btn-close-sm`, `.icon`, status modifiers, expressive modifiers and `.tag-set` only as documented.
- Do not invent alternate Tag selection, dismissal or grouping markup.
- Let `buckholt.css` supply Tag sizing, spacing, states and colours.
