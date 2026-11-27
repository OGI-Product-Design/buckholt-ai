# Extensions register: Agentic UX site

Everything on this site that Buckholt does not have. Each entry is styled in
`css/extensions.css` with Buckholt tokens only, uses the `x-` class prefix and
carries `data-buckholt="false"` in the markup. Buckholt's own CSS is never
changed: it is copied into the build as it is.

The brief asks for this register at `/context/extensions-register.md` using a
register template. That folder and template do not exist yet, and this site is
kept inside `agentic/`, so the register lives here for now. Move it when the
template exists.

Last updated: 27 November 2026.

| ID | Extension | Why Buckholt does not cover it | Buckholt parts used inside it | Tokens | Status |
|---|---|---|---|---|---|
| X-01 | `x-site-header`, `x-site-sidebar`, `x-site-nav`, `x-site-footer`, `x-header-search`: site shell | Buckholt documents the layout regions (base layout 03 is used) but no site header, global navigation or footer. Page navigation is documented for sibling pages, not global navigation. | Layout `layout-03`, Tag (status info, small), Button (secondary, small), Link (standalone), type sets `body-01`, `action-01` | `--ui-background-*`, `--ui-border-02`, `--ui-overlay-02`, `--action-04`, `--action-text-01`, `--text-*`, `--padding-*`, `--spacer-*`, `--border-radius-md`, `--border-width`, `--focus-01`, `--font-weight-md` | Draft |
| X-02 | `x-skip-link`: position of the skip link when focused | Buckholt provides `.visually-hidden-focusable` but not a positioned skip link. | `.visually-hidden-focusable` | `--ui-background-01`, `--action-text-01`, `--focus-01`, `--spacer-03`, `--padding-*` | Draft |
| X-03 | `x-agent-tag`: an agent tag that links to its page | Buckholt Tags are not links. The Tag inside keeps its documented markup. | Tag (`expressive-light` with family modifiers; base Tag for Foundation) | `--tag-radius`, `--focus-01`, `--border-width`, `--spacer-01` | Draft |
| X-04 | `x-tag-set`: spacing for grouped tags | `.tag-set` is documented (Tag, Code & specs example 9) but the runtime only lays it out inside Dropdown. | Tag set | `--spacer-03` | Draft |
| X-05 | `x-code-block`: code with a copy button | Buckholt has no code block. | Button (ghost, small, with `btn-icon`), Common actions copy icon `fa-regular fa-copy` | `--ui-background-01`, `--ui-background-03`, `--ui-border-02`, `--text-*`, `--typescale-02`, `--font-weight-md`, `--bs-font-monospace` (see F-02), `--padding-*`, `--border-radius-md` | Draft |
| X-06 | `x-diagram`: seven inline SVG diagrams, with a list version below 896px | Buckholt has no diagram component. | Tag (stage colours, status warning for gates) in the list version | Expressive families, `--feedback-*-warning`, `--feedback-*-error`, `--ui-*`, `--text-*`, `--focus-01`, `--body-font-family`, `--bs-font-monospace`, `--font-weight-*` | Draft: all seven built |
| X-07 | Stage colour mapping | Buckholt has four expressive families; the workflow has six stages. Foundation uses the base Tag, Handoff shares Prototype's family. The stage is always named in text. | Tag | Expressive families | Draft |
| X-08 | `x-lead`, `x-row-gap`, `x-stage-group`, `x-card-meta`: page helpers | Measure for lead text, vertical gap between wrapped Bootstrap columns, a heading with its tag set, and quiet metadata on cards. Also sets `strong` in main content to Semibold, because Buckholt body text is Light and the browser's "bolder" barely shows. | Text block, Card, Bootstrap grid | `--spacer-*`, `--page-panel-gap`, `--text-secondary`, `--text-tertiary`, `--font-weight-sb` | Draft |
| X-09 | `x-tag-contrast`: light expressive Tag labels use the family's rich colour | Fixes F-01 on this site. Sets the Tag's own `--tag-label` and `--tag-icon` variables, scoped to `.x-site`; no Buckholt rule is edited. Applied to all four families so they read alike. | Tag (`expressive-light`) | `--expressive-rich` (and the family modifiers' rich colours) | Draft: raise F-01 with the Buckholt owners |
| X-10 | `x-on-this-page`: contents for long pages, xl widths only, with the current section marked | Buckholt has no in-page contents component. | Type set `label-01` | `--ui-border-02`, `--text-*`, `--action-text-01`, `--focus-01`, `--spacer-*`, `--padding-05`, `--typescale-02`, `--font-weight-md`, `--border-width` | Draft |
| X-11 | `x-pager`: previous and next agent or guide | Buckholt has no pager. | Link (standalone, with icon) | `--ui-border-02`, `--text-tertiary`, `--spacer-05`, `--padding-07`, `--typescale-01`, `--border-width` | Draft |
| X-12 | `x-constraint`: the "Never" list on agent pages | Buckholt has no constraint or rule-list treatment. Alert is for feedback, not standing rules. | List with icons (`list-icon text-error`), Text block | `--feedback-background-error`, `--feedback-border-error`, `--feedback-body-error`, `--padding-07`, `--spacer-04`, `--border-radius-md`, `--border-width` | Draft |
| X-13 | `x-agent-title`: the large agent tag beside the page title | Tags have no large size; the tag sits beside the H1 and is hidden from screen readers, which read the H1. | Tag, type set `display-02` | `--spacer-04` | Draft |
| X-14 | `x-search-form`, `x-search-results`: site search | Buckholt has no search results pattern. The form uses Input group with an action button. | Text input, Input group, Button (`btn-response`), List | `--text-secondary`, `--spacer-*` | Draft |
| X-15 | Alert used for notes in content, with `role="note"` and a `p.x-alert-title` in place of the documented `h6` | A static note on a page should not be announced as an alert, and an `h6` breaks heading order. The rest of the Alert info markup is as documented. | Alert (info) | `--font-weight-md` | Draft: application-level change to documented markup |
| X-16 | Tables in content: `tabindex="0"`, `role="region"` and a label on `.table-content`, and a real column count on the gap row's `colspan` | Narrow screens scroll tables sideways; the scroll area must be reachable by keyboard. The documented `colspan="100%"` is not a valid number. | Table | None | Draft: application-level change to documented markup |

## Findings to raise with the Buckholt owners

| ID | Finding | Evidence | Effect here |
|---|---|---|---|
| F-01 | The light expressive Tag fails WCAG 2.2 AA text contrast for two families at its 14px size: tertiary 4.19:1 (`--expressive-tertiary-deep` on its pale overlay), quaternary 3.96:1 (`--expressive-quaternary-deep` on its pale overlay). AA needs 4.5:1. Primary and secondary pass. | axe-core 4.10 colour-contrast rule on this site, 27 November 2026, against `css/buckholt.css` as held in this repository. Not yet checked against the live build. | Fixed on this site by X-09. |
| F-02 | `--bs-font-monospace` is used by `pre`, `code`, `kbd` and `samp` in `css/buckholt.css` but never defined, so code falls back to the body font. | `grep` of `css/buckholt.css`, 27 November 2026. | `x-code-block` and diagram paths use `var(--bs-font-monospace, monospace)`. |
| F-03 | The Table gap row uses `colspan="100%"`, which is not a valid number. | `components/table/examples.html`. | This site writes the real column count (X-16). |
