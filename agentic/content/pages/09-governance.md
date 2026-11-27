---
title: Governance and rollout
slug: governance/
lead: People own every decision. This page says who owns what, how work is reviewed and how we will know the workflow is working.
---

## Ownership

| What | Owner |
|---|---|
| The workflow and this site | Laurence Abbott (backup: Jon) |
| Agent definitions in `/agents` | Laurence, changed by pull request |
| Rules in `/.cursor/rules` | Changed by pull request |
| Product packs | Laurence or Jon approves every change |
| Buckholt core and legacy CSS | Their owners; no agent writes to them |
| Direction and scope | The shortlist gate: designers, PM, engineer |
| Design sign-off | The sign-off gate: designers, PM, engineer |

## Reviews

Every agent stops at a human check. The main ones:

- Designers validate {{agent:insight}}'s insights and approve {{agent:map}}'s flows and worklist.
- Designers review every {{agent:extend}} batch.
- Designers decide which of {{agent:align}}'s issues are mistakes and which are deliberate.
- Designers check {{agent:build}}'s prototypes for fidelity and behaviour.
- {{agent:audit}} blocks testing when it finds a critical accessibility issue.
- Designers review before {{agent:relay}} hands over; engineering reviews feasibility.

Each agent's page lists its human gate.

## Keeping the system healthy

{{agent:archive}} runs a weekly check and posts a health report. It flags:

- product packs older than 90 days
- extension register entries missing their Figma or code half
- gates with no decision logged

It also tracks daily Figma MCP calls and warns the team at 80% of the limit.

After each gate, {{agent:archive}} adds the decision to the decision log.

## Measures

Every feature has success measures.

1. {{agent:brief}} drafts them in the UX brief.
2. {{agent:insight}} pulls LogRocket baselines for them: completion, drop-off, errors and rage clicks on the flows in scope.
3. {{agent:observe}} compares test results with the baselines.
4. After release, {{agent:relay}} compares LogRocket data with the success measures and posts the report.

> To come: Measures for the workflow itself, such as time from Ready for design to Handed over, will be added from the source doc.

## Rollout phases

> To come: The rollout phases will be added from the source doc.

## Open questions

These came up while building this site:

- The `/agents` rules files do not exist yet. Until they do, each agent page shows rules generated from `agents.json`.
- Buckholt has four expressive colour families for six stages, so Handoff shares Prototype's colour. Is that acceptable?
- Two of Buckholt's light expressive Tags are below WCAG AA contrast. This site darkens the label as an extension; the finding should go to the Buckholt owners.
- Where should the extensions register live: `/context`, as the brief says, or with each product?
