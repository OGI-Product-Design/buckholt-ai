# Buckholt AI instructions

## Purpose

Use the Buckholt design system accurately when building UI.

## Core rule

**Build with Buckholt. Do not imitate Buckholt.**

## Mandatory canonical-markup rule

Read `CANONICAL-MARKUP.md` before implementing or modifying component markup.

When Buckholt Code & specs provides HTML for the exact component or variation, **preserve that DOM structure exactly**. Do not improve, normalize or reinterpret it. Do not add wrappers or classes borrowed from another component. Do not substitute a documented icon because another catalogue/convention suggests something different.

Component-specific Code & specs markup outranks generic cross-component conventions. For example, if Page navigation places `<i class="...">` directly inside `.nav-link`, do not wrap it in `<span class="icon">` simply because Link or another component uses that wrapper.

`examples.html` may clean indentation only; documented hierarchy, classes, element order, attributes and icon placement must remain source-faithful. If no exact markup evidence exists for a variation, report the gap instead of inventing canonical markup.

## Source hierarchy

1. **Buckholt documentation website** — primary source of truth for intended Digital Product design-system behaviour, including usage, hierarchy, accessibility, canonical markup, scales and design-system meaning.
2. `css/buckholt.css` — current runtime implementation. Use real selectors, variables, states and browser behaviour. Undocumented runtime extras are implementation flexibility, not automatically canonical Buckholt guidance.
3. `css/buckholt-ai-fixes.css` — verified compatibility corrections only. Load after the runtime.
4. `foundations/<foundation>/` — shared design-system guidance.
5. `patterns/<pattern>/` — composition guidance for how Buckholt pages, forms and recurring interactions are assembled from components.
6. `components/<component>/rules.md` and `examples.html` — component-specific guidance and canonical examples.
7. `discrepancies/known-issues.md` — significant verified documentation/runtime differences.
8. `verification/` — source and runtime verification status. Read `verification/runtime-verification-framework.md` before changing runtime status or adding compatibility fixes.

Old SCSS, token maps, screenshots, Figma and previous interpreted AI specifications are **not** implementation sources unless explicitly requested for investigation.

## Before implementing

For an isolated component:

- Read `CANONICAL-MARKUP.md`.
- Read the relevant foundation files.
- Read the requested component's `rules.md` and `examples.html`.
- Follow documented Buckholt intent first.
- Use the real classes and variables in `css/buckholt.css` rather than recreating visual styling.
- Load `css/buckholt-ai-fixes.css` after the runtime.
- Use supplied component scripts when the documented behaviour needs them.

For a complete page or substantial page section:

1. Read `CANONICAL-MARKUP.md`.
2. Read `patterns/page-layout/rules.md` **before selecting components**.
3. Identify required page regions and choose the closest documented Buckholt layout.
4. Structure Main using Page body → Frame → Pane → Panel.
5. Use Bootstrap `.container`, `.row` and `.col-*` only for the horizontal/responsive grid responsibility documented by Buckholt.
6. Read any relevant higher-level pattern guidance (`forms`, `input-rows`, `lookup`, `common-actions`).
7. Read the relevant foundations.
8. Read every component folder used in the page.
9. Check `discrepancies/known-issues.md` where relevant.

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
- **Table** is source-partial because complete Code & specs HTML was not supplied; preserve only supported semantics and do not invent data-grid features.

## Runtime dependencies

### CSS — verified

**Do not load a separate Bootstrap stylesheet.** Styles load in this order:

```html
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/buckholt.css">
<link rel="stylesheet" href="css/buckholt-ai-fixes.css">
```

`css/buckholt.css` is **not an overlay on Bootstrap. It is a complete, self-contained
Bootstrap build** with Buckholt as the theme: it carries its own reboot, containers, grid
(85 `.col-*` rules), spacing utilities (140 rules — more than Bootstrap ships),
`.visually-hidden`, and its own version of every component Buckholt documents. It is built
on Bootstrap **5.3** (`[data-bs-theme=buckholt]`, `--bs-emphasis-color`, `--bs-focus-ring`).

This matches the live Buckholt documentation site, whose `<head>` comments the Bootstrap
stylesheet out and loads only its own compiled CSS.

Loading `bootstrap.min.css` as well adds a second, older copy of the same framework that
**overrides Buckholt**: it replaced Buckholt's table text colour with Bootstrap's, imposed
Bootstrap's 3.8px radius on modal corners, added a competing SVG cross to every close
control, and pushed a redundant 24px indent into every `.form-check`. Nine of the fourteen
corrections that used to sit in `css/buckholt-ai-fixes.css` existed only to undo that
damage; they were deleted when the stylesheet was removed.

### JavaScript — required, version not yet verified

Bootstrap JavaScript is a **separate question from CSS and is still required.** Ten
components carry `data-bs-*` hooks and depend on it: Accordion, Alert (dismiss),
Breadcrumb (tooltip), Collapse, Dropdown, Menu button, Modal, Tabs, Toast, Tooltip. The
other 31 components need no Bootstrap JavaScript at all.

> **Unverified:** `buckholt.css` is a Bootstrap 5.3 build, but the bundle below is 5.1.3.
> The correct JS version has not been confirmed against the documentation site. Do not
> change it on assumption — verify first, the same way the CSS contract was verified.

For those ten components:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
```

`components/form/form.js` depends on jQuery. When Form-script enhancements are used, load jQuery before the Buckholt component scripts:

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="components/dropdown/dropdown.js"></script>
<script src="components/form/form.js"></script>
<script src="components/tabs/tabs.js"></script>
```

Use `dropdown.js` for the documented Dropdown enhancement, `form.js` for shared Form behaviours including Text area counting, Number input step controls and Checkbox/Radio read-only handling, and `tabs.js` for overflow scroll controls. Do not independently recreate those behaviours.

## Runtime verification

Source verification and runtime verification are separate gates.

Before marking a component `RUNTIME VERIFIED`, follow `verification/runtime-verification-framework.md` and update `verification/runtime-status.md`. Runtime mismatches must be classified before being corrected. Do not rewrite source-verified HTML to compensate for runtime defects.

Verified compatibility corrections belong in `css/buckholt-ai-fixes.css` and require a corresponding entry in `discrepancies/known-issues.md`. Do not edit `css/buckholt.css` to make a test page look correct.

## Accessibility and native semantics

Prefer native HTML controls and preserve documented ARIA relationships. Match every `label[for]` to its control ID, keep current/selected state singular where required, and use genuine disabled/checked/readonly semantics where the component documents them.

Do not silently add accessibility attributes to repository canonical examples when they are absent from the documented Code & specs example. Application-level accessibility additions may be appropriate, but keep them distinct from source-exact Buckholt markup.

Icon-only controls require an accessible name and the documented Tooltip treatment where Buckholt calls for one. Colour alone must not carry meaning.

## Custom CSS

Custom CSS may be used for page/demo layout only when necessary. It must not recreate or override Buckholt component styling simply to make an implementation look right. Verified runtime corrections belong in `css/buckholt-ai-fixes.css`, not a page-specific stylesheet.

For complete pages, do not use custom spacing wrappers as a substitute for the documented Page body / Frame / Pane / Panel hierarchy.

## Evidence discipline

A class is not missing merely because no standalone `.class {}` rule exists; check compound, descendant and pseudo-selectors. Extra runtime CSS is not a discrepancy by itself. Only flag a difference when documentation and runtime materially disagree in a way that could mislead implementation.

For markup, exact component-specific Code & specs evidence is authoritative. Never infer a canonical DOM structure from another component's conventions.