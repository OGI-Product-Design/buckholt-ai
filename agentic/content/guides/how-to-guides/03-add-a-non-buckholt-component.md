---
title: Add a non-Buckholt component
lead: When Buckholt has no component for what the design needs, add it as a flagged, registered extension.
---

## Check Buckholt first

Look in Buckholt core, its HTML and CSS reference and its documentation. Only build an extension when nothing there fits. Then check the extensions register: if an entry already exists, reuse it.

## In Figma

{{agent:extend}} builds the component on the Extensions page with an `x/` prefix and adds a register entry. Library components are always used as instances; they are never detached or changed.

## In code

{{agent:build}} builds it in `/extensions/[product]/`:

1. Use Buckholt tokens (CSS custom properties) only. No hard-coded colours, spacing, radii or fonts.
2. Prefix every class with `x-`.
3. Add `data-buckholt="false"` to the component's root element.
4. Add or complete the register entry, so it has both its Figma half and its code half.

```css "Tokens only"
.x-example {
  padding: var(--padding-05);
  border: var(--border-width) solid var(--ui-border-02);
  border-radius: var(--border-radius-md);
  color: var(--text-primary);
}
```

## Checks

- {{agent:align}} checks that extension components are flagged and register entries have both halves.
- {{agent:audit}} flags hard-coded values and `x-` components with no register entry.
- {{agent:relay}} maps each element to a Storybook component or a flagged extension at handoff.
