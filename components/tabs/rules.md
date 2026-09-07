# Tabs

## Purpose

Tabs organise related content into categories that switch in place without navigating away from the current page. They reduce cognitive load for forms, settings, dashboards and similar grouped content.

Do not use Tabs to filter the same content, indicate progress through a linear journey, or where users need to compare groups simultaneously.

## Canonical structure

```html
<div class="tabs">
  <div class="tab-items">
    <button type="button" class="btn btn-ghost tab-scroll tab-scroll-left" aria-label="Scroll tabs left" disabled>
      <div class="btn-icon"><i class="fa-regular fa-chevron-left"></i></div>
    </button>

    <div class="tab-items-scroll">
      <ul class="nav nav-underline" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="example-tab-1" data-bs-toggle="pill" data-bs-target="#example-panel-1" type="button" role="tab" aria-controls="example-panel-1" aria-selected="true">Tab 1</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="example-tab-2" data-bs-toggle="pill" data-bs-target="#example-panel-2" type="button" role="tab" aria-controls="example-panel-2" aria-selected="false">Tab 2</button>
        </li>
      </ul>
    </div>

    <button type="button" class="btn btn-ghost tab-scroll tab-scroll-right" aria-label="Scroll tabs right">
      <div class="btn-icon"><i class="fa-regular fa-chevron-right"></i></div>
    </button>
  </div>

  <div class="tab-content">
    <div class="tab-pane fade active show" id="example-panel-1" role="tabpanel" aria-labelledby="example-tab-1" tabindex="0">...</div>
    <div class="tab-pane fade" id="example-panel-2" role="tabpanel" aria-labelledby="example-tab-2" tabindex="0">...</div>
  </div>
</div>
```

Tabs use Bootstrap pill behaviour for selection/content switching and Buckholt classes for the surrounding treatment.

## States

Exactly one tab is selected at a time. One tab is preselected by default, usually the first. Buckholt documents selected, unselected, hover, focus and disabled states.

Keep `.active`, `aria-selected`, the trigger `data-bs-target` and matching panel IDs synchronized.

## Scrollable tabs

When tabs overflow their container, scroll buttons should be automatically available. Buckholt supplies `tabs.js` for this behaviour.

The structure requires `.tab-items`, `.tab-items-scroll`, `.tab-scroll-left` and `.tab-scroll-right`. The script detects overflow, toggles `.has-overflow`, disables the left/right controls at the ends and scrolls by 60% of the visible width using smooth scrolling.

Load `components/tabs/tabs.js` in addition to Bootstrap JS when using the Buckholt overflow enhancement.

## Icons

Tabs may include documented Font Awesome icons. Icon-only tabs are allowed only where icons are easily recognised and the space is small/clearly defined. Icon-only tabs must have a Tooltip on hover and focus that provides the accessible description.

## Agent rules

- Use Tabs for in-page content switching; use Page navigation for separate pages.
- Use `.tabs`, `.tab-items`, `.tab-items-scroll`, `.nav.nav-underline` and `.tab-content`.
- Use native button tab triggers with Bootstrap `data-bs-toggle="pill"`.
- Keep ARIA/ID relationships correct.
- Exactly one tab selected at a time.
- Use the supplied `tabs.js` for documented overflow controls; do not reinvent it.
- Do not use Tabs as a stepper or content filter.
- Add Tooltip support for icon-only tabs.