# Buckholt AI instructions

## Purpose

Use the Buckholt design system accurately when building UI.

## Core rule

**Build with Buckholt. Do not imitate Buckholt.**

## Source hierarchy

1. **Buckholt documentation website** — primary source of truth for intended Digital Product design-system behaviour, including usage, hierarchy, accessibility, canonical markup, scales and design-system meaning.
2. `css/buckholt.css` — current runtime implementation. Use real selectors, variables, states and browser behaviour. Undocumented runtime extras are implementation flexibility, not automatically canonical Buckholt guidance.
3. `css/buckholt-ai-fixes.css` — verified compatibility corrections only. Load after the runtime.
4. `foundations/<foundation>/` — shared design-system guidance.
5. `components/<component>/rules.md` and `examples.html` — component-specific guidance and canonical examples.
6. `discrepancies/known-issues.md` — significant verified documentation/runtime differences.

Old SCSS, token maps, screenshots, Figma and previous interpreted AI specifications are **not** implementation sources unless explicitly requested for investigation.

## Before implementing

- Read the relevant foundation files.
- Read the requested component's `rules.md` and `examples.html`.
- Follow documented Buckholt intent first.
- Use the real classes and variables in `css/buckholt.css` rather than recreating visual styling.
- Load `css/buckholt-ai-fixes.css` after the runtime.
- Use supplied component scripts when the documented behaviour needs them.
- Do not promote undocumented CSS helpers into design-system rules.
- If Buckholt does not establish a variant, state or behaviour, report the gap instead of guessing.

## Foundations

- Colour: `foundations/colour/`
- Iconography: `foundations/iconography/`
- Radius: `foundations/radius/rules.md`
- Shadows: `foundations/shadows/rules.md`
- Spacing: `foundations/spacing/rules.md`
- Typography: `foundations/typography/`

Use Buckholt semantic roles and documented type-set classes. Keep semantic HTML hierarchy separate from visual type class. Do not treat generic Bootstrap `.fs-*`, heading helpers or unrelated utilities as canonical Buckholt typography.

## Component coverage

Supported component folders:

`accordion`, `alert`, `avatar`, `breadcrumb`, `button`, `card`, `checkbox`, `collapse`, `dropdown`, `form`, `heading-attachment`, `icon-block`, `input-group`, `input-row`, `key-value-pair`, `link`, `list`, `lookup`, `menu`, `menu-button`, `modal`, `multi-field-input`, `nested-inputs`, `number-input`, `page-navigation`, `progress-bar`, `radio`, `response-button`, `select`, `slider`, `summary-meta`, `switch`, `table`, `tabs`, `tag`, `text-area`, `text-block`, `text-input`, `toast`, `tooltip`, `versa-tile`.

Always read the component folder rather than relying on this file for detailed markup.

### Important cross-component distinctions

- **Page navigation** uses real links to separate sibling pages. **Tabs** switch content in place using Bootstrap pill behaviour.
- **Response button** uses native radios for single select and native checkboxes for the documented multi-select variant.
- **Select** is a native `<select>`. Buckholt's read-only treatment uses `.readonly` plus `disabled`.
- **Switch** has default, small and always-active treatments. Always-active means a permanently/enforced on condition, not simply disabled.
- **Slider** is the documented single-value range + number-input pattern; do not invent the two-handle range variant marked as coming soon.
- **Text area** uses the shared Form behaviour for character counting when the counter is present.
- **Table** is currently provisional/WIP; preserve supplied semantics and do not invent data-grid features.

## Runtime dependencies

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/buckholt.css">
<link rel="stylesheet" href="css/buckholt-ai-fixes.css">
```

For Bootstrap-driven Buckholt behaviours such as tooltips, dropdown menus, alerts, accordions, modals, tabs and toasts:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
```

Documented Buckholt behaviour scripts currently stored in the repo:

```html
<script src="components/dropdown/dropdown.js"></script>
<script src="components/form/form.js"></script>
<script src="components/tabs/tabs.js"></script>
```

Use `dropdown.js` for the documented Dropdown enhancement, `form.js` for shared Form behaviours including Text area counting, and `tabs.js` for overflow scroll controls. Do not independently recreate those behaviours.

## Accessibility and native semantics

Prefer native HTML controls and preserve documented ARIA relationships. Match every `label[for]` to its control ID, keep current/selected state singular where required, and use genuine disabled/checked/readonly semantics where the component documents them.

Icon-only controls require an accessible name and the documented Tooltip treatment where Buckholt calls for one. Colour alone must not carry meaning.

## Custom CSS

Custom CSS may be used for page/demo layout only when necessary. It must not recreate or override Buckholt component styling simply to make an implementation look right. Verified runtime corrections belong in `css/buckholt-ai-fixes.css`, not a page-specific stylesheet.

## Evidence discipline

A class is not missing merely because no standalone `.class {}` rule exists; check compound, descendant and pseudo-selectors. Extra runtime CSS is not a discrepancy by itself. Only flag a difference when documentation and runtime materially disagree in a way that could mislead implementation.