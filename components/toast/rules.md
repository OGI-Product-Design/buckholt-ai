# Toast

## Verification

Source-audited against the Buckholt Toast Usage, Style and Code & specs HTML pages supplied on 7 September 2026. Use `examples.html` for exact DOM structure.

## Purpose

Toasts provide temporary system feedback without taking over the page. Buckholt documents message, note, small-note, icon, context-bar, dismissible, status, animation and Toast-container examples.

## Canonical markup

`examples.html` preserves the exact Code & specs structures. Important source details include:

- `.toast > .toast-content > .toast-body > .toast-message`;
- `.toast-note` for supporting text;
- `.toast-icon` directly before `.toast-body` where documented;
- `.toast-contextbar` inside `.toast-body`;
- `.btn-close` with `data-bs-dismiss="toast"` for dismissible examples;
- `.toast-info`, `.toast-success`, `.toast-warning`, `.toast-error` status classes;
- `.fade.show` for the documented visible animation state;
- `.toast-container` for grouped Toasts.

The supplied success status example literally uses `fa-solid fa-circle-info`. Preserve that exact icon in canonical source; do not silently replace it with a check icon because another component uses one.

## Behaviour and dependencies

Toast dismissal/autohide behaviour relies on Bootstrap Toast JavaScript. Preserve the documented `data-bs-autohide` values where the source provides them and use Bootstrap rather than custom Toast lifecycle code.

## Accessibility

Keep the documented `role="alert"` and source ARIA attributes. Production timing and live-region behaviour must remain appropriate to the importance of the message; do not rely on colour/icon alone for meaning.

## Agent rules

- `examples.html` is canonical for Toast DOM and source icons.
- Use `.toast-contextbar`, not a generic action wrapper.
- Preserve source status classes, close-button attributes and container structure.
- Do not normalize the success icon or other source details by inference.
- Use Bootstrap Toast behaviour and `buckholt.css`; do not recreate Toast styling/lifecycle locally.
