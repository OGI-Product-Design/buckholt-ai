---
title: Artifacts and templates
slug: artifacts-and-templates/
lead: Seven artifacts carry the work between agents. Each has one writer, one home, and named readers.
---

## The seven artifacts

{{diagram:artifact-flow}}

| Artifact | Written by | Where it lives | Read by |
|---|---|---|---|
| Product pack | {{agent:archive}}, with Laurence's approval | Repo `/context`, copy in SharePoint | All agents |
| UX brief | {{agent:brief}} | SharePoint, linked on the design item | {{agent:insight}}, {{agent:map}}, the PM |
| Discovery summary | {{agent:insight}} and {{agent:map}} | SharePoint, summary copy in the repo | {{agent:range}}, {{agent:critic}}, {{agent:build}}, {{agent:observe}} |
| Decision log | {{agent:archive}}, from gate outcomes | Repo `/context` | All agents, Jim, PMs |
| Extensions register | {{agent:extend}} and {{agent:build}} | Repo `/context` | {{agent:align}}, {{agent:audit}}, {{agent:relay}} |
| Migration map | {{agent:archive}} | Repo `/context` | {{agent:build}}, {{agent:align}} |
| Agent definition | Laurence | Repo `/agents` | The agent itself |

## Where each one comes from

- **Product pack**: one per product, including its styling mode. A change is merged in the repo, then {{agent:archive}} updates the SharePoint copy. Laurence or Jon approves every change.
- **UX brief**: {{agent:brief}} writes it from the template once the feature has everything it needs, and links it on the design item.
- **Discovery summary**: {{agent:insight}} lists every source, anonymises personal details and groups findings into themes with evidence. On Discovery approved, {{agent:archive}} writes the repo copy to `/context/discovery/[feature].md`.
- **Decision log**: after each gate, {{agent:archive}} adds the decision to `decision-log.md` from the gate notes.
- **Extensions register**: one entry per extension, with a Figma half and a code half.
- **Agent definition**: one file per agent in `/agents`, changed by pull request.

## Templates

The agents work from shared templates. Each one below follows what the agent's rules say it must contain. Copy a template to use it.

### UX brief

Written by {{agent:brief}}, saved to SharePoint and linked on the design item.

```markdown "UX brief template"
# UX brief: [feature name]

Design item: [link]   Feature: [link]   Date: [date]

## Problem
[The user problem, in one or two sentences.]

## Outcome
[What changes for users and the business when this is done.]

## Products and styling mode
- [Product]: [Buckholt, Hybrid or Legacy]

## Users
[Who this is for.]

## Priority and quarter
[Priority] · [Quarter]

## Constraints
- [Constraint]

## Route
[Full or Fast track]
Why: [No new flow? No new research needed? Only existing screens change?]

## Success measures
| Measure | Baseline (from Insight) | Target |
|---|---|---|
| Completion | [to request] | [target] |
| Drop-off | [to request] | [target] |
| Errors | [to request] | [target] |

## Scope confirmed by the PM
[Name, date]
```

### Discovery summary

Written by {{agent:insight}}, saved to SharePoint, then copied into the repo by {{agent:archive}}.

```markdown "Discovery summary template"
# Discovery summary: [feature name]

## Sources
- [SRC-01] [Source, link, date]

## Themes
### [Theme]
Evidence: [SRC-01, SRC-02]   Products: [product]
[What we found.]

## Pain points, ranked
| Pain point | How often | How badly | Evidence |
|---|---|---|---|

## Baselines (LogRocket)
| Flow | Completion | Drop-off | Errors | Rage clicks |
|---|---|---|---|---|

## Evidence gaps
- [Gap]: [research that would fill it]

All personal data removed: [yes]
```

### Critique

Written by {{agent:critic}} as `critique.md` in the sandbox feature folder.

```markdown "Critique template"
# Critique: [feature name]

## Direction [n]: [name]
- User needs served: [themes]
- User needs missed: [themes]
- Edge cases: empty [ ] error [ ] loading [ ] permissions [ ] heavy data [ ] long text [ ]
- Consistency with product patterns and styling mode: [notes]
- Build effort: [low, medium or high], because [reason]
- Risks: [risks]

## Recommendation (for the shortlist gate to decide)
1. [Direction], because [reason]
```

### Decision log entry

Added to `decision-log.md` by {{agent:archive}} after each gate.

```markdown "Decision log entry template"
## [Date] · [Feature] · [Shortlist gate or Design sign-off gate]
People: [designers, PM, engineer]
Decision: [what was decided]
Evidence: [links]
Status set to: [Shortlist agreed or Design signed off]
```

### Extensions register entry

Added by {{agent:extend}} (Figma half) and {{agent:build}} (code half).

```markdown "Extensions register entry template"
| ID | Component | Product | Why Buckholt does not cover it | Figma (x/ name, link) | Code (x- class, path) | Tokens used | Status |
|---|---|---|---|---|---|---|---|
| X-[n] | [name] | [product] | [reason] | [x/name] | [x-name, /extensions/product/] | [tokens] | [draft, reviewed, approved] |
```

### Align and Audit reports

Posted on the design item, issues listed by severity.

```markdown "Report template"
# [Align or Audit] report: [feature name], [date]

| Severity | Issue | Where (frame or page link) | Rule |
|---|---|---|---|
| Critical | [issue] | [link] | [rule] |
| Serious | [issue] | [link] | [rule] |
| Minor | [issue] | [link] | [rule] |
```

### Test findings

Written by {{agent:observe}} after the sessions.

```markdown "Test findings template"
# Test findings: [feature name]

| Task | Success | Compared with baseline |
|---|---|---|

## Findings
| Issue | Participants | Severity | Suggested change | Goes back to |
|---|---|---|---|---|
| [issue] | [n of n] | [severity] | [change] | [Extend or Build] |
```

### UX section on a story

Added to each engineering story by {{agent:relay}}.

```markdown "Story UX section template"
## UX
Figma: [link]   Prototype: [link]   Spec: [link]

### UX acceptance criteria
- Given [context], when [action], then [result].

### States
Empty · Loading · Error · Success · Permissions

### Components
- [Element]: [Storybook component or flagged extension]
```

### Agent definition

One file per agent in `/agents`, written by Laurence and changed by pull request. Each agent page on this site shows its file in this shape.

```markdown "Agent definition template"
# [Agent name]

Stage: [stage]
Tool: [tool]
Job: [one sentence]

## Triggered by
## Reads
## Steps
## Produces
## Human gate
## Never
## Done when
```

The sandbox uses one more shared file: `greybox.css`, the only styling {{agent:range}} may use, so explorations stay deliberately rough.
