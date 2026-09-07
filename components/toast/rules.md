# Toast

## Purpose
Toasts provide immediate, non-blocking feedback about updates or changes to system status after a user completes an action or task. They should keep users informed without requiring immediate action.

Use Toasts sparingly. The documentation explicitly notes that they can become disruptive if overused.

## When to use
Use a Toast for short-lived feedback that confirms or reports the outcome of an action while allowing the user to continue working.

Do not use a Toast as the only place for important information that the user may need later. Because Toasts can disappear automatically, equivalent information should remain available elsewhere when it needs to be revisited, such as a notification centre or activity log.

For persistent inline feedback, consider Alert instead. For interruptive decisions that require attention before continuing, use Modal.

## Base structure
```html
<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
  <div class="toast-content">
    <div class="toast-body">
      <div class="toast-message">
        <h6>Toast message</h6>
      </div>
      <div class="toast-note">Supporting detail.</div>
    </div>
  </div>
</div>
```

The documented structure uses:
- `.toast`
- `.toast-content`
- optional `.toast-icon`
- `.toast-body`
- `.toast-message`
- optional `.toast-note`
- optional context bar / timestamp content
- optional close button

`.toast-message` is the primary message. `.toast-note` supplies secondary detail.

## Semantic variants
Buckholt documents four status treatments:
- `.toast-info`
- `.toast-success`
- `.toast-warning`
- `.toast-error`

Use the status that matches the meaning and emotional tone of the feedback, not simply the preferred colour.

Documented icon examples include:
- info: `fa-solid fa-circle-info`
- success: `fa-solid fa-circle-check`
- warning: `fa-solid fa-triangle-exclamation`
- error: `fa-solid fa-circle-exclamation`

Use `aria-hidden="true"` when the visible message already communicates the status.

## Example with icon
```html
<div class="toast toast-success" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
  <div class="toast-content">
    <span class="toast-icon">
      <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
    </span>
    <div class="toast-body">
      <div class="toast-message"><h6>Saved successfully</h6></div>
    </div>
  </div>
</div>
```

## Dismissal
The documentation says Toasts persist by default, but may be configured to dismiss automatically after five seconds. They may also include a close button for manual dismissal.

Because a Toast overlays existing content, make it easy to dismiss. When autohide is used, do not put essential, unrecoverable information only in the Toast.

A close control uses the documented Bootstrap dismissal pattern:
```html
<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
```

## Animation
Add `.fade` alongside `.toast` for the documented fade-in/fade-out transition. Bootstrap adds/uses `.show` while visible.

Do not recreate Toast animation with custom component CSS.

## Context and timestamp
The documentation shows Toasts with a context bar and timestamp. Use this supporting area only for concise context that helps identify when or where the feedback came from. Do not allow supporting metadata to compete with the primary message.

## Runtime behaviour
The compiled CSS limits Toast width to a maximum of 22rem, applies Buckholt spacing/radius/shadow tokens, and maps semantic Toast variants to the feedback colour system. `.toast-container` provides positioning/stacking support and multiple Toasts are spaced vertically.

Use the runtime classes; do not copy those values into local CSS.

## Accessibility
- Preserve `role="alert"` for the documented feedback pattern.
- Preserve `aria-live="assertive"` and `aria-atomic="true"` where the canonical examples use them.
- Keep Toast content concise enough to be announced and understood quickly.
- Close buttons need an accessible name.
- Status must be communicated by text, not colour/icon alone.
- If content auto-dismisses, ensure important information is available elsewhere.

## Dependencies
Toast show/hide/dismiss behaviour is Bootstrap behaviour. Load the Bootstrap 5.1.3 bundle used by Buckholt rather than creating a parallel Toast controller.

## Agent rules
- Use Toast for immediate non-blocking feedback after actions/tasks.
- Use `.toast-content` and `.toast-body`; do not flatten the documented structure.
- Choose `.toast-info`, `.toast-success`, `.toast-warning` or `.toast-error` semantically.
- Use Iconography guidance for any additional icons.
- Keep optional notes/context secondary to `.toast-message`.
- Make overlay feedback dismissible/easy to clear.
- Do not use Toast as the sole persistent record of important information.
- Do not recreate Toast dimensions, shadow, radius, spacing, feedback colours or transitions locally.
