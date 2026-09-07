# Page navigation

## Purpose

Page navigation moves between closely related pages within the same section or feature area. Although it can look similar to Tabs, Page navigation links to separate pages; Tabs switch content in place.

## Canonical markup

When Buckholt provides code examples, preserve that documented structure exactly. Do not add wrappers, icon containers, ARIA attributes, labels or alternative class structures to the canonical example unless the Buckholt documentation itself shows them.

Documented base structure:

```html
<ul class="nav">
  <li class="nav-item">
    <a class="nav-link active" href="#">
      Nav item
    </a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">
      Nav item
    </a>
  </li>
</ul>
```

The documented classes are `.nav`, `.nav-item` and `.nav-link`, with `.active` on the current item.

## Icons

Buckholt explicitly documents icons in Page navigation.

The Code & specs guidance says to add Font Awesome icons **directly inside the `<a>`**. The documented example is:

```html
<li class="nav-item">
  <a class="nav-link" href="#"><i class="fa-regular fa-ghost"></i>Nav item
  </a>
</li>
```

Do not wrap Page navigation icons in `<span class="icon">`, `.btn-icon`, or any other shared icon wrapper. Those structures belong to other components when their own documentation specifies them.

The Usage guidance states that Page navigation icons are positioned to the **left** of the label and should not appear above, below or to the right.

The documentation site itself also uses direct icon markup in Page navigation, for example `fa-sliders`, `fa-palette` and `fa-code`. Component-specific documented code takes precedence over a generic icon-wrapper convention.

## When to use

Use Page navigation for a small set of closely related sibling pages or views that navigate to separate pages. Do not use it for global navigation or content that should switch in place without page navigation.

## States

Buckholt documents selected, unselected, hover, focus and disabled states. Use `.active` for the selected item and do not mark multiple items active.

## Relationship to Tabs

- Page navigation changes page/URL.
- Tabs change visible content in place.
- Do not use `data-bs-toggle="pill"` for Page navigation.

## Agent rules

- Start from the documented `.nav > .nav-item > .nav-link` markup.
- Treat Buckholt Code & specs markup as canonical when present.
- Never "improve", normalize or reinterpret canonical examples by inserting undocumented wrappers or classes.
- For Page navigation icons, place the documented Font Awesome `<i>` directly inside the anchor before the label.
- Do not infer Page navigation icon structure from Link, Tag, Button, Text block or any other component.
- If production accessibility or application requirements need additional attributes, add them deliberately in the consuming application without rewriting the canonical Buckholt example in this repository.
- If the documentation does not establish markup for a variation, report the gap instead of inventing one.