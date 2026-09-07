# Buckholt runtime verification status

This file tracks runtime verification separately from source HTML verification.

Read `verification/runtime-verification-framework.md` before changing a status.

## Status meanings

- **RUNTIME PENDING** — source is available but controlled runtime verification has not yet been completed.
- **RUNTIME VERIFIED** — the recorded documented state set has been exercised against the required runtime/dependencies and material differences are resolved or explicitly recorded.
- **SOURCE PARTIAL** — runtime verification cannot be completed for undocumented/missing source variants.
- **NEEDS INVESTIGATION** — a runtime difference exists but the technical cause is not yet established.

## Runtime versions / contract

Current controlled target:

- Bootstrap CSS: 5.1.3
- Proxima Soft: Adobe Typekit `vtl2xbn.css`
- Font Awesome kit: `ca92816a31`
- Buckholt runtime: repository `css/buckholt.css`
- Compatibility layer: repository `css/buckholt-ai-fixes.css`
- Bootstrap bundle JS: 5.1.3 where required
- jQuery: 3.7.1 for `components/form/form.js`
- Buckholt scripts: `dropdown.js`, `form.js`, `tabs.js` where required

## Component matrix

| Component | Source gate | Runtime status | States/behaviour tested | Notes |
| --- | --- | --- | --- | --- |
| Accordion | HTML VERIFIED | RUNTIME PENDING | — | — |
| Alert | HTML VERIFIED | RUNTIME PENDING | — | — |
| Avatar | HTML VERIFIED | RUNTIME PENDING | — | — |
| Breadcrumb | HTML VERIFIED | RUNTIME PENDING | — | — |
| Button | HTML VERIFIED | RUNTIME PENDING | — | Existing verified compatibility fix for mouse-focus Bootstrap bleed-through; recheck in controlled suite. |
| Card | HTML VERIFIED | RUNTIME PENDING | — | — |
| Checkbox | HTML VERIFIED | RUNTIME PENDING | — | `form.js`/jQuery required for documented read-only enhancement. |
| Collapse | HTML VERIFIED | RUNTIME PENDING | — | Bootstrap collapse behaviour. |
| Dropdown | HTML VERIFIED | RUNTIME PENDING | — | Bootstrap + `dropdown.js`. |
| Form | HTML VERIFIED | RUNTIME PENDING | — | `form.js` requires jQuery. |
| Heading attachment | HTML VERIFIED | RUNTIME PENDING | — | — |
| Icon block | HTML VERIFIED | RUNTIME PENDING | — | — |
| Input group | HTML VERIFIED | RUNTIME PENDING | — | — |
| Input row | HTML VERIFIED | RUNTIME PENDING | — | — |
| Key-value pair | HTML VERIFIED | RUNTIME PENDING | — | — |
| Link | HTML VERIFIED | RUNTIME PENDING | — | Existing visited-state compatibility correction; recheck scoped behaviour. |
| List | HTML VERIFIED | RUNTIME PENDING | — | — |
| Lookup | HTML VERIFIED | RUNTIME PENDING | — | — |
| Menu | HTML VERIFIED | RUNTIME PENDING | — | Bootstrap dropdown behaviour where triggered. |
| Menu button | HTML VERIFIED | RUNTIME PENDING | — | Bootstrap dropdown behaviour. |
| Modal | HTML VERIFIED | RUNTIME PENDING | — | Existing Bootstrap bleed-through corrections should be rechecked. |
| Multi-field input | HTML VERIFIED | RUNTIME PENDING | — | — |
| Nested inputs | HTML VERIFIED | RUNTIME PENDING | — | Conditional show/hide logic is product-level unless evidence says otherwise. |
| Number input | HTML VERIFIED | RUNTIME PENDING | — | Canonical source uses `type="text"`; stepper enhancement from `form.js` + jQuery. |
| Page navigation | HTML VERIFIED | RUNTIME PENDING | — | Icons are direct children of `.nav-link`. |
| Progress bar | HTML VERIFIED | RUNTIME PENDING | — | Existing error-icon compatibility correction; recheck. |
| Radio | HTML VERIFIED | RUNTIME PENDING | — | `form.js`/jQuery required for documented read-only enhancement. |
| Response button | HTML VERIFIED | RUNTIME PENDING | — | — |
| Select | HTML VERIFIED | RUNTIME PENDING | — | — |
| Slider | HTML VERIFIED | RUNTIME PENDING | — | Existing notes indicate value synchronisation may be product-level/missing JS; verify. |
| Summary Meta | HTML VERIFIED | RUNTIME PENDING | — | Primary expressive family uses default; no `.expressive-primary`. |
| Switch | HTML VERIFIED | RUNTIME PENDING | — | — |
| Table | SOURCE PARTIAL | SOURCE PARTIAL | — | Only supplied Usage source; do not invent missing Code & specs variants. |
| Tabs | HTML VERIFIED | RUNTIME PENDING | — | Bootstrap pills + `tabs.js`. |
| Tag | HTML VERIFIED | RUNTIME PENDING | — | Selection/dismiss behaviour requires explicit verification. |
| Text area | HTML VERIFIED | RUNTIME PENDING | — | Character count enhancement from `form.js` + jQuery where documented. |
| Text block | HTML VERIFIED | RUNTIME PENDING | — | — |
| Text input | HTML VERIFIED | RUNTIME PENDING | — | `form.js` may provide clear-button enhancement. |
| Toast | HTML VERIFIED | RUNTIME PENDING | — | Bootstrap Toast behaviour; existing padding compatibility correction should be rechecked. |
| Tooltip | HTML VERIFIED | RUNTIME PENDING | — | Bootstrap Tooltip behaviour. |
| Versa-tile | HTML VERIFIED | RUNTIME PENDING | — | Existing action-column compatibility correction should be rechecked. |

## Recording a verified result

When a component passes, replace `RUNTIME PENDING` with `RUNTIME VERIFIED` and record the tested states concisely, for example:

`resting; hover; pointer active; keyboard focus-visible; disabled`

If a defect is found, do not mark verified until the discrepancy is classified and either corrected through the compatibility layer or explicitly accepted/documented.
