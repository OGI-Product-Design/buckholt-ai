# Collapse

## Purpose

Collapse lets users show or hide additional content on the same page without navigating away. Use it to keep an interface scannable when secondary detail does not need to remain visible all the time.

Collapse is a single disclosure. Do not use it to recreate an Accordion group; use the Accordion component when several related sections form a coordinated expandable set.

## Canonical structure

Buckholt uses Bootstrap collapse behaviour with Buckholt's own trigger/card structure:

```html
<div class="collapse-item">
  <a class="collapse-trigger"
     data-bs-toggle="collapse"
     href="#collapse-example"
     role="button"
     aria-expanded="false"
     aria-controls="collapse-example">
    Collapse trigger
  </a>

  <div class="collapse-card collapse" id="collapse-example">
    <div class="collapse-content">
      <div class="text-block">
        <h6 class="collapse-title">Collapse title</h6>
        <p>Additional content.</p>
      </div>
    </div>

    <button type="button"
            class="btn-close"
            data-bs-toggle="collapse"
            href="#collapse-example"
            aria-label="Close"></button>
  </div>
</div>
```

The trigger's `href`/target must match the `id` of `.collapse-card`. Keep `aria-controls` aligned with the same target and let Bootstrap update the disclosure state.

## Trigger

The documented trigger is usually an anchor with:

- `.collapse-trigger`;
- `data-bs-toggle="collapse"`;
- `role="button"`;
- `href="#target-id"`;
- `aria-expanded`;
- `aria-controls="target-id"`.

Use a meaningful trigger label that tells the user what content will be revealed. Do not use vague labels such as “More” when a clearer label is available.

## Content card

The revealed region uses `.collapse-card.collapse`, containing `.collapse-content`. Buckholt's example composes a Text block inside the content and uses `.collapse-title` for the title.

Use documented Buckholt components inside the content region rather than recreating their styles locally.

## Close action

The documented Collapse contains a `.btn-close` that toggles the same collapse target. Preserve an accessible name such as `aria-label="Close"`.

## Initial state

The normal documented example is collapsed initially, with `aria-expanded="false"` and without `.show` on the collapse region.

If product requirements genuinely require the content initially expanded, use Bootstrap's real collapse state consistently: `.show` on the collapse region and `aria-expanded="true"` on the trigger. Do not create a separate custom visibility mechanism.

## Behaviour and dependencies

Collapse relies on Bootstrap 5.1.3 collapse JavaScript. Load the Bootstrap bundle used by Buckholt. Do not write custom open/close JavaScript when Bootstrap collapse already supplies the interaction.

The trigger and the internal close button control the same region. IDs must be unique on the page.

## Content guidance

Use Collapse for supplementary content that users may need on demand while remaining in the current context. Keep the trigger and revealed content closely related.

Do not hide information that is essential for completing the primary task or understanding a critical system state.

## Composition

Read `components/text-block/` for written content inside `.collapse-content`, and `components/button/` when using Buckholt actions inside the revealed region.

## Agent rules

- Use `.collapse-item`, `.collapse-trigger`, `.collapse-card.collapse` and `.collapse-content` as documented.
- Match trigger `href`, `aria-controls` and content `id` exactly.
- Use Bootstrap collapse behaviour rather than custom visibility scripting.
- Preserve `aria-expanded` and an accessible close button.
- Use Collapse for one disclosure; use Accordion for a coordinated set of expandable sections.
- Reuse Buckholt components inside the content region.
- Do not recreate Collapse spacing, card styling, transitions or close treatment with local CSS.
