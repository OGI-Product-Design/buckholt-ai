# Page navigation

## Purpose

Page navigation moves between closely related pages within the same section or feature area. It sits near the top of the page and lets users switch between sibling pages without relying only on side navigation or Breadcrumb.

Although it can look similar to Tabs, each Page navigation item links to a separate page. Use Tabs when content changes in place within the current page.

## Canonical structure

```html
<nav aria-label="Section navigation">
  <ul class="nav">
    <li class="nav-item">
      <a class="nav-link active" href="/usage/" aria-current="page">Usage</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="/style/">Style</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="/code/">Code &amp; specs</a>
    </li>
  </ul>
</nav>
```

The documented base uses `.nav`, `.nav-item` and `.nav-link`. Apply `.active` only to the page currently being viewed. Because this component navigates between pages, use links rather than tab buttons.

## When to use

Use Page navigation for a small set of closely related sibling pages, different views of the same content area, or a local section that should remain easy to switch between at the top of the page.

Do not use it for global navigation, primary application structure, large destination sets, or content that can switch without a page load.

## States

Buckholt documents selected, unselected, hover, focus and disabled states. Only one item may be selected at a time.

Use `.active` for the selected link and `aria-current="page"` in production markup. Do not mark more than one item current.

A disabled destination should only be shown disabled where the documentation/product genuinely requires it; do not use disabled navigation as a substitute for permission-aware information architecture.

## Content and icons

Keep labels short and parallel so the set is easy to scan. Icons may be used where documented and helpful, but text labels remain the normal navigation affordance.

## Relationship to Tabs

- Page navigation changes URL/page.
- Tabs change the visible content in place.
- Do not use `data-bs-toggle="pill"` for Page navigation.
- Do not recreate Page navigation with a custom tab system.

## Agent rules

- Use semantic navigation and real links.
- Use `.nav > .nav-item > .nav-link`.
- Apply `.active` to one current item only.
- Add `aria-current="page"` to the current production link.
- Use Page navigation only for sibling pages, not in-page panels.
- Do not invent overflow behaviour for large navigation sets; the usage guidance explicitly warns against many destinations.
- Reuse Buckholt Link/Iconography guidance rather than creating local styles.