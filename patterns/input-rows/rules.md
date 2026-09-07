# Input rows pattern

## Purpose

Input rows arrange related input fields side by side. Use the pattern to reduce unnecessary vertical scrolling, keep connected information visually grouped and support faster data entry where the fields form one meaningful set.

This pattern sits above the `components/input-row/` implementation. The component provides the row structure; this pattern explains when and how to use it in a complete experience.

## When to use

Use an Input row when fields are genuinely related and are easier to understand together than separately, for example compact sets such as payment or date-related information.

Do not put unrelated questions side by side merely to save vertical space. The visual grouping should reflect a real relationship in the information.

## Structure

Use the documented Input row component:

```html
<div class="row input-row">
  <div class="col">
    <!-- complete Buckholt input -->
  </div>
  <div class="col">
    <!-- complete Buckholt input -->
  </div>
</div>
```

Each column contains a complete Buckholt input including its own label, assistive/helper content and validation markup where needed.

## Width and proportions

Bootstrap's grid controls field widths:

- `.col` gives flexible equal-width inputs.
- `.col-*` classes define fixed proportions in the 12-column grid.
- responsive classes such as `.col-md-*` and `.col-lg-*` determine when fields share a row and when they wrap/stack.

Choose proportions according to the expected data rather than making every field equal by default.

## Responsiveness

Input rows are intended to display inline where sufficient space exists and stack when space becomes constrained. Use Bootstrap breakpoint classes to achieve this rather than custom layout CSS.

The responsive goal is to keep fields readable, scannable and usable without cramped controls or horizontal scrolling.

## Validation

An Input row is a visual grouping only. Each input remains an independent field with its own validation rules and inline feedback.

Do not apply a single generic error state to the whole row when one child input is invalid. Show contextual validation against the affected input.

## Typography and component styling

The child input components own their own labels, typography, colours, states and internal spacing. Read the relevant component guidance for Text input, Number input, Select, Dropdown and any other controls used in the row.

## Agent rules

- Use Input rows only for genuinely related fields.
- Keep each child as a complete Buckholt input component.
- Use Bootstrap columns for width and responsive behaviour.
- Let each input validate independently.
- Do not invent row-level error styling.
- Do not use local CSS to force side-by-side behaviour where Bootstrap breakpoints should control wrapping.
- Prefer content-driven column proportions over arbitrary equal widths.
- Read `components/input-row/rules.md` for the implementation contract.