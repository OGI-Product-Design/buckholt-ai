# Accordion

## Purpose

Accordion is a vertical list of headers that expand and collapse to reveal related content. Use it to reduce visual density while keeping several related sections available in the same view.

## Usage

- Default Accordions should load collapsed so users can scan the available sections before choosing what to open.
- Medium is the default size and is appropriate for grouped Accordions such as FAQs or several related collapsed sections.
- Large Accordions are for single, standalone collapsible cards. Avoid using large Accordions as a group because their scale reduces scanability.
- Multiple items may remain open by default. When the experience requires only one open item at a time, use the documented single-expansion pattern with `data-bs-parent`.
- Do not use Accordion simply to hide essential information that users need to complete the current task.

## Canonical structure

```html
<div class="accordion" id="exampleAccordion">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button"
        data-bs-toggle="collapse"
        data-bs-target="#exampleAccordionItem"
        aria-expanded="false"
        aria-controls="exampleAccordionItem">
        Accordion heading
      </button>
    </h2>
    <div id="exampleAccordionItem" class="accordion-collapse collapse">
      <div class="accordion-body">
        <div class="text-block">
          <p>Accordion content.</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

Use unique IDs and keep `data-bs-target`, `aria-controls` and the corresponding collapse `id` aligned.

## Expanded by default

To render an item expanded initially:

- add `.show` to `.accordion-collapse`;
- remove `.collapsed` from `.accordion-button`;
- set `aria-expanded="true"`.

```html
<button class="accordion-button" type="button"
  data-bs-toggle="collapse"
  data-bs-target="#openItem"
  aria-expanded="true"
  aria-controls="openItem">
  Accordion heading
</button>
<div id="openItem" class="accordion-collapse collapse show">
  ...
</div>
```

## Single-expansion pattern

To allow only one item in a group to be open at once, add `data-bs-parent` to each `.accordion-collapse`, referencing the parent Accordion ID.

```html
<div class="accordion" id="accordionSingleExpand">
  ...
  <div id="accordionItem1" class="accordion-collapse collapse"
    data-bs-parent="#accordionSingleExpand">
    ...
  </div>
</div>
```

Do not add `data-bs-parent` when independent simultaneous expansion is intended.

## Size

Buckholt documents two sizes:

- medium/default: `.accordion`
- large: `.accordion.accordion-lg`

Use `.accordion-lg` for a standalone collapsible card, not for a repeated group.

## Content

- Keep header labels concise and descriptive of the content revealed.
- Use real Buckholt components inside `.accordion-body`, such as Text block, rather than recreating their styling.
- Preserve semantic heading structure. The documentation demonstrates `.accordion-header` on heading elements; choose the actual heading level according to the surrounding page hierarchy.

## Behaviour and accessibility

Accordion uses Bootstrap collapse behaviour.

- The header control must be a keyboard-operable `<button>`.
- Keep `aria-expanded` synchronized with the open/closed state.
- Keep `aria-controls` pointing to the controlled panel.
- The collapsed/expanded visual state must not be communicated only by colour; Buckholt also changes the disclosure icon state.
- Respect reduced-motion behaviour supplied by the runtime.
- Do not replace Bootstrap collapse behaviour with bespoke show/hide JavaScript unless a product implementation has a documented technical requirement.

## Runtime notes

The compiled Buckholt CSS defines Accordion spacing, button padding, typography, focus ring, active background, disclosure icon and transitions. `.accordion-lg` changes the documented scale for the large variant.

Use the runtime classes rather than recreating Accordion styling locally.

## Agent rules

1. Use `.accordion > .accordion-item > .accordion-header > .accordion-button` with a corresponding `.accordion-collapse > .accordion-body`.
2. Default to collapsed unless the product requirement explicitly calls for an initially expanded section.
3. Use `.accordion-lg` only for the documented large standalone treatment.
4. Use `data-bs-parent` only when one-open-at-a-time behaviour is intended.
5. Keep IDs, `data-bs-target`, `aria-controls` and `aria-expanded` correct.
6. Reuse Buckholt components inside the body.
7. Do not recreate Buckholt Accordion spacing, iconography, states or animation with custom CSS.
