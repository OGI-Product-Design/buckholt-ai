# Project context

Status: setup template. Replace "Not supplied" with verified values. A missing value is not permission to invent one.

This is the project's artefact index: skills update the links here when they create or move an artefact. In Claude Code keep it as `project-context.md` at the project root. In a claude.ai Project, create it as a Claude Doc and put its link in the Project instructions, because Claude cannot write to Project knowledge.

## Project
| Field | Value |
|---|---|
| Project name and stable ID | Not supplied |
| Work item and parent epic (IDs and URLs) | Not supplied |
| Designers (stable ID and display name) | Not supplied |
| Product and engineering contacts | Not supplied |
| Work completion definition | Not supplied |
| Review status and approval evidence | Not supplied |

## Output home
| Field | Value |
|---|---|
| Living outputs kept as | Claude Docs / repository files (choose one) |

## Artefact index
| Artefact | Doc link or file path | Version / date | Status |
|---|---|---|---|
| Discovery sources and research location | Not supplied | | |
| Discovery summary | Not supplied | | |
| Design worklist | Not supplied | | |
| Success measures | Not supplied | | |
| Lucid board and design-work area | Not supplied | | |
| Figma project destination for new files | Not supplied | | |
| Project Figma file and key pages/nodes | Not supplied | | |
| Design rationale | Not supplied | | |
| Prototype build spec (and repository export) | Not supplied | | |
| Build handoff | Not supplied | | |
| Repository, prototype folder and preview URL | Repository: `OGI-Product-Design/buckholt-ai` (https://github.com/OGI-Product-Design/buckholt-ai). Prototype folder: `prototypes/<prototype-folder>/`, one folder per prototype, each with its own `PROTOTYPE.md`. Preview URL: Not supplied | | |
| Product spec | Not supplied | | |
| Timing ledger (repository folder or Claude Sheet) | Not supplied | | |

## Buckholt sources
| Source | Link or path | Published version |
|---|---|---|
| Documentation | Not supplied | |
| Figma library | Not supplied | |
| HTML/CSS and token paths | Runtime CSS `css/buckholt.css` (load `css/buckholt-ai-fixes.css` after it); canonical markup `components/<component>/examples.html`, verified against `code-specs-html/`; tokens as CSS custom properties in `css/buckholt.css`, documented in `foundations/` (colour roles in `foundations/colour/foundation-tokens.md`) | |
| Angular Storybook | Not supplied | |

## Connector capabilities
Record what each connection was verified to do, and when. Leave as "Not verified" until checked.

| Connection | Read | Write / create | Verified on |
|---|---|---|---|
| Figma | Not verified | Not verified | |
| Lucid | Not verified | Not verified | |
| Repository | Not verified | Not verified | |
| Claude Docs | Not verified | Not verified | |

## Conventions
| Field | Value |
|---|---|
| Output directory (repository home) | `design/<project-id>/` (exports and repository-home living outputs) |
| Reporting timezone | Proposed Europe/London |
| Phases | Proposed: discovery, design, prototype, review, engineering-collaboration |
| Iteration labels | Proposed: I01, I02 per work item |
| Success-measure and post-release data sources | Not supplied |
