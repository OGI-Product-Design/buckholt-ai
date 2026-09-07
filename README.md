# Buckholt AI

A lean, machine-readable companion for using the Buckholt design system accurately in coding agents such as Claude Code, Cursor and Codex.

## Goal

**Build with Buckholt; do not imitate Buckholt.**

This repository is deliberately evidence-led. It teaches coding agents only patterns that can be traced to Buckholt's documentation or the real compiled runtime stylesheet.

## Source hierarchy

1. **Buckholt documentation website** — primary source of truth for intended Digital Product design-system behaviour: usage, hierarchy, accessibility, canonical markup, scales and design-system meaning.
2. `css/buckholt.css` — current runtime implementation. Use it for real selectors, variables, states and browser behaviour, while recognising that it may contain extra helpers or values added when Buckholt was also used to build the company website.
3. `foundations/<foundation>/` — concise shared design-system guidance extracted from documentation and checked against runtime CSS where useful.
4. `components/<component>/rules.md` — component guidance rebuilt from Buckholt documentation plus runtime implementation evidence.
5. `components/<component>/examples.html` — verified canonical markup examples.

Extra runtime CSS is useful flexibility, but it does not become canonical Buckholt guidance unless the documentation says so. Only significant runtime differences that could mislead an implementation agent are noted in `discrepancies/known-issues.md`.

Old SCSS, old token maps, screenshots, Figma and earlier interpreted AI specifications are intentionally excluded from the implementation path unless explicitly requested for investigation.

## Structure

```text
buckholt-ai/
├── README.md
├── CLAUDE.md
├── css/
│   └── buckholt.css
├── foundations/
│   ├── colour/
│   ├── iconography/
│   ├── radius/
│   ├── shadows/
│   ├── spacing/
│   └── typography/
│       ├── rules.md
│       └── type-sets.md
├── discrepancies/
│   └── known-issues.md
└── components/
    ├── alert/
    ├── breadcrumb/
    ├── button/
    ├── card/
    ├── heading-attachment/
    ├── icon-block/
    ├── key-value-pair/
    ├── link/
    ├── list/
    ├── menu/
    ├── menu-button/
    ├── modal/
    ├── progress-bar/
    ├── summary-meta/
    ├── text-block/
    ├── tooltip/
    └── versa-tile/
```

Each documented component folder contains `rules.md` and `examples.html`.

## Foundation coverage

### Colour
Read `foundations/colour/` for the global palette, semantic/foundation colour roles and contrast guidance.

### Iconography
Read `foundations/iconography/` for Buckholt's Font Awesome v7 usage and the full documented icon catalogue.

### Radius
Read `foundations/radius/rules.md` before adding or overriding border radius. Follow the documented scale for design decisions; additional runtime radius values may be used where an existing Buckholt implementation requires them.

### Shadows
Read `foundations/shadows/rules.md` before adding elevation. Buckholt documents five shadow levels (`xs` through `xl`) and feedback shadow treatments. Shadows should be purposeful, subtle and used only for genuinely elevated UI.

### Spacing
Read `foundations/spacing/rules.md` before introducing margins, padding or gaps. It records the documented core spacing scale plus Buckholt's dedicated padding and margin tokens. Prefer tokens over hard-coded spacing values.

### Typography
Read `foundations/typography/rules.md` and `foundations/typography/type-sets.md` before choosing or changing typography. Buckholt uses Proxima Soft with the documented `Proxima-soft, Arial, sans-serif` stack, a ten-step type scale, and named type sets for display, headline, title, body, support, action, form, label and key-value roles. Prefer the documented type-set class over arbitrary font styling or Bootstrap typography helpers.

## Component coverage

### Alert
Read `components/alert/rules.md` and `components/alert/examples.html`, plus Colour, Iconography, Button and Link guidance where relevant. Alert covers local nondisruptive feedback, information/success/warning/error variants, optional icons and notes, context-bar actions, and dismissible behaviour.

The message is required. Only make an Alert dismissible when the message is noncritical and does not represent a persistent unresolved condition.

### Breadcrumb
Read `components/breadcrumb/rules.md` and `components/breadcrumb/examples.html`, plus Link, Menu button and Menu guidance for overflow. Breadcrumb covers location-based and path-based trails, current-page semantics, generated dividers and responsive overflow behaviour.

Breadcrumbs are secondary navigation and should not replace primary navigation. Long trails should use Buckholt's Overflow menu pattern rather than wrapping.

### Button
Read `components/button/rules.md` and `components/button/examples.html`, plus the relevant foundations when choosing colour, icons, radius, spacing, typography or other shared styling.

### Card
Read `components/card/rules.md` and `components/card/examples.html`. Card covers core/secondary containers, images, horizontal cards, whole-card navigation, selectable cards and Emphasis tile composition.

Use documented nested Buckholt components inside Card rather than recreating their styles. Clickable Cards are navigation and should not contain competing internal CTAs.

### Heading attachment
Read `components/heading-attachment/rules.md` and `components/heading-attachment/examples.html` together with Text block. Heading attachment extends Text block by adding one closely related contextual action or supporting element beside the heading using `.heading` and `.heading-content`.

Keep the heading primary, use one compact attachment, and reuse documented components such as Link, Button, Tag or metadata rather than building an ad-hoc toolbar.

### Icon block
Read `components/icon-block/rules.md` and `components/icon-block/examples.html`, plus Colour, Iconography and Radius foundations. Icon block covers the six documented sizes from extra small through extra extra large, neutral/default treatment, expressive light/dark treatments and secondary/tertiary/quaternary expressive palette modifiers.

When an Icon block is composed inside a Text block, the Text block component controls the relationship to headings, eyebrow text, inline icons and spacing.

### Key-value pair
Read `components/key-value-pair/rules.md` and `components/key-value-pair/examples.html`, plus Typography, Colour and Spacing foundations. Key-value covers single and stacked pairs, lists and row lists, configurable grids, two-column key-value tables and the documented typography size modifiers.

Use the documented grouping structure rather than recreating metadata layouts with custom CSS.

### Link
Read `components/link/rules.md` and `components/link/examples.html`, plus colour, iconography, spacing and typography where relevant. The Link guidance covers inline and standalone links, icon use, new-tab/external-link treatment, interaction states and horizontal/stacked Link sets.

A documented/runtime difference for the visited Link state is recorded in `discrepancies/known-issues.md`; documentation remains the source of truth for intended state colour.

### List
Read `components/list/rules.md` and `components/list/examples.html`. List covers semantic unordered and ordered lists, optional list headings, nested lists, unstyled lists and icon-supported list items.

Keep native list semantics even when markers are visually removed. Use icons sparingly and do not communicate status through icon/colour alone.

### Menu
Read `components/menu/rules.md` and `components/menu/examples.html`, together with Menu button and Iconography guidance where relevant. Menu covers contextual action lists, submenus, selectable submenu items, dividers, destructive/disabled states and documented focus/interactions.

Disable only temporarily unavailable actions; permanently unavailable or permission-restricted actions should be hidden. Keep Menu items semantic and keyboard operable.

### Menu button
Read `components/menu-button/rules.md` and `components/menu-button/examples.html`, together with Button, Tooltip and Iconography guidance. Menu button covers standard Menu buttons, Combo buttons and Overflow menu buttons.

Choose the variant by action hierarchy and scope: equal-importance page actions use Menu button, direct-plus-alternatives can use Combo, and smaller-object secondary actions use Overflow.

### Modal
Read `components/modal/rules.md` and `components/modal/examples.html`, together with Button and Text block. Modal covers standard, centred, scrollable and size-modified dialogs using the documented Bootstrap structure.

Use Modals only for short, interruptive tasks that genuinely require attention before returning to the underlying page.

### Progress bar
Read `components/progress-bar/rules.md` and `components/progress-bar/examples.html`. Progress bar covers determinate and indeterminate progress, default/large and small sizes, label/note/helper content, success, error and inactive states.

Always provide accessible progress labelling. Do not invent quantitative values for indeterminate processes.

### Summary Meta
Read `components/summary-meta/rules.md` and `components/summary-meta/examples.html`, plus Icon block and Key-value when they are composed inside it. Summary Meta combines an Icon block with short supporting content for concise, scannable contextual summaries.

Use `.summary-meta-stacked` for the documented vertical/centred variant. Keep content short rather than turning Summary Meta into a general content container.

### Text block
Read `components/text-block/rules.md` and `components/text-block/examples.html`, plus Typography, Spacing, Iconography and Colour foundations. Text block covers semantic heading structure, Buckholt display/headline/title type sets, paragraphs, eyebrow text, inline heading icons and icon blocks.

Important composition rules include: use semantic heading levels independently of visual type style; do not combine icon blocks with eyebrow text or inline heading icons; use inline icons rather than icon blocks with display-sized headings.

### Tooltip
Read `components/tooltip/rules.md` and `components/tooltip/examples.html`. Tooltip is for contextual, nonessential information and uses Bootstrap/Popper with Buckholt's documented offset and delay.

The trigger must remain understandable and accessible without the Tooltip; do not hide essential instructions or validation inside it.

### Versa-tile
Read `components/versa-tile/rules.md` and `components/versa-tile/examples.html`. Versa-tile composes Icon block, Key-value, actions and optionally Progress bar into a compact repeatable item.

Use whole-tile anchors only for navigation; otherwise keep item actions inside `.versatile-actions`.

## Runtime dependencies

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/buckholt.css">
```

For Buckholt behaviours that use Bootstrap JavaScript such as tooltips, dropdown menus, alerts and modals, also load:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
```

## Agent behaviour

Coding agents should read `CLAUDE.md`, the relevant foundation files and the relevant component folder before implementing Buckholt UI. Follow documented Buckholt intent first, use the runtime CSS to implement it accurately, and do not invent design-system behaviour from undocumented runtime extras.
