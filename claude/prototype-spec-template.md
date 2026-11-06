# Prototype Spec Template (for Claude Code)

Use this template when a chat in this project turns a feature discussion into a spec that Claude Code builds in `buckholt-ai/prototypes/`. It follows the house format of the existing specs (`originators-spec.md`, `calendar-spec.md`, `bacs-import-spec.md`) and adds the sections that make the Buckholt handoff explicit. Read `buckholt-reference.md` first.

## Rules for whoever writes the spec

1. **Behaviour, copy, data and rules. Never markup.** Name Buckholt components and patterns. Don't write HTML, classes, CSS, hex values or icon class strings (`buckholt-reference.md`, section 1).
2. **The spec beats the screenshots.** Where they differ, record it in "Known screenshot differences".
3. **Every state is written out:** default, populated, empty, no results, loading (if shown), error, disabled, permission-limited.
4. **Every gap is declared.** If the design needs something Buckholt does not document, list it under "Buckholt gaps". Don't approximate it silently.
5. **Copy is final.** Write exact strings in quotes. Apply the Brand Language and Tone of Voice guide: sentence case, Open GI terminology.
6. **Tag each fact with its source:** **[Figma]** (target design), **[Observed]** (UAT/production), **[Decision]** (agreed, with who and when), **[Assumption]** (to be validated).
7. **Status:** a spec is ready for Claude Code only when the Readiness checklist at the end passes.

---

# <Feature name> — Feature Specification

## About this document
- **Product / location:** <Configuration Hub > App > Section> or <Mobius PAS > Module > Section>
- **Readers:** developers, product, and Claude Code building a clickable prototype.
- **Prototype folder:** `prototypes/<Folder-name>/`
- **Screen IDs:** `<XX>-FF-SS`. XX is the feature code, FF the flow (00 = base page), SS the step. Screenshots in `screenshots/` are named by screen ID.
- **Shell:** <`CH-SHELL` spec / `prototypes/shared/app-shell` / none>. State what is static.
- **Revision:** <n>, <date>. Summary of what changed.

## What changed in this revision
| Area | Change |
|---|---|

## Feature overview
- What the feature is for, in two or three sentences. The user problem, not the UI.
- **Users and permissions:** who sees what (e.g. OGI-flag users vs client users).
- **Dependencies:** other apps, services or tabs this relies on or affects.
- **Out of scope for this prototype:** what is deliberately not built.

## Glossary
| Term | Meaning |
|---|---|

## Data model
| Field | Format / validation | Shown where | Notes |
|---|---|---|---|

**Rules:** invariants and business rules (e.g. "Exactly one default", "Only active users count toward licences").

## Seed data
The starting state every flow begins from unless a flow says otherwise. Use realistic Open GI data (e.g. tenant ZZ09, Krypton products). Include enough rows to exercise pagination, truncation and sorting.

## Prototype notes
- **Sources of truth:** screenshots for layout, this spec for behaviour and copy, Buckholt for component behaviour and styling.
- **State:** held in memory. A reload resets to the seed data.
- **Static areas:** <shell parts, other tabs>.
- **Viewport:** desktop first at 1440px. Responsive expectations: <none / state them>.

## Buckholt mapping
| UI element | Buckholt component / pattern | Variant or state needed | Notes |
|---|---|---|---|
| Page structure | Page layout: <layout>; Page body > Frame > Pane > Panel | | |
| e.g. Add user | Button | Primary | Common action: Add |
| e.g. User list | Table | Sortable headers | Pagination is a gap (see below) |

## Buckholt gaps
Anything the design needs that Buckholt does not document. Claude Code builds these under `prototypes/` and logs them in `SPEC-CHANGES.md` section C.
| Need | Why | Closest Buckholt option | Precedent (if any) | Expected behaviour |
|---|---|---|---|---|

## <XX>-00-01 · <Base page, populated state>
One-sentence purpose.

![<XX>-00-01 · caption](screenshots/<XX>-00-01.png)

### Page header
Breadcrumb, title, description (exact copy), primary actions.

### <Region / section>
Content, order, exact copy, interactions.

### Behaviour
Sorting defaults, selection, hover, focus, keyboard, sticky regions, truncation.

### States
| State | Trigger | What the user sees (exact copy) |
|---|---|---|
| Empty | | |
| No results | | |
| Error | | |

### Toasts and feedback
| Event | Message | Type |
|---|---|---|

## <XX>-01 · <Flow name>
**Starts from:** <XX>-00-01 (or another state).

### Steps
1. ...

### <Modal / drawer / panel name>
Fields in order: label, type, required or optional, helper text, default value, validation message (exact copy).

### Rules
Enable and disable conditions, confirmation logic, what changes in the data and on screen after Save.

*(Repeat for each flow.)*

## Accessibility requirements
Accessible names for icon-only controls (with Tooltip), focus order, focus return after a modal or drawer closes, Escape behaviour, announcements for toasts and live counts, meaning never conveyed by colour alone.

## Acceptance criteria
Testable statements that Claude Code turns into `test/` assertions.
- Given <state>, when <action>, then <result>.

## Open questions
| # | Question | Owner | Blocks build? |
|---|---|---|---|

## Known screenshot differences
| Screens | Screenshot shows | Build this instead |
|---|---|---|

## Changes from legacy (if replacing RD Apps / E&T / legacy UI)
| Area | Legacy | New |
|---|---|---|

## Screen index
| Screen ID | Figma frame / file |
|---|---|

---

## Readiness checklist (all must pass before handoff)
- [ ] Every screen in the index has a section, and every section has a screenshot or an explicit "no frame".
- [ ] All copy is final, quoted, and checked against the Tone of Voice guide.
- [ ] Every interactive element appears in the Buckholt mapping or in Buckholt gaps.
- [ ] No HTML, class names, hex values or icon class strings anywhere in the spec.
- [ ] Seed data covers empty, single, many and edge cases (long names, max values).
- [ ] Every state has defined copy.
- [ ] Open questions marked "Blocks build" are resolved or have an agreed assumption.
- [ ] Acceptance criteria cover every flow.
- [ ] Checked against the current `buckholt-reference.md` (and the live repo if the reference is more than about two weeks old).

## Handoff prompt for Claude Code
> Build the prototype specified in `prototypes/<Folder-name>/<feature>-spec.md`, with screenshots in `prototypes/<Folder-name>/screenshots/`. Follow `AGENTS.md` and its "complete page" reading order. Repository boundary: change files only inside `prototypes/<Folder-name>/`, except for the standard registration in the same PR: the prototype's live link in `PROTOTYPES.md` and its row in `prototypes/README.md` (its own entries only), plus its own test suite file in `test/`. Never edit `components/`, the rest of `AGENTS.md`, reference or discrepancy docs, global styles or tokens, `test/config.js`, `test/README.md`, `prototypes/shared/`, or the CH shell from a feature task. Build every item under "Buckholt gaps" as prototype-local. Record what you built and every deviation in `PROTOTYPE.md`, and findings for the spec, Figma and Buckholt in `SPEC-CHANGES.md`. Add assertions for the acceptance criteria and run the test suites. Work on a branch and open a PR. Don't commit to main. After merge, confirm the live link loads.
