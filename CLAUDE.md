# Buckholt AI instructions

## Purpose

Use the Buckholt design system accurately when building UI.

## Source hierarchy

1. **Buckholt documentation website** — primary source of truth for intended Digital Product design-system behaviour, including usage, hierarchy, accessibility, canonical markup, scales and design-system meaning.
2. `css/buckholt.css` — current runtime implementation. Use its real selectors, variables, states and browser behaviour. It may also contain additional helpers or values added when Buckholt was used to build the company website; those extras provide flexibility but do not automatically become canonical Buckholt guidance.
3. `foundations/<foundation>/` — shared design-system guidance extracted from the documentation and checked against runtime CSS where useful.
4. `components/<component>/rules.md` — component guidance rebuilt from documentation plus runtime implementation evidence.
5. `components/<component>/examples.html` — verified canonical markup examples.
6. `discrepancies/known-issues.md` — only significant documentation/runtime differences that could mislead implementation.

Old SCSS, old token maps, screenshots, Figma and previous interpreted AI specifications are **not** implementation sources unless explicitly requested for investigation.

## Core rule

**Build with Buckholt. Do not imitate Buckholt.**

Before implementing Buckholt UI:

- read the relevant foundation files when the component depends on colour, typography, spacing, iconography, radius, shadows or other shared rules;
- read `components/<component>/rules.md` and `examples.html` for the component;
- follow the documented Buckholt intent first;
- use the real runtime classes and variables from `css/buckholt.css` to implement that intent accurately;
- do not promote undocumented runtime extras into Buckholt design guidance simply because they exist in CSS;
- do not recreate component styling with custom CSS where Buckholt already provides it.

## Evidence discipline

The documentation defines intended Buckholt behaviour. The CSS shows what the current implementation can render. If the CSS contains extra website-specific helpers, they may be used when appropriate but should be treated as implementation flexibility rather than new design-system rules.

Only flag a documentation/runtime difference when it materially affects the requested Buckholt implementation.

## Foundations

### Colour
Read `foundations/colour/` before choosing or changing colours.

### Iconography
Read `foundations/iconography/rules.md` and `foundations/iconography/catalogue.md` before choosing an icon. Use the exact Buckholt mapping when one exists.

### Radius
Read `foundations/radius/rules.md` before adding or changing border radius. Prefer the documented scale and the radius already applied by the component. Additional runtime values can be used where an existing Buckholt implementation requires them.

### Shadows
Read `foundations/shadows/rules.md` before adding elevation. Use documented tokens/classes, keep elevation purposeful, and map feedback shadows to the relevant state.

### Spacing
Read `foundations/spacing/rules.md` before introducing margins, padding or gaps. Prefer Buckholt spacing tokens, and do not alter a component's internal spacing before reading its own guidance.

### Typography
Read `foundations/typography/rules.md` and `foundations/typography/type-sets.md`.

Use Buckholt's `Proxima-soft, Arial, sans-serif` stack through the runtime. Choose typography by documented content role, keep semantic HTML hierarchy separate from visual type class, and prefer Buckholt classes such as `.display-*`, `.headline-*`, `.title-*`, `.body-*`, `.support-*`, `.action-*`, `.label-*`, `.key-*` and `.value-*` where documented. Do not treat Bootstrap `.display-*`, `.fs-*` or generic heading helpers as canonical Buckholt typography.

## Custom CSS

Custom CSS may be used for page/demo layout only when necessary. It must not recreate or override Buckholt component styling simply to make an implementation look right.

## Runtime dependencies

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/buckholt.css">
```

For Bootstrap-driven Buckholt behaviour such as tooltips, dropdown menus, alerts, accordions, modals and toasts, also load:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
```

## Current component coverage

### Accordion
Read `components/accordion/rules.md`, `components/accordion/examples.html` and Text block guidance. Use the documented Bootstrap accordion structure, keep IDs/ARIA aligned, use `.accordion-lg` only for the standalone large form, and use Bootstrap collapse rather than custom show/hide scripting.

### Alert
Read `components/alert/rules.md`, `components/alert/examples.html` and relevant Colour/Iconography/Button/Link guidance. Alert is local nondisruptive feedback; use `.alert-info`, `.alert-success`, `.alert-warning` or `.alert-error`, keep `.alert-message` required, and make dismissal available only when appropriate.

### Avatar
Read `components/avatar/rules.md`, `components/avatar/examples.html`, Colour and Iconography guidance. Use one representation (`.avatar-img`, `.avatar-initials` or `.avatar-icon`), the documented sizes/palettes, and expose the real accessible identity in surrounding UI when identity matters.

### Breadcrumb
Read `components/breadcrumb/rules.md`, `components/breadcrumb/examples.html`, plus Menu/Menu button for overflow. Breadcrumb is secondary navigation. Preserve `<nav aria-label="breadcrumb">`, semantic list markup, `aria-current="page"`, generated dividers and the documented overflow approach.

### Button
Read `components/button/rules.md` and `components/button/examples.html` plus relevant foundations. Preserve `.button-label` where documented, treat danger as a modifier, use accessible naming/tooltips for icon-only buttons, and consult `discrepancies/known-issues.md` for the verified Bootstrap mouse-focus fall-through.

### Card
Read `components/card/rules.md` and `components/card/examples.html`. Use documented Card structures/modifiers, reuse nested Buckholt components, and do not put competing interactive CTAs inside a whole-card navigation link.

### Form
Read `components/form/rules.md`, `components/form/examples.html`, `discrepancies/known-issues.md`, and every child-control component used inside the Form.

Rules:
- use a real `<form class="form">` when content is a form;
- optional introductory/section content uses Text block;
- place controls inside one or more `.form-body` sections;
- reuse documented Buckholt controls rather than inventing form-field markup;
- place completion/exit actions at the bottom and reuse Button/Link;
- the source conflicts between `.form-actions` in rendered examples and `.form-buttons` in explanatory docs/runtime; use `.form-buttons` for runtime-correct Buckholt behaviour until upstream is reconciled;
- let individual controls own validation, disabled/read-only and focus/error states;
- do not recreate Form width/gaps/action spacing locally.

### Heading attachment
Read `components/heading-attachment/rules.md`, `components/heading-attachment/examples.html` and Text block. Use `.heading` and `.heading-content`, keep the heading primary, and attach one compact directly related Buckholt component rather than an ad-hoc toolbar.

### Icon block
Read `components/icon-block/rules.md`, `components/icon-block/examples.html` and Iconography/Colour/Radius foundations. Use `.icon-block` plus documented size/expressive modifiers and exact icon mappings; follow Text block composition rules when nested there.

### Input group
Read `components/input-group/rules.md`, `components/input-group/examples.html` and the nested input component.

Rules:
- use `.input-group` around `.response` plus addons/actions;
- use `.input-group-text` before/after `.response` for documented start/end addons;
- keep the canonical input component markup inside `.response`;
- use `.btn.btn-response` for the documented grouped response-action pattern, not `.input-btn`;
- `.input-btn` belongs inside a Text input and is a different pattern;
- let the child input own validation, disabled/read-only and other states;
- do not promote runtime `.input-group-sm`/`.input-group-lg` into Buckholt design guidance without documentation support;
- do not recreate connected borders, radii or spacing locally.

### Input row
Read `components/input-row/rules.md`, `components/input-row/examples.html` and each child input component.

Rules:
- use `.row.input-row` as the outer structure;
- put each complete input component inside a Bootstrap `.col`;
- use `.col` for equal widths or documented `.col-*`/responsive grid classes for intentional ratios;
- group only genuinely related fields;
- let child controls own label, state, validation, colour and typography;
- do not recreate row gaps locally;
- do not invent responsive stacking beyond the Bootstrap classes actually present;
- keep this component separate from the future higher-level `Input rows` pattern referenced by Buckholt.

### Key-value pair
Read `components/key-value-pair/rules.md` and `components/key-value-pair/examples.html`. Use `.key-value` with `.key` and `.value`, preserve documented stacked/list/grid/table/size forms, and use real table semantics where the data is actually tabular.

### Link
Read `components/link/rules.md`, `components/link/examples.html` and `discrepancies/known-issues.md` when exact visited rendering matters. Links are navigation, not state-changing actions; plain anchors are inline links, `.link-standalone` is the standalone form, and inline links do not take icons.

### List
Read `components/list/rules.md` and `components/list/examples.html`. Use semantic `<ul>`/`<ol>`, `.list-item`, the documented optional heading pattern, `.list-unstyled` only to remove visual markers while retaining semantics, and meaningful icons sparingly.

### Menu
Read `components/menu/rules.md` and `components/menu/examples.html`, plus Menu button and Iconography guidance. Use documented Menu structure, submenus, native radio/checkbox controls, dividers and danger/disabled rules; preserve keyboard/focus behaviour and hide permanently unavailable actions.

### Menu button
Read `components/menu-button/rules.md` and `components/menu-button/examples.html`, plus Button, Tooltip and Iconography. Choose standard Menu button for equal-importance actions, Combo for a primary action plus alternatives, and Overflow for secondary object-scoped actions. Use Bootstrap dropdown behaviour.

### Modal
Read `components/modal/rules.md` and `components/modal/examples.html`, plus Button and Text block. Use the documented Bootstrap Modal structure/sizes/centred/scrollable forms only when appropriate, preserve close labelling and focus behaviour, and use Modal only for short genuinely interruptive tasks.

### Progress bar
Read `components/progress-bar/rules.md` and `components/progress-bar/examples.html`. Use `.progress-container` where supporting content exists, always label progress, distinguish determinate/indeterminate correctly, expose real ARIA values for determinate progress, and use documented success/error/inactive states. See known issues for the current error-icon runtime defect.

### Slider
Read `components/slider/rules.md` and `components/slider/examples.html`. Use the native range input with real min/max/step/value, paired numeric input and documented wrapper structure; synchronize values, preserve validation/disabled/read-only behaviour, and do not invent the two-handle range variant marked as coming soon.

### Summary Meta
Read `components/summary-meta/rules.md` and `components/summary-meta/examples.html`, plus Icon block and Key-value. Use `.summary-meta`, Icon block then `.summary-meta-body`, keep content short, and use `.summary-meta-stacked` for the documented vertical form. See known issues for the inert `.expressive-primary` class note.

### Table
Read `components/table/rules.md` and `components/table/examples.html`, plus nested component guidance.

Table is supported but provisional/WIP. Start from `.table-container > .table-content > table.table`, preserve native table semantics and supplied header/sort/selection/data classes, reuse Buckholt components inside cells, and do not invent pagination, density, pinning or responsive data-grid behaviour not documented by Buckholt.

### Tag
Read `components/tag/rules.md` and `components/tag/examples.html`, plus Colour and Iconography. Choose read-only, dismissible, selectable or status by function; preserve native radio/checkbox state for selectable Tags; use small only for documented read-only/status forms; Tags are not navigation.

### Text block
Read `components/text-block/rules.md`, `components/text-block/examples.html`, Typography, Spacing, Iconography and Colour. Use `.text-block` for written-content groups, keep semantic heading level independent from visual type class, and follow the documented eyebrow/inline-icon/Icon-block composition rules.

### Text input
Read `components/text-input/rules.md`, `components/text-input/examples.html`, Form and relevant foundations.

Rules:
- use `.input > .input-label + .response.text-input` as the core structure and `.form-control` on the native input;
- visible labels are required unless an approved accessibility exemption applies; placeholder is supplementary only;
- required/optional qualifiers are documented as `<small>` inside the `<label>`;
- assistive text belongs inside `.input-label`; helper text follows `.response`;
- use native `disabled` and `readonly` semantics and do not confuse them;
- use `.is-invalid` plus `.invalid-feedback` for the documented error treatment;
- a supporting `.input-icon` may precede the input when meaningful;
- use no more than one `.input-btn` inside a Text input and never combine that action button with a separate input icon;
- default/medium is established; `.form-control-sm` is documented but the Code & specs page marks small implementation as pending, so do not invent missing details;
- do not recreate input padding, borders, radius, typography, focus or validation styling locally.

### Toast
Read `components/toast/rules.md` and `components/toast/examples.html`, plus Colour and Iconography. Use Toast for immediate non-blocking feedback, preserve documented semantic variants/structure, manual/timed dismissal and Bootstrap behaviour, and do not make disappearing feedback the only recoverable source of important information.

### Tooltip
Read `components/tooltip/rules.md` and `components/tooltip/examples.html`. Use Tooltips only for contextual nonessential information, put Bootstrap tooltip attributes on the real trigger, initialize with Buckholt's documented offset/delay, and keep the trigger understandable without the Tooltip.

### Versa-tile
Read `components/versa-tile/rules.md` and `components/versa-tile/examples.html`, plus nested component guidance. Use `.versatile` with documented content/body/meta/actions structure, reuse Buckholt subcomponents, keep actions item-specific, use whole-tile anchors only for navigation, and consult known issues for the locally fixed action-set wrapping defect.
