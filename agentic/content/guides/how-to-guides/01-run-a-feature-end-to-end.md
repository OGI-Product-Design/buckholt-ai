---
title: Run a feature end to end
lead: From Ready for design to Handed over, on the full route.
---

## Before you start

The feature needs its fields complete: problem, outcome, products, users, priority, quarter and constraints. Each product it touches needs a product pack.

## Discover

1. Product sets the feature to Ready for design. {{agent:brief}} checks the fields, finds the product packs, chooses the route and writes the UX brief.
2. The PM confirms scope. The lead designer moves the status to Discovery.
3. {{agent:insight}} synthesises research and pulls LogRocket baselines. The lead and reviewing designers validate the insights.
4. {{agent:map}} maps the journeys and writes the screen inventory and design worklist. The lead and reviewing designers approve, then move the status to Discovery approved.
5. {{agent:archive}} writes the discovery summary into the repo.

## Explore

1. {{agent:range}} builds 5 to 10 greybox directions in the sandbox and posts an index.
2. {{agent:critic}} stress-tests each direction and recommends up to three.
3. **Shortlist gate.** Designers, the PM and an engineer agree direction, scope and early feasibility. Status: Shortlist agreed.

## Design

1. The lead designer makes or agrees the anchor screens in Figma. The status moves to Anchors ready.
2. {{agent:extend}} builds out the remaining screens in batches of up to five. The lead and reviewing designers review every batch.
3. {{agent:align}} checks each batch for consistency. The lead designer decides what to fix.
4. **Design sign-off gate.** Designers, the PM and an engineer agree the design meets the success measures and is buildable. Status: Design signed off.

## Prototype and test

1. {{agent:build}} builds the prototype in the product's styling mode and posts the preview.
2. {{agent:audit}} runs axe, keyboard, contrast and Buckholt checks. A critical accessibility issue blocks testing.
3. {{agent:observe}} drafts the test plan. The lead designer runs the sessions; {{agent:observe}} tags the recordings and writes findings.
4. Findings go back to {{agent:extend}} or {{agent:build}} until the lead designer marks testing complete.

## Hand over

1. {{agent:relay}} writes the specs and UX acceptance criteria and adds them to each engineering story.
2. {{agent:relay}} sets Design status on the feature to Handed over.
3. After release, {{agent:relay}} checks the build against the design and the success measures, and posts the report.
