# Buckholt Card

## Status

Card guidance rebuilt from the supplied Buckholt Usage, Style and Code & specs documentation and checked against `../../css/buckholt.css`.

## Purpose

Cards are adaptable containers used to group and present related content clearly and consistently. Card content varies by use case and may include Text blocks, tags, images and documented interactive elements such as Buttons and Links.

Use the Card component when content benefits from being grouped as a distinct item or unit. Do not use Card merely as decoration around unrelated content.

## Base structure

```html
<div class="card">
  <div class="card-body">
    <div class="text-block">
      <h3 class="title-03">Card title</h3>
      <p>Supporting content.</p>
    </div>
  </div>
</div>
```

`.card` is the outer container and `.card-body` provides the documented internal content area. Reuse documented Buckholt components inside the body instead of rebuilding their styles locally.

## Size and layout

Card width is dictated by its container and expands to the available width by default. Height is content-dependent. Internal spacing is controlled by the Card runtime and spacing tokens.

The runtime also supports documented compact/spacing variants such as `.card-sm` where the documentation calls for them. Do not invent arbitrary Card padding or fixed heights.

## Secondary style

Use `.card-secondary` for the documented secondary Card treatment:

```html
<div class="card card-secondary">
  <div class="card-body">...</div>
</div>
```

Let Buckholt provide the background and border treatment. Do not approximate the secondary style with custom colour values.

## Images

Images may appear at the top of a standard Card:

```html
<div class="card">
  <img src="..." class="card-img" alt="...">
  <div class="card-body">...</div>
</div>
```

Provide meaningful `alt` text when the image communicates information. Use an empty `alt` when the image is purely decorative.

### Horizontal cards

Use `.card-horizontal` for the documented image-and-content horizontal layout. Add `.card-horizontal-right` when the image belongs on the right.

```html
<div class="card card-horizontal">
  <div class="card-img">
    <img src="..." alt="...">
  </div>
  <div class="card-body">...</div>
</div>
```

Do not recreate horizontal Card layout with local flex CSS.

## Clickable Card

A Clickable Card is a navigational Card. Replace the outer `div` with an anchor and add `.card-clickable`.

```html
<a href="/destination" class="card card-clickable">
  <div class="card-body">
    <div class="text-block">
      <h3 class="title-03">Clickable card title</h3>
      <p>Supporting content.</p>
    </div>
  </div>
</a>
```

The whole Card is the navigation target. Buckholt documentation says Clickable Cards should not contain separate internal calls-to-action because that creates competing interactive targets. Media and supporting icons may be used where appropriate.

Use semantic link behaviour: a Clickable Card navigates somewhere. Do not use it for an action that changes state without navigation.

The runtime supplies hover/focus treatment and the Card's navigation indicator. Do not recreate these locally.

## Selectable Card

Use `.card-selectable` for Cards representing a radio or checkbox choice. The input belongs inside the Card before the body.

Single select:

```html
<div class="card card-selectable">
  <input class="form-check-input" type="radio" name="selection" id="selection-1">
  <div class="card-body">...</div>
</div>
```

Multi select:

```html
<div class="card card-selectable">
  <input class="form-check-input" type="checkbox" id="selection-2">
  <div class="card-body">...</div>
</div>
```

The selectable Card is intended to be activated from anywhere within its container and must remain keyboard operable. Preserve logical focus order and native radio/checkbox semantics.

## Emphasis tile composition

Cards may contain a documented Emphasis tile. Place it in a second `.card-body`; this is the documented structure that creates the required separation from the main Card content.

```html
<div class="card">
  <div class="card-body">...</div>
  <div class="card-body">
    <div class="emphasis-tile">...</div>
  </div>
</div>
```

The documentation also shows `.emphasis-tile-inline` where that treatment is required. Emphasis tile is its own pattern/component concern; do not reinterpret it as generic Card styling.

## Accessibility

- Use semantic headings according to page hierarchy, not simply the heading level used in documentation examples.
- Clickable Cards must be anchors with meaningful destinations and should not contain nested interactive CTAs.
- Selectable Cards must retain real radio/checkbox controls and keyboard interaction.
- Give informative images useful alternative text and decorative images empty alternative text.
- Do not rely only on border or colour to communicate selection or state where another semantic mechanism is required.

## Runtime notes

The compiled runtime includes the documented `.card`, `.card-body`, `.card-secondary`, `.card-horizontal`, `.card-horizontal-right`, `.card-clickable`, `.card-selectable` and Emphasis tile composition behaviour. It also supplies Card border, radius, background, padding and interactive state variables.

Extra Bootstrap Card helpers present in the compiled stylesheet are runtime flexibility, not automatically canonical Buckholt guidance.

## Agent rules

- Use `.card` as the base Card container.
- Put Card content inside `.card-body`.
- Reuse Text block, Link, Button, Key-value and other documented components inside Cards rather than restyling them.
- Use `.card-secondary` only for the documented secondary treatment.
- Use `.card-horizontal` and `.card-horizontal-right` for documented horizontal image layouts.
- Use an `<a>` with `.card-clickable` for whole-card navigation; do not place separate interactive CTAs inside it.
- Use `.card-selectable` with a native radio or checkbox for Card choices.
- Use a second `.card-body` when composing the documented Emphasis tile treatment.
- Do not invent Card widths, fixed heights, padding, borders, radius, shadows or interactive states with custom CSS.
