# Alert

## Purpose

Alerts are nondisruptive messages confined to a specific area of the UI. They communicate task-generated or system-generated feedback and remain visible until dismissed by the user or until the underlying issue is resolved.

Alerts are often used alongside field-level messages, especially for form/input errors.

## Core anatomy

The message is the only required element.

Optional elements are:

- icon;
- supporting note;
- context bar;
- close button.

Use optional elements only when they add useful context, reinforce meaning or provide an appropriate action.

## Base structure

```html
<div class="alert alert-info" role="alert">
  <div class="alert-content">
    <span class="alert-icon">
      <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
    </span>
    <div class="alert-body">
      <div class="alert-message">
        <h6>Alert message</h6>
      </div>
    </div>
  </div>
</div>
```

The icon is optional. The `.alert-message` is required.

## Variants

Buckholt documents four semantic Alert variants:

- `.alert-info`
- `.alert-success`
- `.alert-warning`
- `.alert-error`

Use the semantic variant that matches the actual feedback meaning. Do not choose a status colour merely for visual emphasis.

Documented examples use:

- information: `fa-solid fa-circle-info`;
- warning: `fa-solid fa-triangle-exclamation`;
- error: `fa-solid fa-circle-exclamation`.

For any other Alert icon choice, use the documented Iconography catalogue rather than guessing.

## Supporting note

Add `.alert-note` inside `.alert-body`, directly beneath `.alert-message`:

```html
<div class="alert-body">
  <div class="alert-message">
    <h6>Alert message</h6>
  </div>
  <span class="alert-note">Supporting context.</span>
</div>
```

Use a note for secondary context or guidance. Keep the main message concise enough to understand at a glance.

## Context bar

Use `.context-bar` as the final element inside `.alert-body` when the Alert needs supporting utility such as:

- a short label;
- a standalone link;
- a CTA button;
- a timestamp.

The context bar is optional. Include it only when it meaningfully supports the Alert without competing with the main message.

Reuse documented Buckholt Button and Link components inside it rather than creating local CTA/link styling.

## Dismissible Alerts

Use the close button only when the Alert is dismissible and does not represent a persistent or critical system state.

A dismissible Alert communicates useful information that is not essential for the user to act on immediately.

Alerts that represent an unresolved condition, such as a system error requiring action, should remain visible until that condition is resolved rather than being freely dismissible.

Documented close control:

```html
<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
```

Where the documented Bootstrap dismiss behaviour is used, load the Bootstrap bundle.

## Width

Alert width is flexible and adapts to its surrounding layout, expanding to fill the associated container/content area. Do not invent a fixed width when the surrounding layout should determine it.

## Typography and content

Write Alert messages in sentence case. Keep the main message concise and direct, expressing the most important information first.

Use the supporting note for extra explanation rather than making the main message unnecessarily long.

## Interaction

For dismissible Alerts, users can close the Alert using the close control.

Buckholt documents keyboard movement between available CTA and close controls with `Tab`, activation with `Enter` or `Space`, and `Esc` as a dismissal interaction.

Preserve logical focus order and native control behaviour when implementing interactive Alert content.

## Accessibility

- use `role="alert"` on the documented Alert container;
- keep meaningful feedback in text, not colour/icon alone;
- mark decorative/supporting icons `aria-hidden="true"` when their meaning is already conveyed by text;
- provide `aria-label="Close"` on the close control;
- use semantic buttons/links for actions;
- preserve keyboard access and visible focus;
- do not allow dismissing a critical/persistent state merely because a close icon is visually convenient.

## Foundation relationships

Read:

- `foundations/colour/` for semantic feedback colours and contrast;
- `foundations/iconography/` for status icons;
- `foundations/spacing/rules.md` before changing internal spacing;
- `foundations/typography/` before changing Alert text styling;
- `foundations/radius/rules.md` before changing Alert radius;
- `components/button/` and `components/link/` when adding context-bar actions.

## Runtime notes

The compiled stylesheet defines `.alert`, `.alert-content`, `.alert-message`, `.alert-icon`, `.alert-link`, `.alert-dismissible`, and the four semantic variants. The runtime uses component-level feedback variables for background, border, message and note colours.

Do not replace these with generic Bootstrap Alert colours or locally hard-coded status colours.

## Agent rules

- Alert is nondisruptive, local feedback; use Modal for genuinely interruptive tasks.
- `.alert-message` is required; icon, note, context bar and close are optional.
- Use exactly the semantic variants `.alert-info`, `.alert-success`, `.alert-warning`, `.alert-error`.
- Use `.alert-note` directly under `.alert-message` for secondary context.
- Put `.context-bar` last inside `.alert-body` and reuse Buckholt Button/Link components inside it.
- Only make an Alert dismissible when the message is noncritical and does not represent a persistent unresolved condition.
- Keep Alert copy concise and sentence case.
- Preserve `role="alert"`, accessible close labelling, keyboard access and visible focus.
- Do not recreate Alert colours, border treatment, spacing, radius or typography with custom CSS.
