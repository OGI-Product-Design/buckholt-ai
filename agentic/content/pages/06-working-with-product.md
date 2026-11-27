---
title: Working with product
slug: working-with-product/
lead: Product and UX meet through a contract, not through each other's agents.
---

## The contract

{{diagram:product-contract}}

| Product management owns | UX owns |
|---|---|
| Epics and features | Design items and the design board |
| Outcomes and criteria | The UX brief and success measures |
| Story-writing agents | UX agents and templates |
| Quarterly priorities | UX sprint capacity |

Two things cross between them: **Ready for design**, from product to UX, and **UX outputs on stories**, from UX to product.

## What we consume

- A feature set to **Ready for design**. The status is the trigger.
- The feature fields: problem, outcome, products, users, priority, quarter and constraints. {{agent:brief}} will not start until they are complete.
- The feature's stories, SharePoint specs and related Teams and Outlook threads, which {{agent:brief}} reads.
- The PM's confirmation of scope on the UX brief.

## What we publish

- The UX brief and draft success measures, linked on the design item.
- The **Design status** field on the feature, which shows where design is.
- At handoff, a linked UX section on each engineering story: UX acceptance criteria (Given, When, Then), Figma and prototype links, and the predecessor link.
- After release, a check by {{agent:relay}} of the build against the design, and of LogRocket data against the success measures.

## Working alongside other agents

Product has its own agents, including story-writing agents. Ours never do their work or change theirs:

- {{agent:brief}} never rewrites the PM's feature or stories.
- {{agent:relay}} never edits the PM's story text and never changes engineering statuses.
- {{agent:relay}} never hands over anything that has not been signed off.

If a feature is missing fields, {{agent:brief}} comments the gaps on the feature and stops. It does not fill them in.

## Where product joins in

- The PM confirms scope on the UX brief.
- The PM sits on both gates, with designers and an engineer.
- PMs read the UX brief and the decision log.
