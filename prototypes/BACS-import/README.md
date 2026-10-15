# BACS Import

This folder is the specification package for the **BACS Import** feature in Mobius PAS (Accounts › BACS › Import). Users import ARUDD and AUDDIS Return/ADDACS files from BACS, see the history and result of every import, open an import to check each record, and look up reason codes in a searchable blade.

## Contents

| Path | What it is |
|---|---|
| `bacs-import-spec.md` | The full specification. It covers flows, rules, copy, data model, seed data, the reason codes blade component, prototype notes and changes from legacy. |
| `screenshots/` | Figma exports, named by screen ID (`IM-FF-SS.png`). Only unique frames are included. The spec explains where frames are shared between flows. |

## Screen ID convention

`IM-FF-SS`, where IM is Import, FF is the flow and SS is the step.

| Flow | Name |
|---|---|
| IM-00 | Previous imports (base page) |
| IM-01 | Filter by import result |
| IM-02 | Filter by BACS file type |
| IM-03 | Import an ARUDD file |
| IM-04 | Import an AUDDIS Return/ADDACS file |
| IM-05 | File format error |
| IM-06 | Failed import |
| IM-07 | Partial import |
| IM-08 | View an ARUDD import, including the reason codes blade and row menu |
| IM-09 | View an AUDDIS Return/ADDACS import |
| IM-10 | No permission to import |

## Building the prototype

Give Claude Code this folder with a prompt like:

> Build a clickable HTML/CSS/JS prototype of the BACS Import feature from `bacs-import-spec.md`, using the screenshots as the visual reference. Follow section 15 for the stack, routes, simulated timings and outcomes. The reason codes blade isn't in Buckholt, so build it as a reusable component to section 13, including every search, highlighting, expansion and accessibility rule.

Things to know before building:

- **Figma and the spec.** Where they differ, the spec wins. Examples: the new-import timestamp, and the typo "ARUUDAugust202601.txt".
- **"Not in Figma — confirmed" labels.** These mark agreed states that aren't in the frames, such as empty states and the Partial and Failed toasts. Build them as described.
- **Interactive mockup.** The mockup of the detail pages and blade behaviour is here: https://claude.ai/artifact/EEPUg3xKVPVi4TAURnNoci

## Related

- **Originators** (Accounts › BACS › Originators) shares the app shell, table, tooltip and Bootstrap toast patterns.

## Status

Version 1.0, 30 September 2026. The open questions are in section 16 of the spec.
