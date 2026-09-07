# Card

## Verification

Source-verified against the Buckholt Card Usage, Style and Code & specs HTML pages supplied on 7 September 2026. For exact DOM structure, use `examples.html`; its markup is extracted from the Code & specs source.

## Purpose

Cards are adaptable containers for grouping related content into a distinct unit. They may contain documented Buckholt content such as Text blocks, images, Links and selection controls.

## Canonical structure

Do not reconstruct Card markup from this prose. Use `examples.html` for the exact documented structures.

The documented base Card uses `.card > .card-body > .text-block`. The Code & specs example uses an `<h4 class="title-03">` inside the Text block; preserve that exact source example in canonical markup.

## Size

The Code & specs source documents the default Card and a large Card using `.card-lg`.

Do not promote `.card-sm` or another runtime helper into the canonical Card API unless Buckholt documentation explicitly establishes it.

## Secondary Card

Add `.card-secondary` for the documented secondary treatment. Let `buckholt.css` provide its visual treatment rather than recreating it locally.

## Images

The Code & specs source places the image directly inside `.card` as:

```html
<img src="..." class="card-img" alt="...">
```

For horizontal Cards, the same `.card-img` image remains a direct child of `.card`; do **not** wrap it inside a separate `<div class="card-img">`.

Use `.card-horizontal` for the documented horizontal layout and add `.card-horizontal-right` for the image-right variation.

## Card with Link

Buckholt demonstrates a standalone Link inside `.card-body` after the Text block. Preserve the Link component's documented `.link-standalone > .icon` structure when using that exact composition.

## Clickable Card

For whole-card navigation, Buckholt changes the outer element to an anchor and adds `.card-clickable`:

```html
<a href="#" class="card card-clickable">...</a>
```

Do not add competing nested interactive controls inside a clickable Card unless Buckholt explicitly documents the composition.

## Selectable Card

Use `.card-selectable` with a native radio or checkbox input placed directly inside the Card before `.card-body`. Preserve native radio/checkbox semantics and keyboard behaviour.

## Emphasis tile composition

The Code & specs source demonstrates an Emphasis tile in a second `.card-body` and documents these modifiers:

- `.emphasis-tile`
- `.emphasis-tile-inline`
- `.emphasis-tile-secondary` inside `.card-secondary`

The source examples for these compositions intentionally contain `...` placeholders. Do not invent the omitted Emphasis tile internals in canonical Card markup; use the Emphasis tile's own source if/when it becomes available.

## Accessibility

Use meaningful alternative text when an image conveys information and empty `alt=""` when it is decorative. Clickable Cards remain links; selectable Cards retain native form controls. Heading level in a real product should follow page hierarchy, while `examples.html` preserves the exact documented Code & specs example.

## Runtime

Use `buckholt.css` for Card dimensions, spacing, borders, radius, image treatment and interactive states. Do not recreate Card layout or appearance in page-specific CSS.

## Agent rules

- Use `examples.html` as the canonical Card DOM source.
- Use `.card-body` for documented Card content areas.
- Preserve direct-child `<img class="card-img">` markup; do not introduce a `.card-img` wrapper.
- Use `.card-lg`, `.card-secondary`, `.card-horizontal`, `.card-horizontal-right`, `.card-clickable` and `.card-selectable` only as documented.
- Do not promote `.card-sm` or other runtime-only helpers into canonical guidance without documentation evidence.
- Keep native radio/checkbox controls for selectable Cards.
- Do not fill source `...` placeholders by inference.
- Do not recreate Card styling with custom CSS.
