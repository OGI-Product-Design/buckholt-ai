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

For Buckholt patterns that use Bootstrap behaviour such as tooltips, also load:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
```

## Current component coverage

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

### Summary Meta
Read `components/summary-meta/rules.md` and `components/summary-meta/examples.html`, plus Icon block and Key-value where used.

Rules:
- use `.summary-meta` with Icon block followed by `.summary-meta-body`;
- keep content short and scan-friendly;
- use `.summary-meta-stacked` for the vertical/centred form;
- reuse nested components rather than restyling them.

### Text block
Read `components/text-block/rules.md`, `components/text-block/examples.html`, Typography, Spacing, Iconography and Colour foundations.

Rules:
- use `.text-block` for written-content groups;
- semantic heading level is independent from visual type class;
- use documented eyebrow/inline-icon/Icon-block composition rules;
- do not recreate Text block width or internal spacing locally.

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
- do not invent Versa-tile padding, border, radius, action spacing or hover styling.
