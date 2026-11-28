---
title: Workflow
slug: workflow/
lead: Work moves through six stages and two gates. Agents do the work in each stage; designers, the PM and an engineer decide at the gates.
---

## The workflow at a glance

{{diagram:workflow}}

## Six designers, one workflow

The UX team is six designers. Everyone works through the same workflow, on the same board, with the same agents.

{{block:team}}

The proposal for sharing the work:

- **Every design item has one lead designer**, set in Assigned to on the design board. The lead moves the item through its statuses, makes or agrees the anchor screens, and brings the item to each gate.
- **A second designer reviews.** Each design item also names a reviewing designer, who reviews agent output alongside the lead, such as batches from {{agent:extend}} and reports from {{agent:align}}.
- **"Designers" at a gate means at least two of the six**: the lead and the reviewing designer, with the PM and an engineer.
- **The agents are shared.** The Cursor agents come from the repo, so all six designers run exactly the same rules; changes go through a pull request. The Copilot agents are created once and shared with the team.
- **Two owners, a delegate and contributors.** Laurence and Jon own the workflow and the agent definitions. Marijana is their delegate and acts for them. Katerina, Andrej and Mark are contributors: anyone can propose a change by pull request.

## Stages

Each stage has its own agents. An agent starts when the design item reaches the status that triggers it, and stops at a human check.

| Stage | Agents | Where they run |
|---|---|---|
| Foundation | {{agent:archive}} | Cursor, plus a weekly scheduled run |
| Discover | {{agent:brief}} {{agent:insight}} {{agent:map}} | Microsoft 365 Copilot, with Lucid and a Cursor step for LogRocket |
| Explore | {{agent:range}} {{agent:critic}} | Cursor, in the sandbox |
| Design | {{agent:extend}} {{agent:align}} | Cursor and Figma MCP |
| Prototype | {{agent:build}} {{agent:audit}} {{agent:observe}} | Cursor, with Playwright and axe |
| Handoff | {{agent:relay}} | Cursor and the Azure DevOps MCP |

Between Explore and Design, designers make the anchor screens in Figma. {{agent:extend}} builds out from them and never works without them.

## Gates

There are two gates. At each one, designers, the PM and an engineer decide together, using the evidence the agents have produced.

{{block:gates}}

## Stage statuses

The design item moves through these statuses in order. Some of them start an agent.

{{block:statuses}}

| Status | What it starts |
|---|---|
| Discovery | {{agent:insight}} synthesises research and behaviour evidence. |
| Discovery approved | {{agent:archive}} writes the discovery summary into the repo. {{agent:range}} starts on full-route items. |
| Shortlist agreed | Set when the shortlist gate passes. Designers make the anchor screens. |
| Anchors ready | {{agent:extend}} builds out the design from the anchors. |
| Design signed off | Set when the design sign-off gate passes. {{agent:build}} starts the prototype. |
| Handed over | Set on the feature by {{agent:relay}}. Engineering stories are ready. |

{{agent:brief}} starts earlier, when product sets the feature to Ready for design. {{agent:map}}'s output is approved by designers, who then move the status to Discovery approved.

## Fast track

{{agent:brief}} chooses the route for every feature and records why. The fast track goes from Discover straight to Design, skipping Explore and the shortlist gate.

Use the fast track only when all three are true:

- there is no new flow
- no new research is needed
- only existing screens change

Otherwise the feature takes the full route.

## Test loop

Prototypes are tested with people. {{agent:observe}} writes up the findings, and each finding says whether it goes back to {{agent:extend}} (a design change) or {{agent:build}} (a prototype change). Designers decide what changes. The loop repeats until testing is complete; then {{agent:relay}} hands over.

## Cadence under scaled agile

Design runs one sprint ahead of engineering: engineering stories are ready only when the design is Handed over. The proposed rhythm:

| When | What happens |
|---|---|
| Before PI planning | Product sets the features expected in the next planning increment to Ready for design. {{agent:brief}} writes their UX briefs and chooses each route. |
| PI planning | UX commits its sprint capacity against those features, using the routes to size them: fast-track items need less than full-route items. |
| Each sprint | Design items move through their statuses. A feature planned for engineering in a sprint should reach Handed over by the end of the sprint before it. |
| Each week | Gates are held at a fixed time, so a design item never waits more than a week for a decision. {{agent:archive}} runs its weekly check. |
| After release | {{agent:relay}} checks the build against the design and the success measures. Findings feed the next planning increment. |
