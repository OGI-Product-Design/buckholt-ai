---
name: prototype
description: Build or revise a clickable HTML/CSS/JS prototype in this repository from a build spec and its screenshots, using Buckholt. Use when someone runs /prototype, hands over a feature spec (a `<feature>-spec.md` and a `screenshots/` folder), or asks for a prototype to be built, rebuilt to a new spec revision, or checked against its spec. The prototype goes in `prototypes/<Feature-folder>/`, with its build notes, its spec feedback and its own test suite.
---

# /prototype: build a prototype from a build spec

This is the way the BACS prototypes (Originators, BACS Import, BACS Calendar) were built, written so it works for any feature. You turn a **build spec** plus its **screenshots** into a clickable prototype that uses real Buckholt. You record every judgement call and feed what you learned back to the spec, the Figma and Buckholt.

`AGENTS.md` applies in full; this skill adds the build workflow on top. Where they disagree, `AGENTS.md` wins.

**Worked examples to copy the shape of:**

- `prototypes/BACS-import/`: a feature with a new component (the reason codes blade).
- `prototypes/BACS-calendar/`: a feature that needed a shared component and shared data.
- `prototypes/Originators/`: the first feature, with the longest deviations list.

Read one before you start a new prototype.

---

## What you need before you start

| Input | Where it lives | If it is missing |
|---|---|---|
| **Build spec**: behaviour, copy, data, rules, screen index, prototype notes | `prototypes/<Feature-folder>/<feature>-spec.md`. If its master is a Claude Doc, use the dated export in `design/<project-id>/`. | Stop and ask for it. Do not build from screenshots alone. |
| **Screenshots**: Figma exports named by screen ID (`XX-FF-SS.png`) | `prototypes/<Feature-folder>/screenshots/` | Build from the spec and note "no frame" against each screen. |
| **Project context** | `project-context.md` (repository-wide) and `design/<project-id>/project-context.md` (this project) | Carry on, and say which values were not available. |

Screen IDs follow `XX-FF-SS`:

- `XX` is the feature code (`OR`, `IM`, `CA`, …).
- `FF` is the flow. `00` is the base page.
- `SS` is the step.

New specs follow the house format of the existing specs (`originators-spec.md`, `bacs-import-spec.md`, `calendar-spec.md`). If a spec uses `claude/prototype-spec-template.md`, run its readiness checklist first.

---

## 1. Read before you build

1. `AGENTS.md`, and its **complete page** reading order: `CANONICAL-MARKUP.md`, then `patterns/page-layout/rules.md`, then the relevant patterns and foundations, then every component folder you will use.
2. The whole spec, including open questions, known screenshot differences and prototype notes.
3. Every screenshot, against the spec's screen index.
4. For a revision or a sibling feature, also read:
   - the existing `PROTOTYPE.md` and `SPEC-CHANGES.md`;
   - `prototypes/README.md`;
   - `prototypes/shared/README.md`, or `prototypes/CH-SHELL/PROTOTYPE.md` for Configuration Hub.

**Precedence rules:**

- **The spec beats the screenshots** on data, behaviour and copy.
- The screenshots decide the look wherever the spec defers to them, for example a "confirm in Figma" column.
- Buckholt decides how a component behaves and is styled.

Record every case where you followed one source over another.

**Open questions:**

- If an open question is marked as blocking the build, or a state has no copy, ask the user. Do not invent copy, data or behaviour.
- If an open question is not blocking, build the spec's stated assumption and list it in `PROTOTYPE.md`.

## 2. Set up the folder

- Name it `prototypes/<Feature-folder>/` with hyphens, never spaces, for example `BACS-calendar` or `CH-AUDIT-UM`. Sibling tabs link across folders, and a space becomes `%20` in every link. If a spec package arrives with a space in its name, rename the folder only and say so in `PROTOTYPE.md`.
- Keep the spec package as it arrived:
  - `<feature>-spec.md`;
  - `screenshots/`;
  - the package `README.md`, if there is one.
- Keep one master of the spec. If the master is a Claude Doc, the dated export lives in `design/<project-id>/`. Point to it from the folder's `README.md` rather than copying it in.

Typical contents when finished:

```text
prototypes/<Feature-folder>/
  <feature>-spec.md    the build spec (or a pointer to its export)
  screenshots/         XX-FF-SS.png
  index.html           the page: runtime contract, page structure, components
  <feature>.css        prototype-only layout and the pieces Buckholt lacks
  <feature>.js         rendering, routes, flows; state in memory
  seed-data.js         the spec's seed data, extracted verbatim
  PROTOTYPE.md         build notes: what was built and every deviation
  SPEC-CHANGES.md      what to feed back to the spec, the Figma and Buckholt
```

## 3. Map every element to Buckholt first

Before writing markup, list every UI element and the Buckholt component or pattern that supplies it. Start from the spec's Buckholt mapping if it has one.

- **Use documented markup exactly.** Copy each component's markup from `components/<component>/examples.html` and `rules.md`. Use real classes and variables from `css/buckholt.css`. Never imitate a component with your own CSS.
- **Measure, don't eyeball.** Where it is unclear which component or variant a frame shows, measure the frame against `css/buckholt.css` and decide on the numbers: sizes, padding, gaps, colours, type. BACS Calendar settled its cards, buttons and month picker this way. Record the measurement in `PROTOTYPE.md`.
- **Check the icon catalogue.** Take icons from `foundations/iconography/catalogue.md`, and keep common-action icons to their documented meaning.
- **Handle gaps openly.** If Buckholt documents no component for something (a blade, a calendar, pagination, a file drop zone), it is a gap:
  - Build it **prototype-local** in `<feature>.css`, from Buckholt tokens, with no invented colours.
  - List it in `PROTOTYPE.md` under "What is Buckholt and what is not".
  - Raise it in `SPEC-CHANGES.md` section C.
  - Never put it in `components/`, `foundations/` or `patterns/`.
- **Ask before sharing a gap.** If a second prototype needs the same gap, it belongs in `prototypes/shared/`, as the blade and `shared/calendar/` do. Changing `shared/` changes other prototypes, so do it only when the user agrees, and run `test/regression.js`.

## 4. Build

- **No build step.**
  - Static HTML, CSS and JS that open straight from `index.html`.
  - Every path is relative, for example `../../css/buckholt.css` and `../shared/app-shell.css`.
  - No frameworks, no npm and no compiled output.
- **Load the runtime contract in `AGENTS.md` order.** The Typekit fonts, the Font Awesome kit, `../../css/buckholt.css`, then `../../css/buckholt-ai-fixes.css`. Then the shared prototype CSS, then `<feature>.css`. Never load a separate Bootstrap stylesheet. Load the Bootstrap 5.1.3 bundle, then any Buckholt component scripts from `../../components/` (`dropdown.js`, `form.js`, `tabs.js`).
- **Page structure.**
  - Use a documented Buckholt layout (`data-layout`), then Page body → Frame → Pane → Panel.
  - Use semantic `<header>`, `<aside>`, `<main>` and `<footer>` elements.
  - Use Bootstrap grid classes only for horizontal structure.
- **Application chrome is not Buckholt.**
  - Mobius PAS features reuse `prototypes/shared/app-shell.*`.
  - Configuration Hub features load the shell from `prototypes/CH-SHELL/shell/`.
  - Do not copy the chrome into the feature folder.
- **Behaviour comes from the spec's prototype notes.**
  - Use hash routes for pages and detail views.
  - Hold state in memory, seeded on load; a reload resets it.
  - Use the spec's simulated timings and outcomes, for example a filename containing "fail".
  - Add query-string toggles for variants and permissions, for example `?permission=none` or `?seed=long-names`.
- **Build every state** the spec defines: default, populated, empty, no results, loading, error, disabled and permission-limited. Use the spec's exact copy, in UK English and sentence case.
- **Accessibility, as you go, not at the end.**
  - Give every icon-only control an accessible name and the documented Tooltip.
  - Show a visible focus ring everywhere, and check it is never clipped.
  - Make the focus order logical.
  - Return focus to the trigger when a modal or blade closes, and let Escape close it.
  - Announce toasts and live counts.
  - Never use colour alone to carry meaning.
- **Link sibling tabs.** If the feature is a tab of an existing prototype, link the tabs across folders. Keep any old placeholder route working by handing it over to the new page.
- **Label it as a prototype.** Disclose mocked behaviour in `PROTOTYPE.md`, and on the page if the spec asks.

## 5. Record what you built

### `PROTOTYPE.md`: the build notes

Use the headings of the BACS prototypes:

1. **Header:** what this is, which spec revision and date it was built from, and a file table.
2. **Runtime contract:** the head and script order. State that `css/` and the Buckholt folders were not touched.
3. **What is Buckholt and what is not:** the components used, and a table of everything prototype-local with where it lives and why.
4. **Buckholt components used, and where:** include how ambiguous identifications were settled.
5. **Deviations and judgement calls:** numbered, never renumbered, each with:
   - what the spec or frame says;
   - what the build does;
   - why;
   - how to reverse it.
   Mark one that changes the spec as **spec changed**. Mark one that is withdrawn as **Withdrawn \<date\>**; do not delete it.
6. **Open questions:** how each affected the build.
7. **Verification:** the suites, what each covers, assertion counts, and what could not be checked.
8. **Revisions:** add a dated section for each later change (`## Revision, <date>: <what>`), saying what changed and why.

### `SPEC-CHANGES.md`: feedback to the people who own the sources

Write three sections:

- **A. Changes to `<feature>-spec.md`**
- **B. Changes to the Figma frames**
- **C. Tickets for Buckholt**

C covers design-system gaps and defects, not feature issues.

- Number items `A1`, `B1`, `C1` and so on. Never renumber them.
- Tag each item's status: **decision needed**, **settled, built**, **settled, spec needs amending** or **minor, no change made**.
- Each item says what the prototype does **now**, so the spec can be brought in line with something already working. Where helpful, give suggested spec wording.
- Before calling something a Buckholt defect, classify it (`AGENTS.md`, Runtime verification): local build regression, upstream markup/CSS mismatch, or unresolved. Check `discrepancies/build-provenance.md`.

## 6. Test

1. **Write the feature's own suite.**
   - Name it `test/<feature>.js`.
   - Use Playwright, following the shape of `test/ch-users.js` or `test/calendar-flows.js`.
   - Give one assertion per acceptance criterion in the spec, and cover every flow and state.
   - Add the spec's accessibility checks: keyboard-only walkthrough, focus visible, focus return, tooltips on focus, live regions.
   - Add responsive widths if the spec defines them.
2. **Run it against the mirror**, as `test/README.md` describes: `python3 test/build-mirror.py`, serve `../buckholt-mirror`, then `node test/<feature>.js`.
3. **Run the cross-cutting checks:**
   - `node test/regression.js`, whenever anything shared or a sibling link changed;
   - `python3 test/source-parity.py`, which must still pass because nothing in `components/` changes.
4. **Compare against the frames.** Screenshot each screen ID and compare it with its frame. The mirror swaps the brand font and Pro icons, so trust box sizes and vertical rhythm there, but not text widths or Pro-only glyphs. Say so in Verification.

Report failures as failures. Never skip or weaken an assertion to get green.

## 7. Register the prototype

Do this in the same change as the build, touching only this prototype's own entries:

- Add a row to `prototypes/README.md` (folder, feature, built from).
- Add the live link to `PROTOTYPES.md`. GitHub Pages serves `https://ogi-product-design.github.io/buckholt-ai/prototypes/<Feature-folder>/`.
- Link the prototype and its build spec in `design/<project-id>/project-context.md`, or give the user the exact line to add to the project context Doc.

## 8. Boundary: what a /prototype task may change

| May change | Must not change without the user asking in this session |
|---|---|
| `prototypes/<Feature-folder>/` | `css/`, `components/`, `foundations/`, `patterns/`, `code-specs-html/`, `discrepancies/`, `verification/`, `responsive/` |
| `test/<feature>.js` | `test/config.js`, `test/README.md`, other suites |
| This prototype's rows in `prototypes/README.md` and `PROTOTYPES.md` | `AGENTS.md`, `CLAUDE.md`, `claude/`, the root `project-context.md` |
| `design/<project-id>/` outputs for this project | `prototypes/shared/`, the CH shell, other prototypes |

If the build needs something outside the left-hand column, stop and say what you need and why.

## 9. Revising to a new spec revision

1. Replace the spec with the new revision, or refresh the dated export, and add or replace the screenshots.
2. Read the spec's "What changed in this revision" list and diff it against what was built.
3. Change the build. Then:
   - add a dated revision section to `PROTOTYPE.md`;
   - update `SPEC-CHANGES.md` items as settled or withdrawn;
   - update the suite's assertions to the new acceptance criteria.
4. Re-run every suite in step 6.

## 10. Hand back

- Commit on a branch. Do not commit to `main`. Open or merge a pull request only when the user asks.
- After a merge, confirm the live link loads.
- End with:
  - the output location (folder and live link);
  - what changed;
  - the deviations and `SPEC-CHANGES.md` items that need a decision;
  - remaining gaps, including what the tests could not check;
  - linked artefacts affected (spec, Figma, project context).
