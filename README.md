# Buckholt AI

A lean, machine-readable companion for using the Buckholt design system accurately in coding agents such as Claude Code, Cursor and Codex.

## Goal

**Build with Buckholt; do not imitate Buckholt.**

This repository is deliberately evidence-led. It should teach coding agents only patterns that can be traced to the Buckholt documentation or the real compiled runtime stylesheet.

## Sources of truth

1. Buckholt documentation — intended usage, hierarchy, accessibility, canonical markup and design-system meaning.
2. `css/buckholt.css` — current browser/runtime implementation: selectors, values, states, dimensions and generated behaviour.
3. `foundations/<foundation>/` — shared design-system rules and values extracted from the documentation and reconciled with runtime CSS where relevant.
4. `components/<component>/rules.md` — concise component guidance rebuilt from Buckholt documentation plus runtime CSS.
5. `components/<component>/examples.html` — verified canonical markup examples.

If documentation and runtime CSS disagree, record/report the discrepancy rather than silently deciding that one should replace the other.

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
│   │   ├── rules.md
│   │   ├── palette.md
│   │   ├── foundation-tokens.md
│   │   └── contrast.md
│   └── iconography/
│       ├── rules.md
│       └── catalogue.md
└── components/
    └── button/
        ├── rules.md
        └── examples.html
```

More foundations and components should be added only after their documentation and runtime implementation have been reconciled.

## Foundation coverage

### Colour

The Colour foundation covers all four supplied Buckholt colour documentation areas:

- Colour overview and three-tier architecture;
- Global palette;
- Foundation/semantic colour roles;
- Colour contrast and accessibility guidance.

Read:

- `foundations/colour/rules.md`
- `foundations/colour/palette.md`
- `foundations/colour/foundation-tokens.md`
- `foundations/colour/contrast.md`

The palette and semantic values are cross-checked against the current `css/buckholt.css`. Components should use Buckholt semantic/component variables rather than copying raw hex values.

### Iconography

The Iconography foundation covers the supplied Buckholt Iconography overview and full Icon catalogue.

Read:

- `foundations/iconography/rules.md`
- `foundations/iconography/catalogue.md`

Buckholt uses Font Awesome v7, with regular icons for most applications and deliberate solid/brand mappings where the catalogue specifies them. The catalogue currently records **111 documented Buckholt icons** with their exact Font Awesome classes, Unicode value, category and documented role where supplied.

Agents must use the catalogue before choosing an icon. Do not substitute a visually similar Font Awesome icon when Buckholt already documents the intended mapping.

## Button coverage

Verified coverage includes:

- `.btn` base behaviour;
- `.btn-primary`, `.btn-secondary`, `.btn-ghost`;
- `.btn-danger` as a modifier for primary, secondary and ghost buttons;
- `.btn-sm`, default/medium and `.btn-lg`;
- resting, hover, focus, active and disabled behaviour;
- the intentional 3px clickable bottom border on primary/secondary buttons, returning to 1px for focus/active; ghost stays at the normal border width;
- `.btn-icon` and `.button-label` structure;
- icon-only button guidance and required tooltips;
- button-set layout including `.button-set` and `.button-set-stacked`;
- usage guidance for hierarchy, content, alignment, sets, icons, icon-only buttons and keyboard interaction.

Button icon choice should now resolve through `foundations/iconography/catalogue.md` rather than duplicating icon mappings inside Button documentation.

The Button Usage, Style and Code & specs documentation have all been supplied and reconciled with `css/buckholt.css`.

## Runtime dependencies

### Bootstrap CSS

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
```

### Proxima Nova / Proxima Soft

```html
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
```

The compiled Buckholt stylesheet requests `"Proxima-soft", Arial, sans-serif`.

### Font Awesome

```html
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
```

Do not substitute a different icon library.

### Bootstrap JavaScript for interactive Bootstrap behaviours

When a page uses Bootstrap-powered behaviour such as Buckholt tooltips, also load the Bootstrap 5.1.3 bundle:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
```

## Recommended standalone page order

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/buckholt.css">
```

Add the Bootstrap JS bundle before the closing `</body>` when the page uses tooltips or other Bootstrap interactions.

## Agent behaviour

Coding agents should read `CLAUDE.md`, relevant foundation files and the relevant component folder before implementing Buckholt UI. They should use real Buckholt classes, variables and approved icon mappings, and explicitly flag genuine conflicts instead of inventing design-system behaviour.
