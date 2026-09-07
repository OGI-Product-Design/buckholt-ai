# Alert

## Verification

Source-verified against the Buckholt Alert Usage, Style and Code & specs HTML pages supplied on 7 September 2026. For exact DOM structure, use `examples.html`; its component markup is extracted verbatim from the Code & specs page.

## Purpose

Alerts are nondisruptive messages confined to a specific area of the UI. They communicate task-generated or system-generated feedback and remain visible until dismissed or until the underlying issue is resolved. Alerts are often used alongside field-level messages, especially for form/input errors.

## Anatomy

The alert message is the required element. Buckholt documents these optional additions:

- `.alert-icon`
- `.alert-note`
- `.alert-contextbar`
- `.btn-close`

Do not substitute `.context-bar` for the documented `.alert-contextbar` class.

## Canonical markup

Do not reconstruct Alert markup from this prose. Copy the relevant Code & specs structure from `examples.html` exactly. The documented base hierarchy uses `.alert`, `.alert-content`, `.alert-body` and `.alert-message` with `role="alert"` on the outer Alert.

## Status variants

Buckholt documents:

- `.alert-info`
- `.alert-success`
- `.alert-warning`
- `.alert-error`

The Code & specs source shows the status examples and their icon markup exactly. Do not replace those icons or wrappers in canonical examples even where another icon might appear more semantically obvious.

## Supporting content

Use `.alert-note` for additional context beneath the main message. The documentation also demonstrates a smaller secondary note inside `.alert-note` using `<p><small>…</small></p>`.

Use `.alert-contextbar` for supporting actions/content. The documented example places it inside `.alert-body` and uses a Buckholt Button inside it.

## Close and animation

Buckholt uses `.btn-close` with `data-bs-dismiss="alert"` and `aria-label="Close"` for a dismissible Alert. Bootstrap's JavaScript bundle is required for that dismiss behaviour.

The documented animation treatment adds `.fade.show` to the Alert.

## Content and interaction

Keep the main message concise and in sentence case. Use supporting content for detail rather than overloading the message.

For dismissible Alerts, preserve keyboard access to actions and the close control. Feedback must not depend on colour or icon alone.

## Runtime

Use the Buckholt classes in `css/buckholt.css`; do not replace them with generic Bootstrap Alert styling or local status colours. Load Bootstrap JavaScript where dismiss behaviour is required.

## Agent rules

- Use `examples.html` as the canonical markup source.
- Preserve `.alert > .alert-content` and the documented body/message wrappers.
- Use `.alert-contextbar`, not a generic `.context-bar` wrapper.
- Use only documented status modifiers.
- Keep `role="alert"` and the documented close-button attributes.
- Do not invent wrappers, status icons, dismissibility or custom Alert CSS.
