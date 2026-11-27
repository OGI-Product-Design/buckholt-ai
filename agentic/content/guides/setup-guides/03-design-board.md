---
title: Design board
lead: The design board runs the workflow. Its stage statuses are what start each agent.
---

## Who does it

Laurence, with an Azure DevOps project administrator.

## What you need

- Rights to edit the process and create a board in the Azure DevOps project
- Agreement with product on the Design status field on features

## Steps

1. Create the UX design board for the UX team.
2. Add a design item work item type, with one design item per feature.
3. Set the board's columns to the ten stage statuses, in order: Intake, Discovery, Discovery approved, Exploring, Shortlist agreed, Anchors ready, Designing, Design signed off, Prototyping and testing, Handed over.
4. Add the swimlanes: Full route, Fast track and Blocked.
5. Add a Design status field to features, and roll the design item's status up to it.
6. Set the links: the feature is the parent of the design item; the design item is the predecessor of the engineering stories.
7. Add the hyperlinks on the design item: SharePoint brief, Figma file, prototype.
8. Create a Delivery Plan with the product, design and engineering boards.

## Done when

A test feature set to Ready for design gets a design item, moves across the columns, and shows its Design status on the feature.

## Used by

Every agent is started by a status on this board. {{agent:relay}} sets Handed over.

## Docs (external sites)

- [Azure Boards documentation, Microsoft Learn](https://learn.microsoft.com/en-us/azure/devops/boards/)
