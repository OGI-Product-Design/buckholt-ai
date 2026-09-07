# Component source verification status

This file tracks source verification against rendered Buckholt documentation HTML supplied by Product Design.

## Status meanings

- **HTML VERIFIED** — `components/<component>/examples.html` has been compared with the component's supplied **Code & specs HTML page**. Canonical block examples preserve the documented DOM, attributes, class placement, order and deliberate `...` placeholders rather than filling gaps by inference.
- **RULES AUDITED** — `rules.md` has been checked against the supplied Usage, Style and Code & specs HTML pages and corrected where it could imply canonical markup not present in source.
- **SOURCE PARTIAL** — the supplied bundle does not include a complete Code & specs source, so canonical HTML cannot yet be declared verified.
- **RUNTIME PENDING** — source verification does not by itself prove every documented selector/state renders perfectly against the current `css/buckholt.css`. Runtime parity is a separate check.

## Bundle 01 — supplied 7 September 2026

| Component | Canonical HTML | Rules | Runtime parity |
| --- | --- | --- | --- |
| Accordion | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Alert | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Avatar | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Breadcrumb | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Button | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Card | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Checkbox | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Collapse | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Dropdown | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Form | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Heading attachment | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Icon block | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Input group | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Input row | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Key-value pair | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Link | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| List | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Lookup | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Menu | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |

## Bundle 02 — supplied 7 September 2026

| Component | Canonical HTML | Rules | Runtime parity |
| --- | --- | --- | --- |
| Menu button | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Modal | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Multi-field input | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Nested inputs | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Number input | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Page navigation | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Progress bar | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Radio | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Response button | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Select | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Slider | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Summary Meta | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Switch | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Tabs | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Tag | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Text area | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Text block | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Text input | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Toast | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Tooltip | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Versa-tile | HTML VERIFIED | RULES AUDITED | RUNTIME PENDING |
| Table | SOURCE PARTIAL — Usage only | PROVISIONAL | RUNTIME PENDING |

Bundle 02 also contained rendered HTML pages for Colour, Colour contrast, Foundation colours, Global palette and Type sets. Those are foundation evidence and are not counted as component verification in this table.

## Rules for future bundles

1. Rendered Buckholt component HTML is the canonical evidence source supplied for this repository.
2. Extract canonical implementation examples from the component's Code & specs page; do not reconstruct them from screenshots, PDFs or prose.
3. Preserve source element types, wrappers, class placement, attributes, icon placement and deliberate placeholders exactly.
4. Do not silently fix source typos inside canonical examples. Record a documentation issue separately if necessary.
5. Usage and Style pages may add guidance but must not rewrite Code & specs DOM.
6. Component-specific Code & specs markup takes precedence over generic component conventions when the structures differ.
7. SCSS is excluded from the implementation path even if the documentation page happens to display an SCSS example.
8. Runtime parity against `css/buckholt.css`, Bootstrap, fonts and supplied JavaScript is a separate verification step after source HTML has been established.
