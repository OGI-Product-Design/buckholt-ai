---
title: Governance and rollout
slug: governance/
lead: People own every decision. This page says who owns what, how work is reviewed and how we will know the workflow is working.
---

## Ownership

| What | Owner |
|---|---|
| The workflow and this site | Owners: Laurence Abbott and Jon. Delegate: Marijana |
| The design team | Laurence and Jon (owners), Marijana (delegate), Katerina, Andrej and Mark (contributors) |
| Agent definitions in `/agents` | Laurence and Jon, changed by pull request |
| Rules in `/.cursor/rules` | Changed by pull request |
| Product packs | Laurence or Jon approves every change |
| Buckholt core and legacy CSS | Their owners; no agent writes to them |
| Each design item | Its lead designer, set in Assigned to, with a reviewing designer |
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

For the workflow itself, the proposed measures are:

| Measure | What it tells us | Source |
|---|---|---|
| Time from Ready for design to Handed over | Whether design keeps one sprint ahead | Azure DevOps |
| Time in each status | Where work waits | Azure DevOps |
| Gates passed first time | Whether evidence is ready when the gate meets | Decision log |
| Findings sent back by the test loop | How much rework testing finds | {{agent:observe}} findings |
| Critical issues found by {{agent:audit}} | Quality before people see a prototype | Audit reports |
| Extensions reused against created | Whether the register is working | Extensions register |

## Rollout phases

The proposed rollout adds the agents in workflow order, one phase at a time, with a pilot feature first.

| Phase | What is set up | Ready to move on when |
|---|---|---|
| 1. Foundations | Repo and locks, product packs, the design board, the SharePoint site. {{agent:archive}} starts. | A pack exists for the pilot product and the board runs on stage statuses. |
| 2. Discover | Connectors for Copilot, Azure DevOps and Lucid. {{agent:brief}}, {{agent:insight}} and {{agent:map}}. | One pilot feature reaches Discovery approved. |
| 3. Explore and Design | The sandbox, Figma MCP and Lucid MCP. {{agent:range}}, {{agent:critic}}, {{agent:extend}} and {{agent:align}}. | The pilot passes the design sign-off gate. |
| 4. Prototype and handoff | `/tests`, LogRocket MCP and the Azure DevOps MCP. {{agent:build}}, {{agent:audit}}, {{agent:observe}} and {{agent:relay}}. | The pilot is Handed over and the release check is posted. |
| 5. All features | Every new feature goes through the workflow. | Reviewed after one planning increment. |

## Open questions

- Which product and feature should be the pilot?
- How many Figma Full seats are needed for {{agent:extend}}'s write access?
- Where should the extensions register live: one in `/context`, or one per product?
- Who approves changes to `/.cursor/rules`?
- Do fast-tracked changes need new anchor screens, or do the current screens act as anchors?
- The `/agents` rules files do not exist yet. Until they do, each agent page shows rules generated from `agents.json`.
