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
5. `patterns/<pattern>/` — composition guidance for how Buckholt pages, forms and recurring interactions are assembled from components.
6. `components/<component>/rules.md` and `examples.html` — component-specific guidance and canonical examples.
7. `discrepancies/known-issues.md` — significant verified documentation/runtime differences.

Old SCSS, token maps, screenshots, Figma and previous interpreted AI specifications are **not** implementation sources unless explicitly requested for investigation.

## Before implementing

For an isolated component:

- Read the relevant foundation files.
- Read the requested component's `rules.md` and `examples.html`.
- Follow documented Buckholt intent first.
- Use the real classes and variables in `css/buckholt.css` rather than recreating visual styling.
- Load `css/buckholt-ai-fixes.css` after the runtime.
- Use supplied component scripts when the documented behaviour needs them.

For a complete page or substantial page section:

1. Read `patterns/page-layout/rules.md` **before selecting components**.
2. Identify required page regions and choose the closest documented Buckholt layout.
3. Structure Main using Page body → Frame → Pane → Panel.
4. Use Bootstrap `.container`, `.row` and `.col-*` only for the horizontal/responsive grid responsibility documented by Buckholt.
5. Read any relevant higher-level pattern guidance (`forms`, `input-rows`, `lookup`, `common-actions`).
6. Read the relevant foundations.
7. Read every component folder used in the page.
8. Check `discrepancies/known-issues.md` where relevant.

Do not begin a full page by placing isolated components into arbitrary wrappers. Establish Buckholt's page structure, grouping and spacing first, then compose components inside it.

Do not promote undocumented CSS helpers into design-system rules. If Buckholt does not establish a variant, state, behaviour or page structure, report the gap instead of guessing.

## Foundations

- Colour: `foundations/colour/`
- Iconography: `foundations/iconography/`
- Radius: `foundations/radius/rules.md`
- Shadows: `foundations/shadows/rules.md`
- Spacing: `foundations/spacing/rules.md`
- Typography: `foundations/typography/`

Use Buckholt semantic roles and documented type-set classes. Keep semantic HTML hierarchy separate from visual type class. Do not treat generic Bootstrap `.fs-*`, heading helpers or unrelated utilities as canonical Buckholt typography.

## Patterns

Patterns teach composition. They **do not create a separate styling or runtime layer** and do not override component/foundation rules.

### Page layout — `patterns/page-layout/`

Read this before building any complete Buckholt page.

Buckholt documents eight CSS-Grid base layouts built from these regions:

- Header — optional
- Sidebar / Aside — optional
- Main — **required**
- Footer — optional

Inside Main, use the documented hierarchy:

```text
Page body
└─ Frame
   └─ Pane
      └─ Panel
         └─ Components & patterns
```

Responsibilities and spacing:

- `.page-panel` groups directly related components/patterns; no padding; **2rem / 32px gap** between items.
- `.page-pane` groups related Panels; no padding; **4rem / 64px gap** between Panels.
- `.page-frame` groups one or more Panes; **4rem / 64px padding** and **4rem / 64px gap** between Panes; may include one optional frame header.
- `.page-body` is the top-level structured content wrapper inside Main.

Bootstrap and Buckholt have separate responsibilities:

- Bootstrap `.container`, `.row`, `.col-*` → width, horizontal structure, responsive columns/breakpoints.
- Buckholt Frame / Pane / Panel → content hierarchy, grouping, vertical rhythm and visual separation.

Use semantic `<header>`, `<aside>`, `<main>` and `<footer>` regions where they correspond to the selected layout. Do not create optional regions merely because a template supports them.

### Forms — `patterns/forms/`

Read this before creating a complete form experience.

- Default to top-aligned labels; left-aligned labels are not currently supported.
- Default to stacked fields unless another documented pattern clearly improves usability.
- Simple forms that are mostly required: label only optional fields.
- Complex forms that are mostly optional: label only required fields.
- Standard in-page form actions normally place Primary first and left aligned.
- Progressive/wizard/Modal/side-panel contexts may right-align actions with Primary after Secondary/Ghost.
- Avoid submit actions at the top of dedicated-page forms.
- Do not put Accordion forms inside Modals.
- Modal forms are best suited to fewer than five inputs; side-panel forms are recommended for more than five inputs.

### Input rows — `patterns/input-rows/`

Use only when genuinely related fields are easier to complete side by side.

- Default to stacked inputs unless inline placement clearly improves usability.
- Use Bootstrap column/breakpoint classes for proportions and responsive stacking.
- Each child remains an independent Buckholt input with its own label/helper/validation.
- Do not apply one row-level validation state to unrelated child errors.

### Lookup — `patterns/lookup/`

Use for known-value retrieval, not exploratory Search.

- Appropriate when the user knows an identifier and a reliable source can return a small, relevant result set.
- Flow is data input → result/refinement → summary/confirmation as supported by the product.
- The documented summary phase replaces the entry Lookup rather than duplicating it.
- Reuse the Lookup component, inputs, Buttons, Links and Versa-tile rather than creating lookup-specific local styling.

### Common actions — `patterns/common-actions/`

Use when choosing standard labels and icons for recurring actions such as Add, Copy, Delete, Download, Edit, External link, Logout, Save, Search, Settings and Upload.

- Keep documented action/icon mappings consistent.
- Do not repurpose recognised common-action icons for unrelated meanings.
- Delete/removal uses documented danger treatment.
- Common-action mapping does not decide Button hierarchy; use Button/Menu guidance for Primary/Secondary/Ghost/Danger.
- Icon-only controls still require accessible naming and documented Tooltip treatment.

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

For complete pages, do not use custom spacing wrappers as a substitute for the documented Page body / Frame / Pane / Panel hierarchy.

## Evidence discipline

A class is not missing merely because no standalone `.class {}` rule exists; check compound, descendant and pseudo-selectors. Extra runtime CSS is not a discrepancy by itself. Only flag a difference when documentation and runtime materially disagree in a way that could mislead implementation.