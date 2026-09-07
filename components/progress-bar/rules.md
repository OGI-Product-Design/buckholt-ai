# Progress bar

## Verification

Source-audited against the Buckholt Progress bar Usage, Style and Code & specs HTML pages supplied on 7 September 2026. Use `examples.html` for exact DOM structure.

## Purpose

Progress bars communicate the status of an ongoing process. Buckholt documents determinate progress, indeterminate progress, compact size, supporting text, success, error, inactive state and expressive palette variants.

## Canonical markup

Do not reconstruct Progress bar markup from prose. `examples.html` preserves each Code & specs variation separately.

Documented structures include:

- `.progress-container` with `.progress-header`, `.progress-label`, `.progress` and child `.progress-bar`;
- determinate ARIA values and inline width on `.progress-bar`;
- indeterminate `.progress-bar-indeterminate` without fabricated numeric ARIA progress;
- `.progress-sm` for the compact bar;
- `.progress-helper` and `.progress-note` in their own source examples;
- `.is-valid`, `.is-invalid` and `.progress-inactive` on `.progress`;
- `.invalid-feedback` for the error variation;
- `.expressive-secondary`, `.expressive-tertiary` and `.expressive-quaternary` as documented palette modifiers.

Do not merge helper text, note text, validation and state markup into one invented “complete” example. Use the exact variation shown by the source.

## Behaviour and accessibility

For determinate progress, expose real `aria-valuenow`, `aria-valuemin` and `aria-valuemax` values and keep visual width consistent with actual progress. For indeterminate progress, do not invent a percentage or numeric value.

Keep a meaningful label and readable error text where the documented state needs it; colour/icon alone must not carry critical status meaning.

## Runtime

Let `buckholt.css` provide bar height, colours, state icons and animation. The current compatibility stylesheet contains the verified correction for the documented Progress error status icon; do not duplicate that fix locally.

## Agent rules

- `examples.html` is canonical for Progress bar DOM.
- Keep each documented variation separate instead of combining optional elements by inference.
- Use `.progress-sm`, `.progress-bar-indeterminate`, `.is-valid`, `.is-invalid`, `.progress-inactive` and expressive modifiers only as documented.
- Preserve real progress ARIA semantics.
- Do not recreate Progress styling, state icons or animation with local CSS.
