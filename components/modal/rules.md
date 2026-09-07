# Buckholt Modal

## Status

Modal guidance rebuilt from the supplied Buckholt Overview, Style and Code & specs documentation and checked against the current compiled runtime.

## Purpose

Modals present critical information or request input needed to complete a workflow. Because they interrupt the current task and block interaction with the underlying page, use them for short, infrequent tasks such as editing, configuration, urgent messages or important confirmation.

Do not use a Modal for repeated work that belongs directly on the page.

## When to use

Use a Modal when the system must:

- obtain an immediate response before a user-initiated process can continue;
- present urgent information related to the current task;
- confirm an important decision and clearly explain consequences;
- confirm a destructive or irreversible action, using the appropriate danger treatment where documented.

## Anatomy

A Modal is divided into three main zones:

- `.modal-header` - title, optional eyebrow, optional description and close control;
- `.modal-body` - information and controls needed to complete the task;
- `.modal-footer` - actions for completing or cancelling the task.

The modal also uses a backdrop/overlay that obscures and disables the underlying page while active.

## Canonical structure

```html
<div class="modal fade" tabindex="-1" id="exampleModal" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <div class="text-block">
          <div class="heading">
            <div class="heading-content">
              <h2 class="headline-02">Modal heading</h2>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
        </div>
      </div>

      <div class="modal-body">
        <div class="text-block">
          <p>Modal body content goes here.</p>
        </div>
      </div>

      <div class="modal-footer">
        <div class="button-set">
          <button type="button" class="btn btn-ghost">
            <span class="button-label">Cancel</span>
          </button>
          <button type="button" class="btn btn-primary">
            <span class="button-label">Confirm</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

Use the Button and Text block component guidance for nested content rather than recreating their styling inside Modal.

## Triggering

Buckholt uses Bootstrap modal behaviour:

```html
<button type="button" class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal">
  <span class="button-label">Open modal</span>
</button>
```

The target must match the Modal `id`.

## Heading and description

Use a brief verb phrase that describes the Modal task or purpose. When a trigger label describes the task, keep the Modal title consistent with it rather than changing terminology.

An optional eyebrow may clarify scope or context. A short description may follow the heading when the purpose is not already obvious; do not add explanatory copy merely because the structure allows it.

Choose the semantic heading level from page hierarchy. The documentation examples use Buckholt headline type classes for visual treatment, but semantic level is independent from visual type style.

## Close behaviour

Use the documented close control:

```html
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
```

The close control dismisses the Modal without submitting data.

## Footer actions

Use Buckholt Button and Button-set guidance. Actions should clearly reflect the Modal task. For important confirmation, the title and primary action wording should align with the action being confirmed.

Do not turn the footer into a toolbar of unrelated actions.

## Size

Buckholt documents the default/modal size plus Bootstrap modifier classes on `.modal-dialog`:

- `.modal-sm` - small;
- no size modifier - default/medium;
- `.modal-lg` - large;
- `.modal-xl` - extra large.

Choose the smallest size that comfortably fits the content. Small suits short messages/forms; large or extra large suits complex content such as data tables.

The Overview wording contains a duplicated "small" when describing the size count; follow the actual documented modifier set and canonical code examples above.

## Placement

The default Modal is positioned toward the top of the viewport. Use `.modal-dialog-centered` on `.modal-dialog` for the documented vertically centred form:

```html
<div class="modal-dialog modal-dialog-centered">
```

## Long content

Avoid long scrolling Modal content when possible. If it is genuinely required, add `.modal-dialog-scrollable` to `.modal-dialog` so the `.modal-body` scrolls independently:

```html
<div class="modal-dialog modal-dialog-scrollable">
```

## Composition

Modal is a container for other Buckholt components. Content such as forms, tables or progress indicators may use the available Modal body width where documented. Reuse the canonical component markup rather than styling approximations inside the Modal.

## Accessibility

- Keep `tabindex="-1"` on the Bootstrap Modal root where shown by the canonical pattern.
- Keep `aria-hidden="true"` on the inactive Modal pattern used by the documentation.
- The close control must have an accessible name such as `aria-label="Close"`.
- Modal headings must be meaningful and use semantic heading hierarchy.
- Destructive decisions must explain consequences in text; do not rely on colour alone.
- Do not create custom focus trapping, backdrop or keyboard behaviour when Bootstrap already provides the documented Modal interaction.

## Runtime implementation

Buckholt relies on Bootstrap's Modal structure and JavaScript, with Buckholt styling applied through the compiled runtime. Load the Bootstrap bundle for working prototypes.

Do not recreate Modal positioning, backdrop, sizing, scrolling, focus handling, transitions or container styling with local CSS.

## Agent rules

- Use Modal only for short, interruptive tasks that genuinely need attention before the user returns to the page.
- Use `.modal > .modal-dialog > .modal-content` with documented header/body/footer structure.
- Use Text block/Heading attachment for heading content and Button/Button set for footer actions.
- Keep trigger and Modal title terminology consistent.
- Use `.modal-sm`, `.modal-lg` or `.modal-xl` only when the documented size is needed.
- Use `.modal-dialog-centered` only for the documented centred placement.
- Use `.modal-dialog-scrollable` only when long content cannot reasonably be avoided.
- Use Bootstrap data attributes for triggering/dismissal rather than inventing custom Modal JavaScript.
- Do not reproduce Modal styling or behaviour with custom CSS.
