# BACS Calendar

Spec package for the **Calendar** tab of Mobius PAS (Accounts › BACS › Calendar). Same structure as the Originators and BACS Import packages.

## Contents

| File | What it is |
|---|---|
| `calendar-spec.md` | Full specification. The source of truth. |
| `screenshots/` | Figma frames, named by screen ID and referenced from the spec. |

The build that came out of this package lives in the same folder
(`index.html`, `bacs-calendar.css`, `bacs-calendar.js`), with its notes in
`PROTOTYPE.md` and its feedback in `SPEC-CHANGES.md`. The Calendar component
is at `../calendar/` and the shared collection-day data at
`../data/calendar.js`, both as section 3 and section 11 ask.

## Screen IDs

Format **CA-FF-SS**: `CA` = Calendar, `FF` = flow, `SS` = screen within the flow.

| Flow | Name | Screens |
|---|---|---|
| CA-00 | Calendar overview | CA-00-01 |
| CA-01 | Month navigation | CA-01-01 |
| CA-02 | Add and remove single dates | CA-02-01 to CA-02-02 |
| CA-03 | Schedule: Every working day | CA-03-01 to CA-03-03 |
| CA-04 | Schedule: Set days of the month | CA-04-01 to CA-04-04 |
| CA-05 | Schedule: No default | CA-05-01 to CA-05-04 |
| CA-06 | Bank holidays | CA-06-01 |

## Key build notes

- The calendar is **new to Buckholt**. Use Buckholt components and tokens wherever they exist, and build the calendar grid, day cells and month picker in a new **`calendar/`** component folder (`calendar.md`, `calendar.css`, `example.html`). See spec section 3.
- Build as the next tab in the **same prototype** as Originators and Import.
- Some Figma frames contain data errors. Section 12 of the spec lists them; the spec wins.
