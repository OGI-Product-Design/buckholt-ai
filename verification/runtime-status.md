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

- Bootstrap CSS: **none — do not load a separate Bootstrap stylesheet.** `css/buckholt.css` is
  itself a complete Bootstrap build with Buckholt as the theme.
- Proxima Soft: Adobe Typekit `vtl2xbn.css`
- Font Awesome kit: `ca92816a31`
- Buckholt runtime: repository `css/buckholt.css`
- Compatibility layer: repository `css/buckholt-ai-fixes.css`
- Bootstrap bundle JS: 5.1.3 where required
- jQuery: 3.7.1 for `components/form/form.js`
- Buckholt scripts: `dropdown.js`, `form.js`, `tabs.js` where required

## Verification progress — 7 September 2026

A controlled pass was run against `test/runtime-verification/`, which composes every source-verified
`examples.html` byte-for-byte and re-asserts each compatibility fix against the live runtime.

**Completed for all 41 components with source-verified markup:**

- exact source-verified markup rendered, verified byte-identical to `components/*/examples.html`;
- dependency contract checked, including stylesheet order;
- every finding classified with the framework categories, with harness artefacts of composition
  (reused ids, documented `…` elisions, cross-snippet references) separated from component findings;
- all 6 documented corrections in `css/buckholt-ai-fixes.css` re-verified in effect by
  measurement, via 6 runtime assertions;
- resting render, and the Bootstrap and component-script behaviours the markup exercises
  (Modal, Tabs, Accordion, Collapse, Dropdown, Toast, Tooltip, the `form.js` enhancements);
- responsive behaviour at 320px, 375px, 768px and desktop, recorded in `responsive/`.

**Dependency-model correction, 8 September 2026.** Every result above was originally measured with a
separate `bootstrap@5.1.3` stylesheet loaded underneath `buckholt.css`. That stylesheet has been
removed: `buckholt.css` is a complete Bootstrap 5.3 build, and the live Buckholt documentation site
loads only its own compiled CSS. The full style guide was re-rendered against the corrected runtime —
zero page errors, zero horizontal overflow, 37 of 48 sections pixel-identical, and no component
collapsed. Seven of the fourteen corrections proved to be undoing the extra stylesheet and were
deleted; see `discrepancies/known-issues.md` for the full account. Runtime status for every
component is unchanged: still `RUNTIME PENDING`.

**Build-provenance correction, 9 September 2026 — read `discrepancies/build-provenance.md`.**
`css/buckholt.css` is **not** the same build as the live documentation site's
`compiled.css?v=2.3`. Direct diff of the two files: 3,538 selectors shared, 83 live-only, 192
local-only, 160 shared but differing. Two of the seven corrections proved inert in **both** builds
and were deleted (Dropdown caret, `.btn-close` box-sizing), leaving five. Two of the five are
regressions in our build only and render correctly on the live site.

The finding that bears on everything above: **the grid breakpoints differ.** Live uses
`896 / 1088 / 1312 / 1520 / 1720`; ours uses stock Bootstrap `576 / 768 / 992 / 1200 / 1400`.
Container widths are identical but reached at different viewports. **All responsive results
recorded here and in `responsive/` were measured against the local scale.**

**Mark confirmed on 9 September 2026 that the live build is the reference**, so the live scale is
the current one and those responsive figures do not describe reference behaviour at the widths they
name. The breakpoint configuration has not been changed — `css/buckholt.css` is not ours to edit —
but the responsive work should be re-run against the reference scale before it is relied on.

**Not yet completed, and why no component advances to `RUNTIME VERIFIED`:**

1. The documented state set has not been exercised exhaustively per component. Hover, pressed,
   `:focus-visible`, disabled, read-only and validation states were checked where a correction
   depended on them, not across every component.
2. The verification environment could not load the Typekit stylesheet or the Font Awesome kit, so
   type and icon rendering are unverified. Under this framework a failed dependency gate voids the
   rendering judgement beneath it, so the gate is recorded as unmet rather than worked around.

The matrix therefore stays `RUNTIME PENDING`. Re-run `test/runtime-verification/` in an environment
with network access to the CDN dependencies and complete the per-component state checklist before
advancing any row.

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
