# Tabs

## Verification

Source-audited against the Buckholt Tabs Usage, Style and Code & specs HTML pages supplied on 7 September 2026. Use `examples.html` for exact DOM structure.

## Purpose

Tabs switch related content in place within the current page. Use Page navigation instead when each item links to a separate page/URL.

## Canonical markup

`examples.html` preserves the exact Code & specs source, including the documented outer classes, Bootstrap pill attributes, overflow controls and direct icon placement.

Important source details:

- outer source wrapper: `.tabs.element_block.align.wp-block-acf-tabs`;
- `.tab-items > .tab-items-scroll > .nav.nav-underline`;
- tab controls are `<button class="nav-link">` with `data-bs-toggle="pill"`, `data-bs-target`, `role="tab"`, `aria-controls` and `aria-selected`;
- panels use `.tab-pane.fade`, with `.active.show` on the current panel;
- overflow adds ghost `.tab-scroll-left` / `.tab-scroll-right` Buttons around `.tab-items-scroll`;
- the icon example places the Font Awesome `<i>` directly inside `.nav-link` before the label.

Do not add `.icon` wrappers or replace the source outer classes in canonical examples merely because some are also associated with the documentation/WordPress implementation. They are present in the supplied Code & specs block and remain source evidence unless Buckholt documentation establishes a smaller canonical root later.

## JavaScript

Bootstrap Tabs/Pills provide selection behaviour. `components/tabs/tabs.js` is the supplied Buckholt overflow enhancement: it detects overflow, controls left/right scroll Buttons, scrolls smoothly and updates disabled states on scroll/resize.

Load the supplied script when the documented overflow form is used rather than recreating it locally.

## Accessibility

Keep one selected Tab/panel pair, preserve matching IDs/targets/ARIA relationships, and maintain keyboard-visible focus.

## Agent rules

- `examples.html` is canonical for Tabs DOM.
- Use Tabs for in-page switching; use Page navigation for separate pages.
- Preserve direct icon placement and exact Bootstrap attributes shown by source.
- Use the supplied `tabs.js` for overflow behaviour.
- Do not invent alternate Tabs wrappers, overflow logic or local styling.
