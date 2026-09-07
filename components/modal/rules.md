# Modal

## Verification

Source-audited against the Buckholt Modal Usage, Style and Code & specs HTML pages supplied on 7 September 2026. For exact DOM structure, use `examples.html`; it preserves the documented Code & specs examples and deliberate `...` placeholders.

## Purpose

Modals present important information or request input needed before the user returns to the underlying page. Use them for short, infrequent, interruptive tasks such as editing, configuration, confirmation or urgent information.

Avoid moving repeated or lengthy work into a Modal when it belongs directly on the page.

## Canonical markup

Do not reconstruct Modal markup from this file. Use `examples.html`.

The Code & specs source establishes:

- `.modal.fade > .modal-dialog > .modal-content`;
- `.modal-header`, `.modal-body` and `.modal-footer` regions;
- Heading attachment/Text block structure in the header;
- `.button-set` in the footer;
- `.btn-close` with `data-bs-dismiss="modal"` and `aria-label="Close"`;
- a separate Button example for triggering a Modal with `data-bs-toggle="modal"` and `data-bs-target`;
- `.modal-dialog-scrollable`, `.modal-dialog-centered`, `.modal-sm`, `.modal-lg` and `.modal-xl` as documented dialog modifiers.

The base Code & specs example uses `<h3 class="headline-02">Modal heading</h3>`. Preserve that in canonical markup. A consuming application may choose the semantic heading level required by its page hierarchy without rewriting the documented source example.

Do not add an `id`, `aria-hidden`, custom labels or product-specific content to the canonical base example unless the Buckholt source itself provides them.

## Content and actions

Keep the Modal title and task language concise and consistent with the trigger. Use Buckholt components inside the body and footer rather than recreating them locally.

Choose the smallest documented size that comfortably fits the content. Use the scrollable modifier only where long content cannot reasonably be avoided.

## Behaviour and dependencies

Modal relies on Bootstrap's Modal JavaScript for opening, dismissal, focus handling, backdrop and keyboard behaviour. Do not recreate those behaviours with custom JavaScript or page-specific CSS.

## Accessibility

Preserve the documented close control and real Button semantics. Application-level IDs/ARIA relationships required to wire a real Modal may be added by the consuming application, but they are not canonical unless present in Code & specs.

## Agent rules

- `examples.html` is the canonical Modal DOM source.
- Preserve the documented header/body/footer hierarchy and modifier placement.
- Do not replace source headings, wrappers, Button order or deliberate placeholders with inferred markup.
- Use Bootstrap Modal behaviour and Buckholt runtime styling.
- Do not recreate Modal layout, sizing, backdrop or focus behaviour locally.
