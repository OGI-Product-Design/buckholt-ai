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
Read `foundations/shadows/rules.md` before adding elevation.

Rules:
- use shadows only for genuinely elevated UI;
- use documented Buckholt shadow tokens/classes rather than arbitrary `box-shadow` values;
- lighter elevation should use lighter shadows and higher layers may use heavier shadows;
- feedback shadows must follow the corresponding Buckholt feedback state.

### Spacing
Read `foundations/spacing/rules.md` before introducing margins, padding or gaps.

Rules:
- prefer Buckholt spacing tokens instead of hard-coded `px`/`rem` values;
- read the relevant component/pattern documentation before changing its internal spacing;
- use the shared `--spacer-*` scale and dedicated `--padding-*` / `--margin-*` tokens as documented;
- do not choose spacing solely because it looks close.

### Typography
Read both:
- `foundations/typography/rules.md`
- `foundations/typography/type-sets.md`

Rules:
- use Buckholt's documented `Proxima-soft, Arial, sans-serif` stack through the runtime;
- choose typography by documented content role, then use the corresponding Buckholt type-set class;
- preserve the documented size, weight, line height and letter spacing of that type set;
- use semantic HTML according to document structure; do not choose `h1`–`h6` tags merely to get a particular visual size;
- prefer documented Buckholt classes such as `.display-03`, `.headline-02`, `.title-01`, `.body-02`, `.support-01`, `.action-01`, `.label-02`, `.key-01` and `.value-01` where their documented role fits;
- do not treat Bootstrap `.display-*`, `.fs-*` or generic heading helpers present in the compiled CSS as canonical Buckholt typography choices unless Buckholt documentation/component guidance explicitly uses them;
- do not invent a new Buckholt type set if the documented set does not cover the requirement; flag the gap instead.

## Custom CSS

Custom CSS may be used for page/demo layout only when necessary. It must not be used to recreate or override Buckholt component styling simply to make an implementation look right.

## Runtime dependencies

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/buckholt.css">
```

For Buckholt patterns that use Bootstrap behaviour such as tooltips, dropdown menus, alerts, accordions, modals and toasts, also load:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
```

## Current component coverage

### Accordion
Read `components/accordion/rules.md`, `components/accordion/examples.html` and Text block guidance.

Rules:
- use the documented `.accordion`, `.accordion-item`, `.accordion-header`, `.accordion-button`, `.accordion-collapse` and `.accordion-body` structure;
- default to collapsed; for an initially expanded item add `.show`, remove `.collapsed`, and set `aria-expanded="true"`;
- medium/default is for most grouped Accordions; use `.accordion-lg` only for a standalone large collapsible card;
- use `data-bs-parent` on each collapse only when one-open-at-a-time behaviour is intended;
- keep unique IDs and keep `data-bs-target`, `aria-controls` and collapse IDs aligned;
- preserve semantic heading levels according to the page hierarchy;
- reuse Buckholt components inside `.accordion-body`;
- use Bootstrap collapse behaviour rather than custom show/hide scripting;
- do not recreate Accordion spacing, disclosure icon, focus state or transitions locally.

### Alert
Read `components/alert/rules.md`, `components/alert/examples.html` and relevant Colour/Iconography/Button/Link guidance.

Rules:
- Alert is local, nondisruptive feedback; use Modal for genuinely interruptive tasks;
- use `.alert` with one of `.alert-info`, `.alert-success`, `.alert-warning`, `.alert-error` when a semantic status applies;
- `.alert-message` is required; icon, `.alert-note`, `.context-bar` and close control are optional;
- use `.alert-note` directly after `.alert-message` for secondary context;
- put `.context-bar` last inside `.alert-body` and reuse Buckholt Button/Link components inside it;
- only make an Alert dismissible when it is noncritical and does not represent a persistent unresolved condition;
- keep Alert copy concise and sentence case;
- preserve `role="alert"`, accessible close labelling, keyboard access and visible focus;
- do not recreate Alert colours, spacing, border treatment, radius or typography locally.

### Avatar
Read `components/avatar/rules.md`, `components/avatar/examples.html`, Colour and Iconography guidance.

Rules:
- use `.avatar` as the base;
- choose one representation only: `.avatar-img`, `.avatar-initials` or `.avatar-icon`;
- medium/default is the base size; `.avatar-sm` and `.avatar-xs` are the documented smaller sizes;
- use the primary expressive palette by default and only use `.expressive-secondary`, `.expressive-tertiary` or `.expressive-quaternary` intentionally;
- add `.expressive-dark` for the documented dark expressive treatment;
- use `.avatar-set` for compact groups representing shared ownership, collaboration or participation;
- make sure the surrounding UI exposes the person's real accessible identity when identity matters;
- do not recreate Avatar dimensions, cropping, radius, overlap or expressive colours locally.

### Breadcrumb
Read `components/breadcrumb/rules.md`, `components/breadcrumb/examples.html`, and Menu/Menu button guidance for overflow.

Rules:
- Breadcrumb is secondary navigation and must not replace primary navigation;
- choose location-based or path-based Breadcrumb generation consistently within a product;
- use `<nav aria-label="breadcrumb">` with `.breadcrumb` and semantic list markup;
- use `.breadcrumb-link` for ancestor links;
- mark the final/current `.breadcrumb-item.active` with `aria-current="page"` and do not link it;
- dividers are generated by CSS; never insert divider text into the HTML;
- if a custom divider is needed, use `--breadcrumb-divider-icon`; do not introduce SCSS;
- Breadcrumbs must not wrap to a second line;
- use Buckholt's Overflow menu pattern for long trails instead of inventing custom truncation;
- do not recreate Breadcrumb spacing, typography or divider styling locally.

### Button
Read `components/button/rules.md` and `components/button/examples.html` plus relevant foundations.

### Card
Read `components/card/rules.md` and `components/card/examples.html`.

Rules:
- use `.card` with `.card-body` as the core structure;
- use `.card-secondary` only for the documented secondary treatment;
- use `.card-horizontal` and `.card-horizontal-right` for documented horizontal image layouts;
- use an `<a>` with `.card-clickable` for whole-card navigation and do not nest competing CTAs inside it;
- use `.card-selectable` with native radio/checkbox controls for selectable Cards;
- place a documented Emphasis tile in a second `.card-body`;
- reuse Text block and other Buckholt components inside Card;
- do not recreate Card padding, radius, borders, states or layout with custom CSS.

### Heading attachment
Read `components/heading-attachment/rules.md`, `components/heading-attachment/examples.html` and `components/text-block/rules.md`.

Rules:
- Heading attachment extends Text block; use `.heading` and `.heading-content`;
- use one compact, directly related attachment;
- preserve semantic heading hierarchy;
- reuse documented components for the attachment rather than building an ad-hoc toolbar.

### Icon block
Read `components/icon-block/rules.md`, `components/icon-block/examples.html` and Iconography/Colour/Radius foundations.

Rules:
- use `.icon-block` as the base;
- default is medium; documented modifiers are `.icon-block-xs`, `.icon-block-sm`, `.icon-block-lg`, `.icon-block-xl`, `.icon-block-xxl`;
- use documented expressive treatments and Buckholt icon mappings;
- when nested in Text block, follow Text block composition rules;
- do not recreate dimensions, radius or colours locally.

### Key-value pair
Read `components/key-value-pair/rules.md` and `components/key-value-pair/examples.html`.

Rules:
- use `.key-value` with `.key` and `.value`;
- use documented stacked/list/grid/table and size forms;
- preserve semantic table markup when real table semantics are needed;
- do not rebuild Key-value typography or layout locally.

### Link
Read `components/link/rules.md`, `components/link/examples.html` and `discrepancies/known-issues.md` when exact visited rendering matters.

Rules:
- links are navigation, not state-changing actions;
- use plain anchors for inline links and `.link-standalone` for standalone links;
- do not add icons to inline links;
- use documented Link sets and icon mappings;
- documentation defines intended visited colour.

### List
Read `components/list/rules.md` and `components/list/examples.html`.

Rules:
- use `.list` on semantic `<ul>` or `<ol>` elements;
- use `.list-item` for ordinary items;
- use optional `.list-heading` only as the documented first-item heading pattern;
- on ordered Lists with `.list-heading`, set that heading item to `value="0"` so the first real item begins at 1;
- use `.list-unstyled` to remove visual markers without discarding list semantics;
- use `.list-icon` sparingly and select meaningful icons from the Iconography catalogue;
- keep nested Lists shallow;
- do not recreate markers, indentation or list spacing with custom CSS.

### Menu
Read `components/menu/rules.md` and `components/menu/examples.html`, plus Menu button and Iconography guidance.

Rules:
- use Menu for contextual groups of actions;
- use `.menu-panel`, `.menu-body` and semantic `.menu-item` controls according to the documentation;
- use `.submenu-toggle` with `aria-haspopup="menu"` and `.submenu[role="menu"]` for nested menus;
- preserve native radio/checkbox controls for selectable submenu items;
- use `.menu-divider` only for meaningful grouping;
- use danger styling only for destructive actions;
- disable only temporarily unavailable actions; hide permanently unavailable or permission-restricted actions;
- preserve documented focus and keyboard operability;
- do not recreate Menu item spacing, states or surface styling locally.

### Menu button
Read `components/menu-button/rules.md` and `components/menu-button/examples.html`, plus Button, Tooltip and Iconography guidance.

Rules:
- choose standard Menu button when actions have equal importance;
- choose Combo button when one direct action is primary and related alternatives need a menu;
- choose Overflow menu for secondary actions scoped to a smaller object such as a table row or Card;
- use `.menu` as the outer composition;
- use `.menu-toggle` with `data-bs-toggle="dropdown"` and `aria-expanded="false"`;
- use `.menu-panel.dropdown-menu`, `.menu-body` and semantic `.menu-item` buttons;
- standard Menu button may use primary, secondary or ghost Button styling;
- Combo uses `.btn-combo`, two Buttons, and primary/secondary styling;
- Overflow uses an icon-only ghost Button with `fa-regular fa-ellipsis-vertical` and an accessible name;
- use `.dropdown-menu-end` where the documented combo/overflow alignment requires it;
- use `.menu-item-danger` only for destructive actions;
- use Bootstrap dropdown behaviour rather than custom menu-opening JavaScript.

### Modal
Read `components/modal/rules.md` and `components/modal/examples.html`, plus Button and Text block guidance.

Rules:
- use Modal only for short, interruptive tasks that genuinely require attention before returning to the page;
- use `.modal > .modal-dialog > .modal-content` with documented `.modal-header`, `.modal-body` and `.modal-footer` zones;
- use Text block/Heading attachment for title content and Button/Button set for actions;
- keep trigger and Modal title terminology consistent;
- use `.modal-sm`, default/no modifier, `.modal-lg` or `.modal-xl` according to content needs;
- use `.modal-dialog-centered` only for the documented centred form;
- use `.modal-dialog-scrollable` only when long content cannot reasonably be avoided;
- use `data-bs-toggle="modal"`, `data-bs-target` and `data-bs-dismiss="modal"` for Bootstrap behaviour;
- keep a meaningful `aria-label="Close"` on the close control;
- do not recreate Modal backdrop, positioning, focus behaviour or sizing with custom CSS.

### Progress bar
Read `components/progress-bar/rules.md` and `components/progress-bar/examples.html`.

Rules:
- use `.progress-container` when label, note/helper or feedback is present;
- always provide a meaningful progress label;
- use `.progress` with child `.progress-bar`;
- default/large height is 8px and `.progress-sm` is 4px;
- determinate progress must expose real `aria-valuenow`, `aria-valuemin` and `aria-valuemax`;
- use `.progress-bar-indeterminate` when progress cannot be measured and do not invent numeric progress;
- use `.is-valid` for success, `.is-invalid` plus `.invalid-feedback` for error, and `.progress-inactive` for the documented inactive state;
- do not recreate bar heights, status colours/icons, animation or feedback layout with custom CSS.

### Slider
Read `components/slider/rules.md` and `components/slider/examples.html`.

Rules:
- use `.input` with `.input-label` and `.response.slider-input`;
- use a native `input[type="range"].form-slider` with real `min`, `max`, `step` and `value` attributes;
- use `.slider-container`, `.slider-wrapper`, `.minmax` and the paired numeric `.form-control` as documented;
- keep the range control and numeric input synchronized;
- optional `.ticks`/`.tick` elements are visual support only and do not replace native step semantics;
- use `.is-invalid` on both controls for the documented error state and provide `.invalid-feedback` text;
- use `disabled` on both controls for disabled state;
- for read-only use `.form-slider.readonly` plus `disabled` on the range and `readonly` on the numeric input;
- treat the filled-track gradient as dynamic value presentation, not a hard-coded decorative style;
- the range-slider variant is documented as coming soon; do not invent a canonical two-handle Buckholt Slider;
- do not recreate Slider track, thumb or focus styling locally.

### Summary Meta
Read `components/summary-meta/rules.md` and `components/summary-meta/examples.html`, plus Icon block and Key-value where used.

Rules:
- use `.summary-meta` with Icon block followed by `.summary-meta-body`;
- keep content short and scan-friendly;
- use `.summary-meta-stacked` for the vertical/centred form;
- reuse nested components rather than restyling them.

### Table
Read `components/table/rules.md` and `components/table/examples.html`, plus any component guidance for controls/content embedded in cells.

Rules:
- Table is supported but its Buckholt documentation is provisional/WIP; do not avoid it when genuine tabular data is needed;
- start from `.table-container > .table-content > table.table` and preserve native table semantics;
- use `<th scope="col">` for the documented column-header pattern and `.table-header-label` for visible labels;
- preserve `.table-gap` when following the supplied canonical HTML;
- use `.table-sort-header` with a semantic `.table-sort` button for the supplied sortable pattern;
- use `data-cdt-table`, `data-col`, `data-sort-type` and `data-sort-value` only where the supplied WIP implementation requires them;
- use `.col-fit`, `.cell-data-right`, `.data-number` and `.data-secondary` only for roles evidenced by the source;
- preserve native checkbox controls for the documented selection pattern;
- reuse Avatar, Tag, Button and other Buckholt components inside cells rather than imitating them;
- `.simple_table` is an existing lighter runtime treatment, but its formal usage rationale is not yet documented;
- do not invent pagination, density, pinning, responsive transformation or other data-grid behaviour that Buckholt has not specified;
- if a requirement exceeds the current WIP surface, flag the gap while still using the documented Table foundation where applicable.

### Tag
Read `components/tag/rules.md` and `components/tag/examples.html`, plus Colour and Iconography guidance.

Rules:
- choose read-only, dismissible, selectable or status by function rather than appearance;
- use `.tag` with `.tag-label` as the base structure;
- use `.tag-dismissible` plus an accessible close control for removable Tags;
- use `.tag-selectable` with native radio for single-select or checkbox for multi-select; keep the native state and visual selected state synchronized;
- use `.tag-status` plus exactly one `.tag-status-info`, `.tag-status-success`, `.tag-status-warning` or `.tag-status-error` for semantic state;
- medium is default; `.tag-sm` is documented only for read-only and status Tags;
- do not show icons in small Tags;
- use `.tag-set` for related groups and documented expressive modifiers for categorisation, not semantic status;
- Tags are not navigation links and should not perform multiple competing functions;
- do not recreate Tag spacing, radius, colours or states locally.

### Text block
Read `components/text-block/rules.md`, `components/text-block/examples.html`, Typography, Spacing, Iconography and Colour foundations.

Rules:
- use `.text-block` for written-content groups;
- semantic heading level is independent from visual type class;
- use documented eyebrow/inline-icon/Icon-block composition rules;
- do not recreate Text block width or internal spacing locally.

### Toast
Read `components/toast/rules.md` and `components/toast/examples.html`, plus Colour and Iconography guidance.

Rules:
- use Toast for immediate, non-blocking feedback after an action/task and use it sparingly;
- preserve `.toast > .toast-content > .toast-body` with `.toast-message` and optional `.toast-note`/`.toast-icon`;
- use `.toast-info`, `.toast-success`, `.toast-warning` or `.toast-error` according to message meaning;
- preserve the documented `role="alert"`, `aria-live="assertive"` and `aria-atomic="true"` pattern where applicable;
- use a close control with `data-bs-dismiss="toast"` and an accessible label when manual dismissal is provided;
- Toasts persist by default but may autohide after five seconds; important information that disappears must remain available elsewhere;
- add `.fade` for the documented fade transition and use Bootstrap Toast behaviour rather than custom component scripting;
- do not recreate Toast dimensions, shadow, radius, spacing, colours or transitions locally.

### Tooltip
Read `components/tooltip/rules.md` and `components/tooltip/examples.html`.

Rules:
- use Tooltips only for contextual, nonessential information;
- put `data-bs-toggle="tooltip"` and `data-bs-title` on the real trigger;
- use `data-bs-placement` with `top`, `right`, `bottom` or `left` where a direction is specified;
- initialise Bootstrap Tooltips with Buckholt's documented `offset: [0, 4]` and `delay: { show: 800, hide: 100 }`;
- do not author Bootstrap-generated `.tooltip` markup directly;
- keep the trigger independently understandable and accessible;
- do not hide essential instructions or validation only in a Tooltip;
- do not recreate Tooltip positioning or styling with custom CSS.

### Versa-tile
Read `components/versa-tile/rules.md` and `components/versa-tile/examples.html`, plus nested component guidance as needed.

Rules:
- use `.versatile` with `.versatile-content`, `.versatile-body`, `.versatile-meta` and optional `.versatile-actions`;
- reuse Icon block, Key-value, Button, Link, Tag and Progress bar rather than making local equivalents;
- actions must be specific to the item;
- use `a.versatile` only for whole-tile navigation and avoid nested competing interactive controls;
- use the documented Progress bar component when progress appears;
- do not invent Versa-tile padding, border, radius, action spacing or hover styling locally.
