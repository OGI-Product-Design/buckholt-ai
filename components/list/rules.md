# Buckholt List

## Status

List guidance rebuilt from the supplied Buckholt Overview, Style and Code & specs documentation and checked against the current compiled runtime.

## Purpose

The List component presents related content in a clear, scannable sequence. Use semantic HTML list elements so the relationship between items is preserved for assistive technology.

## When to use

Use a List when users need to scan related items, steps, requirements, options or grouped information.

Use an unordered list when item order does not matter. Use an ordered list when sequence or ranking matters.

Do not use a List merely to align unrelated content that would be better represented by another component such as Key-value Pair, Table or navigation pattern.

## Base unordered list

```html
<ul class="list">
  <li class="list-item">List item</li>
  <li class="list-item">List item</li>
  <li class="list-item">List item</li>
</ul>
```

## Ordered list

```html
<ol class="list">
  <li class="list-item">First item</li>
  <li class="list-item">Second item</li>
  <li class="list-item">Third item</li>
</ol>
```

## List heading

Buckholt supports an optional first `.list-heading` item. Its marker is visually suppressed.

```html
<ul class="list">
  <li class="list-heading">List heading</li>
  <li class="list-item">List item</li>
  <li class="list-item">List item</li>
</ul>
```

For an ordered list with a heading item, the documentation sets the heading item to `value="0"` so the first real item starts at 1:

```html
<ol class="list">
  <li class="list-heading" value="0">List heading</li>
  <li class="list-item">First item</li>
  <li class="list-item">Second item</li>
</ol>
```

Use this documented pattern rather than compensating for numbering in custom CSS.

## Nested items

Lists may contain nested lists when hierarchy is genuinely useful. Buckholt documents distinct markers by level: unordered Level 1 uses disc bullets and Level 2 uses circles; ordered Level 1 uses numbers and Level 2 uses letters.

Keep nesting shallow and avoid deeply nested structures that become difficult to scan.

## Unstyled list

Use `.list-unstyled` when markers add visual noise but list semantics are still appropriate, such as navigation, settings summaries, metadata or compact action groups:

```html
<ul class="list list-unstyled">
  <li class="list-heading">List heading</li>
  <li class="list-item">List item</li>
  <li class="list-item">List item</li>
</ul>
```

Do not replace semantic lists with arbitrary divs just because markers are not wanted.

## Icons

Icons may replace standard bullets to communicate meaning such as task status, priority or item type. Use them sparingly and consistently.

Use `.list-icon` as the icon container:

```html
<ul class="list">
  <li class="list-heading">Validation</li>
  <li class="list-item">
    <span class="list-icon text-success">
      <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
    </span>
    Complete
  </li>
  <li class="list-item">
    <span class="list-icon text-error">
      <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
    </span>
    Needs attention
  </li>
</ul>
```

Use the Iconography catalogue for product icon choices. Do not rely on icon shape or colour alone when the status matters; include meaningful item text.

## Content guidance

- Keep list items parallel in structure and tone.
- Keep individual items concise where possible.
- Use ordered lists only when sequence matters.
- Use icons only when they add information rather than decoration.
- Use `.list-heading` only when a heading belongs visually within the list itself; otherwise prefer a semantic heading outside the list.

## Accessibility

- Use `<ul>` for unordered collections and `<ol>` for ordered sequences.
- Use `<li>` for each item.
- Preserve list semantics even for `.list-unstyled`.
- Supporting icons should use `aria-hidden="true"` when the text already communicates their meaning.
- Do not communicate status through colour/icon alone.
- Avoid fake lists constructed from paragraphs or line breaks.

## Runtime implementation

Buckholt's runtime provides the List marker, spacing, nested marker and icon-container behaviour. Do not recreate list markers or internal spacing with local CSS.

## Agent rules

- Use `.list` on semantic `<ul>` or `<ol>` elements.
- Use `.list-item` for ordinary items.
- Use optional `.list-heading` as the documented first-item heading pattern.
- For ordered Lists with `.list-heading`, use `value="0"` on that heading so visible numbering starts at 1.
- Use `.list-unstyled` to remove markers while retaining semantic list markup.
- Use `.list-icon` only when an icon genuinely carries useful meaning, and select icons from Buckholt Iconography.
- Keep nesting shallow and use semantic nested lists.
- Do not reproduce marker, indentation, spacing or icon layout with custom CSS.
