# Nested inputs

## Purpose

Nested inputs reveal additional fields only when a parent response makes them relevant. Use them for progressive disclosure so forms stay shorter and easier to scan.

## When to use

Use Nested inputs when additional information is conditional on a user's answer, when a response naturally leads to one follow-up question or a small group of fields, and when hiding irrelevant fields reduces clutter.

Do not use them when the extra information is always required. Avoid long chains of dependent questions; Buckholt advises generally limiting nesting to one level.

## Placement and grouping

Nested inputs must appear immediately after the parent/trigger input that caused them to be revealed. Keep the relationship obvious both visually and semantically.

All conditional fields are grouped inside a `.nested-inputs` wrapper.

```html
<form class="form">
  <div class="input trigger-question">
    <!-- Parent/trigger input -->
  </div>

  <div class="nested-inputs">
    <!-- One or more Buckholt input components revealed by the parent response -->
  </div>
</form>
```

The documentation examples use `.trigger-question` for the trigger example's width on the documentation site. Treat that as example/page layout, not as a required Buckholt component class unless the runtime/component implementation establishes it separately.

## Child inputs

The `.nested-inputs` wrapper is a composition container, not a replacement for the child components. Each revealed field must retain the canonical markup, validation, labels and states of its own Buckholt input type.

## Behaviour

The product implementation is responsible for showing and hiding the nested group based on the parent response. The documentation establishes the relationship and wrapper but does not define a separate Buckholt JavaScript API for conditional logic in the supplied source.

When hidden, conditional controls should not be left in a confusing interactive state. Preserve appropriate semantics and validation logic when the group is revealed or concealed.

## Agent rules

- Put `.nested-inputs` directly after its trigger input.
- Keep nesting to one level in normal use.
- Reuse complete Buckholt child controls inside the wrapper.
- Do not pre-display irrelevant nested fields merely because they are present in the DOM.
- Do not invent a custom nested-input visual treatment; use the runtime wrapper and the child components' own styling.
- Product-specific conditional logic may be written as behaviour glue where needed, but it is not a new Buckholt design-system component.