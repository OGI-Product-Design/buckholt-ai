# Buckholt AI — final state

Handoff summary. For detail, follow the links; nothing here is duplicated from the files it points at.

## What this repository is

A **source-backed design-system companion for Buckholt**. It exists so that an AI coding or design
agent can *build with* Buckholt rather than imitate it — reaching for the documented component,
the documented class and the documented markup instead of reconstructing something that merely looks
similar.

That distinction is the whole point. An agent that imitates produces plausible CSS that drifts from
the system on contact with a real product. An agent that builds with Buckholt produces markup a
Buckholt engineer recognises.

Everything here serves that: canonical markup preserved as evidence, a runtime kept pristine, a thin
and fully justified compatibility layer, a visual catalogue, a verifier, and — clearly fenced off —
the application-level guidance for cases Buckholt does not cover.

**Build with Buckholt. Do not imitate Buckholt.**

## Evidence hierarchy

Later layers never override earlier ones. When they disagree, the earlier layer wins and the
disagreement is recorded rather than smoothed over.

| | Layer | Authority |
| --- | --- | --- |
| 1 | Buckholt documentation | Intended design-system behaviour. The source of truth. |
| 2 | `components/*/examples.html` and `rules.md` | Canonical markup and usage. `examples.html` is **source evidence**, preserved exactly — including deliberate `…` elisions. |
| 3 | `foundations/`, `patterns/` | Shared scales, tokens and composition guidance. |
| 4 | `css/buckholt.css` | Current runtime implementation, **never edited**. It is *not* the live documentation site's `compiled.css?v=2.3` — see `discrepancies/build-provenance.md` before treating its behaviour as Buckholt's intent. |
| 5 | `css/buckholt-ai-fixes.css` | Verified compatibility corrections only, where the runtime does not deliver documented intent. |
| 6 | `responsive/` | **Non-canonical.** Application-level guidance where Buckholt is silent. |

Rules that make the hierarchy hold:

- A runtime defect is never "fixed" by rewriting canonical markup.
- A rendering difference is classified before it is corrected — **local build regression**,
  **upstream markup/CSS mismatch**, or **unresolved** — never called a Buckholt defect by default.
- Silence in the documentation is not permission to invent a specification — it is recorded as
  silence.
- A generic convention never overrides a component's own Code & specs markup.
- No SCSS. The compiled CSS is the implementation path.

## Where an AI should start

1. **`CLAUDE.md`** — the operating rules. Read first, every time.
2. **`CANONICAL-MARKUP.md`** — what may and may not be changed in canonical examples.
3. **`patterns/`** — for a page or a screen, establish structure before choosing components
   (`page-layout` first; then `forms`, `input-rows`, `lookup`, `common-actions` as relevant).
4. **`components/<name>/rules.md`** — usage, states and constraints for each component involved.
5. **`foundations/`** — colour, typography, spacing, radius, shadows, iconography.
6. **`components/<name>/examples.html`** — the exact DOM to copy.
7. **`css/buckholt.css`** — to confirm a selector or state exists, never to invent DOM.

Then load the runtime in the verified order: Typekit → the Font Awesome kit → `buckholt.css` →
`buckholt-ai-fixes.css` — **no separate Bootstrap stylesheet**, because `buckholt.css` is itself a
complete Bootstrap 5.3 build and the live documentation site loads only its own compiled CSS; and for behaviour, the Bootstrap bundle → jQuery →
`dropdown.js`, `form.js`, `tabs.js`. **jQuery must precede `form.js`** or several documented
enhancements fail silently.

To see the result: **[`test/style-guide/`](test/style-guide/index.html)** is the visual catalogue.
**[`test/runtime-verification/`](test/runtime-verification/index.html)** is the QA view that supports
it.

## Current confidence

| Area | State |
| --- | --- |
| **Source verified** | 41 components have canonical markup compared against the supplied Code & specs HTML. `verification/component-source-status.md` |
| **Runtime tested** | All 41 rendered from byte-exact canonical markup against the full dependency contract; every finding classified; all 5 documented runtime corrections re-asserted live. `test/runtime-verification/` |
| **Runtime *verified*** | **None.** No component has advanced from `RUNTIME PENDING` — see the caveat below. `verification/runtime-status.md` |
| **Responsive** | `test/style-guide/` audited at 320 / 375 / 768 / desktop with zero page-level horizontal overflow (re-confirmed 9 September 2026). `test/runtime-verification/` **does** overflow at 375 and 320 — it renders canonical markup unwrapped, without the containers a real page supplies; recorded as an open finding in `discrepancies/known-issues.md`. 2 components documented responsive, 8 handled by the runtime, 4 needing application guidance, 27 clean. `responsive/component-guidance.md` |
| **Application level** | Selection and dismiss behaviour for Tag and Card, Slider synchronisation, the Table `data-cdt-*` controller and Dropdown single-select labelling are product responsibilities, documented and deliberately not implemented. |
| **Source partial** | Table only — supplied from a Usage page, with no Code & specs source. |
| **Build provenance** | **`css/buckholt.css` is not the live build.** Direct diff against `compiled.css?v=2.3`: 3,538 selectors shared, 83 live-only, 192 local-only, 160 differing. The **grid breakpoints differ** — live `896/1088/1312/1520/1720`, ours `576/768/992/1200/1400` — so every responsive rule fires at a different width from the live design system. Not normalised; open for Buckholt. `discrepancies/build-provenance.md` |
| **Unresolved** | 10 entries marked `OPEN`, plus the Alert/Toast entry whose horizontal half is corrected and whose 4px vertical half is not; and 5 `PRODUCT RESPONSIBILITY` items, recorded rather than inferred — including a hard dependency on a Font Awesome kit whose *regular* face carries the documented glyphs. `discrepancies/known-issues.md` |

### The runtime-verification caveat

Two things stop any component being marked `RUNTIME VERIFIED`, and neither should be worked around:

1. The documented state set has not been exercised exhaustively per component. Hover, pressed,
   `:focus-visible`, disabled, read-only and validation were checked where a correction depended on
   them, not across all 41.
2. The verification environment could not reach the Typekit stylesheet or the Font Awesome kit, so
   type and icon rendering are unverified. Under this repository's own framework a failed dependency
   gate voids the rendering judgement beneath it — so the gate is recorded as unmet rather than
   quietly ignored.

Re-run the harness with network access and complete the per-component state checklist before
advancing any row.

## Remaining known gaps

Short list; the detail is in the linked files.

- **7 active runtime corrections** are in force, each with an upstream action recorded —
  `discrepancies/known-issues.md` and `css/buckholt-ai-fixes.css`.
- **Table has no Code & specs source.** It stays `SOURCE PARTIAL`; the missing variants must not be
  invented.
- **Five source/runtime discrepancies** are open and unresolved: Link `:visited`, the Radius `full`
  name/value disagreement, the empty `--card-text` token, group `label[for]` values that point at
  nothing, and `form.js` binding the Text area counter to `keyup` so paste and autofill do not update
  it.
- **Five behaviours are the product's**, not the design system's — listed under *Required behaviour
  not supplied* in the register.
- **Four components need application responsive guidance** where Buckholt is silent —
  `responsive/component-guidance.md`.
- **Font Awesome must be a Pro kit.** Buckholt's documented markup uses `fa-regular` throughout, and
  the close control draws `\f00d` from `var(--fa-font-regular)`. In Font Awesome 6 the regular face
  is a Pro style, so a Free kit renders most Buckholt icons — including every close control — as
  `.notdef` boxes. The harness now detects and reports this.

None of these is inferred or resolved by guesswork. Where evidence was missing, the gap is the
finding.

## Repository map

```
CLAUDE.md                    operating rules for agents — read first
CANONICAL-MARKUP.md          what may and may not change in canonical examples

components/<name>/           rules.md (usage) + examples.html (canonical markup, source evidence)
foundations/                 colour, typography, spacing, radius, shadows, iconography
patterns/                    page-layout, forms, input-rows, lookup, common-actions
css/buckholt.css             upstream runtime — never edited
css/buckholt-ai-fixes.css    7 verified corrections to buckholt.css, each justified in place

discrepancies/               known-issues.md — current-state issue register
verification/                source status, runtime status, and the classification framework
responsive/                  NON-CANONICAL application-level responsive guidance

test/style-guide/            the visual catalogue — what Buckholt looks like
test/runtime-verification/   the QA view — what works, what needs attention, and why
```
