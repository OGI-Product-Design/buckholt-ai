# Build provenance — the reference build, and how the local build differs

**Status: SETTLED. Mark confirmed the reference build on 9 September 2026.**
**Established: by direct diff of the two files, same date.**

## The evidence model

```
Buckholt Code & specs documentation  +  live compiled.css?v=2.3
    = the current reference for this work

newer/local css/buckholt.css
    = newer/different implementation evidence
    = must NOT override or reinterpret older canonical documentation
```

Mark's words: **"live is your version."** The live documentation build is the reference. The
breakpoint scale that ships with it — `896 / 1088 / 1312 / 1520 / 1720` — is the current one. The
alternate scale in `css/buckholt.css` came from the newer build and **is not canonical documentation
behaviour**.

## What that means in practice

- `css/buckholt.css` remains what this repository loads at runtime. It is not deleted: the
  architecture does not require that, and it is useful evidence of where Buckholt is heading.
- Where the two builds disagree, **the live build and the documentation decide.** Do not use the
  newer local CSS to reinterpret older canonical documentation.
- Corrections 1 and 2 in `css/buckholt-ai-fixes.css` exist to bring the local build back into line
  with the reference build. That is their whole justification.
- Anything below marked as differing is a record of local-build divergence, **not an open
  question**. The open question — which build is current — is answered.

## Resolved and closed

| Question | Answer |
|---|---|
| Which breakpoint scale is current? | **Live: `896/1088/1312/1520/1720`.** The local stock-Bootstrap scale is not canonical. |
| Which CSS build is current? | **Live `compiled.css?v=2.3`.** |
| `data-bh-theme` vs `data-bs-theme`, dark mode | **Ignore.** Mark's instruction. Retained below for historical provenance only; not an open item. |
| `.button-set-no-offset` | **Undocumented experimental class, not a Table feature.** Never canonical guidance. |
| WordPress wrappers (`wp-block-acf-tabs`, `element_block`, `align`) | **WordPress-added, not Buckholt API.** Ignore. |

Nothing here has been "fixed". No breakpoint, token or rule in `css/buckholt.css` has been changed —
the file remains unmodified, as does the live copy used for the diff.

---

## 1. Evidence

The live stylesheet (`compiled.css?v=2.3`) was supplied directly and compared against
`css/buckholt.css`. Both files were parsed into rule maps; declarations were compared after
normalising whitespace and hex case. Rendered figures were measured in Chromium with each
stylesheet swapped in as the only framework stylesheet.

| | live `compiled.css?v=2.3` | `css/buckholt.css` |
|---|---|---|
| SHA-256 | `8a3d05073e544428223ac025e4372a52abb77d5e22a7d85dfc37d9537f472b01` | `de2caa00d28bf868d2fa1d056157816b388644f8261215e20783886c2a8ea2a3` |
| Bytes | 370,228 | 401,697 |
| Lines | 16,525 | 17,327 |
| Rules | 3,695 | 3,866 |

| Comparison | Count |
|---|---|
| Selectors in both | 3,538 |
| Only in live | 83 |
| Only in ours | 192 |
| Shared but differing | 160 (60 token churn, 100 substantive, 35 layout-affecting) |

95% of selectors are shared. This is one design system built twice — not two different
products, and not the same file.

---

## 2. The breakpoint difference — settled: live is the reference

```
live:  896 / 1088 / 1312 / 1520 / 1720
local: 576 / 768 / 992 / 1200 / 1400
```

The local scale is stock Bootstrap. The live scale is a Buckholt customisation.

Container widths are **identical** in both builds — 540 / 720 / 960 / 1140 / 1320 — but
they are reached at completely different viewport widths:

| Container max-width | live breakpoint | local breakpoint |
|---|---|---|
| 540px | 896px | 576px |
| 720px | 1088px | 768px |
| 960px | 1312px | 992px |
| 1140px | 1520px | 1200px |
| 1320px | 1720px | 1400px |

**Consequence:** every responsive rule in `css/buckholt.css` fires at a different width
from the live design system. All responsive verification recorded in `verification/` was
measured at 1440 / 768 / 375 / 320 against the **local** scale. If the live scale is
authoritative, that work needs re-running.

**Do not change the breakpoint configuration.** `css/buckholt.css` is not ours to edit, and the
question of which scale is current is answered: the live scale is the reference. Any responsive
guidance in this repository that was measured on the local scale is flagged where it appears.

---

## 3. Which build is newer

Our copy appears to be the **later source**, built with a **different Bootstrap
configuration**. Those are two separate axes and they point in opposite directions.

### Later source — features live does not have

- `.button-set-no-offset` — an opt-out for the button-set flow offset
- `.emphasis-tile`, `.masonry-*` (39 rules), `.border-radius-*` (27 rules)
- `.link-set-{sm,md,lg,xl,xxl}-stacked`, `.menu-panel-sm`, `.nav-sm`, `.hr-sm`, `.col-collapsed`
- `.tab-scroll`, `.tab-items.has-overflow .tab-scroll`, `.tab-items:has(.nav-group)`
- `#main { container-type: inline-size }` — container queries
- A full dark colour mode (117 `[data-bs-theme=dark]` occurrences; live has none)

### Refinements of live rules, in the same direction

| live | ours |
|---|---|
| `.account-meta` | `.user-meta` (renamed) |
| `.card-clickable .card-body::after` | `.card-clickable:not(.hide-indicator) …` (opt-out added) |
| `.table-gap` | `.table .table-gap` (scoped), `:hover td` added |
| `a.link-standalone` | `.link-standalone` + `button.link-standalone` (broadened) |
| `a[data-bs-toggle=tooltip]` | `…:not(.btn):not(.carousel-control-*)` (scoped) |
| `.col > .card .text-block` | `.row > * .card .text-block` (broadened) |

### Different build configuration — ours is *more* stock-Bootstrap than live

| | live | ours |
|---|---|---|
| Colour-mode attribute | `[data-bh-theme=buckholt]` | `[data-bs-theme=buckholt]` |
| Bootstrap default palette block | present (`:root,[data-bs-theme=light]`) | absent |
| Dark colour mode | disabled | emitted |
| Grid breakpoints | 896 / 1088 / 1312 / 1520 / 1720 | 576 / 768 / 992 / 1200 / 1400 |

---

## 4. Live-only content that is correctly absent from ours

83 selectors are live-only. They are not gaps.

- **Documentation-site chrome** — `.swatch*` (16), `.code-example` / `.code_block` /
  `.code_content` / Prism highlighting (11), `.buckholt-search`, `.search-pagination`,
  `.account-meta`, `.anchor`, `.colour_dot`, `.contrast_score`, `.ref_colour`.
- **Static state-demonstration classes** — how the docs show a state without interaction:
  `.link-hover`, `.link-focus`, `.link-active`, `.link-visited`, `.btn.state_hover`,
  `.state_focus .form-control`.

---

## 5. Rendering differences between the builds

Page-layout spacing is **identical**: `.page-frame` 64px vertical / 48px horizontal padding
and 64px gap, `.page-pane` 64px gap, `.page-panel` 32px gap — measured at 1440px and 1000px
in both.

The Frame's horizontal padding is **48px**, not 64px, in **both** builds — a documentation
imprecision rather than a build difference. `CLAUDE.md`, `README.md` and `mobius/README.md` were
corrected on 9 September 2026; `patterns/page-layout/rules.md` still states "4rem / 64px" and was
deliberately left alone, because it transcribes documented Buckholt intent. See
[`known-issues.md` → Page layout — Frame padding](known-issues.md).

One genuine build difference does sit here: below 768px `css/buckholt.css` sets
`--page-body-spacing-x: 2rem`, narrowing the Frame's horizontal padding to **16px**. The live
build has no such override and stays at 48px at every width. (Note that 768px is a breakpoint on
the local scale; the live scale would place the equivalent boundary at 896px.)

Differences that do change rendering:

| Selector | live | ours | Effect |
|---|---|---|---|
| `.versatile-body` | — | `width: 100%` | Icon-only action set wraps. Patched — fixes file rule 2. |
| `.nav-underline .nav-link::after` | `height: 0.125rem` | `height: 0.25rem` | Active tab underline twice as thick |
| `.table > :not(caption) > * > *` | `padding: 0 1rem` | `padding: 0.125rem 1rem` | Table rows 4px taller |
| `.table-sort` | `padding: 0 1rem` | `padding: 0.125rem 1rem` | as above |
| `.tab-content > .active` | `display: block` | `display: flex` + `flex-direction: column; gap` | Tab panes space children by flex gap |
| `.list-icon` / `.list-item` | flex row, `gap: 0.5rem` | absolute positioning | Icon list restructured |
| `.badge` | fixed `position`/`right`/`top` | tokenised `--badge-position-*` | Configurable; same default |
| `.page-panel` | `height: 100%` | — | Panel stretch behaviour |
| `.btn-combo` | `gap: 1px` | — | Combo button seam |
| `.avatar` | — | `flex-shrink: 0` | Improvement in ours |
| `.card-lg .card-body` | — | `padding: 3rem 3rem` | Large card padding |
| `caption` | `padding: 0` | `padding: 0.125rem 0` | Table caption |

---

## 6. Compile defects in our build only

### 6.1 `var()` inside `data:` URIs — nine occurrences

A `data:` URI is an isolated document, so `var()` cannot resolve inside one and the
declaration falls back. **The live file contains zero `var%28` occurrences; ours contains
nine.** Every one has a resolvable literal in live:

| our line | selector | ours | live |
|---|---|---|---|
| 4141 | `.form-select:disabled`, `.dropdown-toggle:disabled`, … | `var%28--disabled-overlay-03%29` | `rgba%2826, 26, 26, 0.3%29` |
| 4153 | `[data-bs-theme=dark] .form-select`, … | `var%28--text-primary%29` | *(dark mode: not in live)* |
| 4324 | `.form-switch .form-check-input:disabled` | `var%28--disabled-overlay-03%29` | `rgba%2826, 26, 26, 0.3%29` |
| 4325 | `.form-switch .form-check-input:disabled` | `var%28--disabled-overlay-03%29` | `rgba%2826, 26, 26, 0.3%29` |
| 4375 | `.form-switch-sm .form-check-input:disabled` | `var%28--disabled-overlay-03%29` | `rgba%2826, 26, 26, 0.3%29` |
| 4376 | `.form-switch-sm .form-check-input:disabled` | `var%28--disabled-overlay-03%29` | `rgba%2826, 26, 26, 0.3%29` |
| 8345 | `.stepper-item.error` | `var%28--error-01%29` | `%23D7050C` |
| 8394 | `.sub-stepper .stepper-item.error` | `var%28--error-01%29` | `%23D7050C` |
| 8864 | `.progress-header:has(~ .is-invalid)` | `var%28--error-01%29` | `%23D7050C` |

Only line 8864 is patched, in `css/buckholt-ai-fixes.css` rule 1, because it is the only
one any page in this repository exercises. If another is needed, take the literal from
this table rather than inventing one.

Root cause: the build that produced our file switched from compile-time literals to runtime
custom properties, and the SVG data URIs were caught in that switch.

### 6.2 Tokens that resolve in live but not in ours — three occurrences

Two SCSS `null` leaks and one empty custom property. Live has none of them.

**`css/buckholt.css:7919` — `.avatar { --avatar-border-width: null }`**

`border: var(--avatar-border-width) solid var(--avatar-border)` is invalid at
computed-value time, so `border` falls back to its initial value.

```
ours   .avatar   borderTopWidth=0px    borderTopStyle=none
live   .avatar   borderTopWidth=2px    borderTopStyle=solid
```

Practical impact is small: `box-sizing` is `border-box` so the outer box is 48px either
way, and the default `--avatar-border` is `transparent`. It becomes visible only if an
application sets `--avatar-border` to a real colour without also setting a width — live
then shows a 2px ring and ours shows nothing. Not patched.

**`css/buckholt.css:6820` — `.card { --card-text: ; }`**

Defined with no value, so `color: var(--card-text)` at `:6867` is invalid at computed-value time
and dropped; anything relying on the token silently inherits instead. Live declares
`--card-text: #1a1a1a` at `:5930` and uses it identically at `:5976`. Not patched — the live value
is known, so it can be fixed at source. Recorded in
[`known-issues.md`](known-issues.md#card----card-text-is-defined-as-an-empty-value).

**`css/buckholt.css:7575` — `[class$=-set] { --set-row-gap: null }`**

Measured `row-gap: 8px` in both builds. **Behaviourally inert** — a cosmetic defect in the
compiled output only. Not patched.

---

## 7. What this changes about the fixes layer

`css/buckholt-ai-fixes.css` holds **six** corrections, each verified against the component's own
documented markup and the current reference CSS:

| Correction | Classification |
|---|---|
| 1 Progress error icon | Local build regression — the reference build renders it correctly |
| 2 Versa-tile wrapping | Local build regression — the reference build renders it correctly |
| 3 Alert close control | Runtime gap vs documented intent — horizontal corrected, 4px vertical open |
| 4 Toast close control | Runtime gap vs documented intent — audited separately from Alert |
| 5 Table button-set offset | Unresolved — no documented Table API cancels the offset |
| 6 Card image fitting | Documentation / newer-CSS version mismatch |

Two rules were deleted on 9 September 2026 after both builds were measured and proved them inert in
both: `.dropdown-toggle::after { display: none }` and `.btn-close { box-sizing: border-box }`.

## 8. Still open for Buckholt

Everything else has been answered — see **Resolved and closed** at the top.

1. **The three local-build token defects**, with their reference values already known:
   nine `var()` calls inside `data:` URIs, `--avatar-border-width: null`, `--card-text` empty.
   Fixable at source in the newer build.
2. **Alert and Toast close control** — position the documented in-content control vertically as
   well as horizontally, and reconcile each page's "Close button" code block with its own prose.
   Alert and Toast are separate components and may be answered separately.
3. **Table button-set offset** — cancel the flow offset inside table cells, mirroring the existing
   Versa-tile reset, or document a supported way to do it. `.button-set-no-offset` is experimental
   and is not it.
4. **Card documentation** — refresh it against the newer CSS.
5. **Which build this repository should hold**, and whether there is a versioned distribution of
   the reference build.
