# Buckholt Tooltip

## Status

Tooltip guidance rebuilt from the supplied Buckholt Usage, Style and Code & specs documentation and checked against `../../css/buckholt.css`.

## Purpose

Tooltips provide contextual, nonessential information on hover or focus. They clarify an existing control or term without interrupting the main task.

Use a Tooltip for supplementary explanation that is useful but not required to understand or complete the interface. Do not place essential instructions, required validation information or critical content only inside a Tooltip.

## Trigger markup

Buckholt uses Bootstrap tooltip attributes on the triggering element:

```html
<button type="button"
        class="btn btn-secondary"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-title="Tooltip text">
  <span class="button-label">Button label</span>
</button>
```

`data-bs-title` supplies the tooltip text. The trigger remains the real interactive control and must have its own accessible name independently of the Tooltip.

## Placement

Use `data-bs-placement` to request one of the documented directions:

- `top`
- `right`
- `bottom`
- `left`

Positioning is handled by Bootstrap/Popper. Do not manually position the generated Tooltip with local layout CSS.

## States and interaction

Buckholt documents two Tooltip states: hidden/off and visible/on. The visible state is associated with hover or focus interaction.

Mouse behaviour: hovering the trigger shows the Tooltip and moving away dismisses it. Keyboard users must be able to reach the trigger and receive equivalent contextual information on focus where the integration supports it.

Definition-style Tooltip interactions may differ where the specific component documentation says so; do not generalise those behaviours to every Tooltip.

## Initialisation

Tooltips depend on Bootstrap JavaScript with Popper. The documented Buckholt initialisation is:

```js
const tooltipTriggers = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltips = Array.from(tooltipTriggers).map(el => {
  return new bootstrap.Tooltip(el, {
    offset: [0, 4],
    delay: { show: 800, hide: 100 }
  });
});
```

Use `bootstrap.bundle.min.js`, which includes Popper, unless the application already provides the equivalent Bootstrap/Popper runtime.

The offset and delay above are documented Buckholt defaults. Do not silently replace them with arbitrary timing or spacing.

## Generated markup

Bootstrap generates the visible Tooltip container. Do not author this generated structure directly in product markup:

```html
<div class="tooltip bs-tooltip-auto" role="tooltip">
  <div class="tooltip-arrow"></div>
  <div class="tooltip-inner">Tooltip text</div>
</div>
```

This structure is useful for understanding styling only; the trigger attributes and Bootstrap initialisation are the authoring contract.

## Content

Tooltip text should be concise and contextual. Keep it focused on clarification rather than moving substantial content out of the main interface.

Because Tooltip content is nonessential by definition, the interface must still make sense if the Tooltip is not seen.

## Accessibility

- The trigger must remain keyboard focusable when it is an interactive control.
- The trigger needs its own accessible name; do not rely on Tooltip text as the control's only name.
- Do not hide required instructions or error recovery only in a Tooltip.
- Ensure equivalent information is available to keyboard users, not only pointer users.
- Avoid using Tooltip as a replacement for persistent helper text when the information is necessary for task completion.

## Runtime implementation

The compiled runtime styles Bootstrap's `.tooltip`, `.tooltip-inner` and arrow structure and defines Buckholt tooltip width, padding and colour variables. Bootstrap/Popper controls placement and generated markup.

Some existing Buckholt examples elsewhere in the design-system site explicitly set `data-bs-trigger="hover"`. That is not the canonical Tooltip component example on these Tooltip pages. Prefer the Tooltip component's documented hover/focus behaviour unless the consuming component explicitly documents a narrower trigger.

## Agent rules

- Use Tooltips only for contextual, nonessential information.
- Put `data-bs-toggle="tooltip"` and `data-bs-title` on the real trigger element.
- Use documented `data-bs-placement` values when placement needs to be specified.
- Initialise with Bootstrap Tooltip and Buckholt's documented offset `[0, 4]` and delay `{ show: 800, hide: 100 }`.
- Do not manually author `.tooltip` generated markup in application HTML.
- Keep the trigger independently accessible and understandable.
- Do not use Tooltip to carry essential instructions, validation or primary content.
- Do not recreate Tooltip positioning, arrow, spacing or visual styling with custom CSS.
