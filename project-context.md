# Project context: repository-wide

This file holds only the values that are the same for every project in this repository. It is the master index: start here, then read the project's own context.

**Per-project context** lives in `design/<project-id>/project-context.md`. That file is a dated Markdown export of the project's claude.ai project context Doc, which stays the master. The export carries the export date and the source Doc link at the top. A missing value is not permission to invent one.

## Repository
| Field | Value |
|---|---|
| Repository | `OGI-Product-Design/buckholt-ai` (https://github.com/OGI-Product-Design/buckholt-ai) |
| Prototype root | `prototypes/`, one `prototypes/<prototype-folder>/` per prototype, each with its own `PROTOTYPE.md` |
| Output convention | `design/<project-id>/`: the project's `project-context.md` export, repository-home living outputs, and dated exports of Claude Docs (build spec and build request included) |

## Buckholt sources in this repository
Read-only. See `AGENTS.md` for the source hierarchy and the reference build.

| Source | Path |
|---|---|
| Runtime CSS | `css/buckholt.css`, with `css/buckholt-ai-fixes.css` loaded after it |
| Canonical component markup | `components/<component>/examples.html`, verified against `code-specs-html/` |
| Component rules | `components/<component>/rules.md` |
| Tokens | CSS custom properties in `css/buckholt.css`, documented in `foundations/` (colour roles in `foundations/colour/foundation-tokens.md`) |
| Composition patterns | `patterns/<pattern>/` |
