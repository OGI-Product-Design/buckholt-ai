# Breadcrumb

## Purpose

Breadcrumbs show a user's current position within a site's structure and allow quick movement to a parent level or previous step.

They are a secondary navigation aid. They do not replace primary navigation.

## When to use

Use Breadcrumbs in products or experiences with extensive content organised across multiple hierarchical levels. They provide positional context with little visual footprint.

Do not use Breadcrumbs for a single-level product structure, where they add unnecessary clutter.

## Types

Buckholt documents two Breadcrumb types. Choose one approach and use it consistently throughout a product.

### Location-based

Represents the site's hierarchy and the user's current position within that hierarchy.

### Path-based

Represents the specific steps the user followed to reach the current page rather than the site's overall hierarchy. Path-based Breadcrumbs are always generated dynamically.

## Canonical structure

```html
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item">
      <a class="breadcrumb-link" href="#">Breadcrumb 1</a>
    </li>
    <li class="breadcrumb-item">
      <a class="breadcrumb-link" href="#">Breadcrumb 2</a>
    </li>
    <li class="breadcrumb-item active" aria-current="page">Breadcrumb 3</li>
  </ol>
</nav>
```

Buckholt's base-code guidance permits an ordered or unordered list, but the canonical examples use an ordered list.

## Current page

The current page is the final item in the trail. It is not a link and uses:

```html
<li class="breadcrumb-item active" aria-current="page">Current page</li>
```

Do not link the current page back to itself.

## Links

Ancestor items use `.breadcrumb-link` anchors. Labels should be concise and match the destination clearly.

## Dividers

Dividers are generated automatically with a `::before` pseudo-element. Do not add separator characters directly into the HTML.

Buckholt documents the local CSS custom property `--breadcrumb-divider-icon` for changing the divider:

```html
<nav aria-label="breadcrumb" style="--breadcrumb-divider-icon: '>';">
  <ol class="breadcrumb">
    <li class="breadcrumb-item">
      <a class="breadcrumb-link" href="#">Insurance</a>
    </li>
    <li class="breadcrumb-item active" aria-current="page">Car</li>
  </ol>
</nav>
```

Buckholt documentation also shows Sass-based alternatives. This repository does not use SCSS. For implementation here, use the documented CSS custom property or the existing compiled runtime behaviour; do not introduce SCSS.

An embedded SVG may also be used through the documented divider custom property when required.

## Long trails and overflow

Breadcrumbs should not wrap onto a second line.

When space is limited, use Buckholt's Overflow menu pattern to shorten the trail. The first and last two page links should remain visible, with intervening pages grouped into the overflow menu.

For most larger breakpoints, keep the first `Home` Breadcrumb visible for as long as possible, even when overflow is used.

On mobile or smaller viewports, begin with the Overflow menu followed by a single visible Breadcrumb.

Read `components/menu-button/rules.md` for the Overflow menu trigger pattern and `components/menu/rules.md` for the Menu itself.

## Behaviour

Breadcrumb items navigate to previous or parent locations. Breadcrumb is not a control for changing application state.

Use normal link behaviour and preserve the interaction states supplied by the runtime.

## Accessibility

- wrap the trail in a `<nav>` with `aria-label="breadcrumb"`;
- use semantic list markup;
- mark the current page with `aria-current="page"`;
- keep the current page as text rather than a redundant self-link;
- keep link labels meaningful and understandable out of visual context;
- dividers are presentation and should not need to be announced as part of the link labels.

## Foundation relationships

Read:

- `foundations/colour/` for text/link state colours;
- `foundations/spacing/rules.md` before changing item spacing;
- `foundations/typography/` before changing Breadcrumb type styles;
- `components/link/rules.md` for general navigation-link principles;
- `components/menu-button/` and `components/menu/` when using Breadcrumb overflow.

## Agent rules

- Use Breadcrumb only as secondary navigation.
- Choose location-based or path-based generation consistently within a product.
- Use `<nav aria-label="breadcrumb">` and semantic list markup.
- Use `.breadcrumb`, `.breadcrumb-item` and `.breadcrumb-link`.
- Mark the final/current item `.active` with `aria-current="page"` and do not link it.
- Do not place divider text in the HTML; use the runtime/generated divider.
- If a custom divider is required, use `--breadcrumb-divider-icon`; never add SCSS to this repository.
- Breadcrumbs must not wrap to a second line.
- Use Buckholt's Overflow menu pattern for long trails rather than inventing custom truncation.
- Do not recreate Breadcrumb spacing, typography or separators with custom CSS when Buckholt already provides them.
