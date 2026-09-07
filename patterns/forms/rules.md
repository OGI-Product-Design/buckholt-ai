# Forms pattern

## Purpose

The Forms pattern explains how to assemble Buckholt form components into complete form experiences. Read it when creating a whole form, not just an individual control.

The lower-level `components/form/` guidance defines the Form component structure. This pattern adds page-level composition, labelling, action placement and guidance for short, long, progressive and contextual forms.

## Default layout

Buckholt uses **top-aligned labels by default**. Labels sit directly above their input, creating a consistent left edge and keeping the label close to the control. Left-aligned labels are not currently supported.

Default to vertically stacked inputs unless another documented pattern, such as Input rows, clearly improves usability.

Use Input rows sparingly. Too many inline fields make forms harder to scan and increase cognitive load.

## Required and optional fields

Choose one labelling strategy according to the form type and apply it consistently.

### Simple forms

Shorter user/consumer-facing forms such as sign-up, contact or checkout flows tend to contain mostly required fields.

- label only optional fields as `(optional)`;
- avoid repeating `(required)` on nearly every field.

### Complex forms

Longer product-focused forms often contain many properties/settings and mostly optional fields.

- label only required fields as `(required)`;
- avoid repeating `(optional)` on nearly every field.

Where many optional fields are necessary, group them into a meaningful section where possible to reduce visual noise.

## Grouping and hierarchy

Group fields according to the user's task and the information they represent, not simply by available space.

Use:

- `components/form/` for the form composition layer;
- Text block for form/section introductions where needed;
- Input rows for a small set of genuinely related inline fields;
- Nested inputs / progressive disclosure for conditional information;
- the Page layout pattern to place complete forms into Panels, Panes and Frames.

Each field retains its own label, helper/assistive content, validation and state behaviour.

## Action placement

Form actions should appear at the point where the user completes the form rather than at the top of a dedicated-page form.

For standard in-page forms and layouts that do not use right-aligned action patterns:

- primary action is left aligned;
- primary appears before secondary or ghost actions.

For progressive forms, wizards and structured containers such as Modals and side panels:

- actions may be right aligned;
- primary appears after secondary/ghost actions.

Follow Button-set guidance for the actual button order/markup.

Avoid top-aligned submit buttons on dedicated-page forms. If actions genuinely need to remain persistent, use an appropriate pinned footer/tray pattern when one is defined rather than duplicating buttons at the top.

## Longer forms

There is no universal maximum number of fields. Optimise the form for the user goal and make every question purposeful.

For longer forms, Buckholt documents techniques that can reduce friction:

### Progressive disclosure

Reveal additional content or inputs only when they become relevant based on a prior response. Reuse Nested inputs where that documented component solves the need.

### In-line editing

Allow users to change form content where it is displayed when a separate full-form journey would add unnecessary friction.

### Accordion forms

Accordion forms can group and collapse related sections in a single form to reduce visual clutter.

- Do not use accordion forms inside Modal layouts.
- Make it clear whether actions apply to an individual section or the whole form.

### Multistep forms

Split fields across multiple screens when a clear linear flow helps the task.

- group fields logically on each step;
- show progress through the flow;
- allow users to return to earlier steps without losing their place where the product supports it.

## Choosing a container

Buckholt distinguishes dedicated-page, Modal and side-panel contexts.

### Modal forms

- best suited to forms with **fewer than five inputs**;
- do not hide fields inside Accordions or Tabs;
- keep the task short and focused.

### Side-panel forms

- recommended for forms with **more than five inputs** where users need surrounding page context;
- do not place inputs inside Accordions or Tabs.

The source notes that further dedicated Modal-form guidance is planned, so do not invent undocumented Modal-form behaviour beyond the current Modal and Form rules.

## Agent rules

- Read this pattern before creating a complete form experience.
- Default to top-aligned labels and stacked fields.
- Use Input rows only when side-by-side placement clearly improves the task.
- Use one consistent required/optional labelling strategy per form type.
- Put form actions at the completion point, not at the top of dedicated-page forms.
- Follow documented Button hierarchy/order for the container type.
- Use progressive disclosure, Accordion or multistep structures only when the form complexity warrants them.
- Do not place Accordion forms inside Modals.
- For Modal forms, prefer fewer than five inputs; for side-panel forms, the documentation recommends more than five.
- Reuse existing Buckholt components rather than styling bespoke fields, section wrappers or validation.
- Use Page layout guidance to place the form within the wider page hierarchy.