---
title: Toolset
slug: toolset/
lead: Discovery happens in Microsoft 365. Exploring, designing and prototyping happen in Cursor. Archive keeps the two in step.
---

## Two platforms and a bridge

{{diagram:toolset}}

## Microsoft 365 side

Discovery happens here: {{agent:brief}}, {{agent:insight}} and {{agent:map}} run in Copilot.

{{block:tools-m365}}

## Cursor side

Exploring, designing and prototyping happen here: the other nine agents run in Cursor.

{{block:tools-cursor}}

## The bridge

{{agent:archive}} keeps the two sides in step. It copies product packs into SharePoint after a change is merged, and pulls approved discovery into the repo as `/context/discovery/[feature].md`.

## Access needed

Foundations come first, then connectors and access, then the agents.

{{diagram:dependencies}}

| Access | Who needs it |
|---|---|
| Figma MCP, write | {{agent:extend}}. Needs a Full seat. |
| Figma read and Code Connect | {{agent:align}}, {{agent:build}}, {{agent:relay}} |
| Legacy Figma libraries | Anchor screens, {{agent:extend}}, {{agent:align}} |
| LogRocket MCP | {{agent:insight}}, {{agent:observe}}, {{agent:relay}} |
| Lucid MCP | {{agent:map}}, {{agent:range}} |
| Azure DevOps connector | {{agent:brief}}, to read features |

{{agent:archive}} tracks daily Figma MCP calls and warns the team at 80% of the limit.

The [set-up guides](/setup-guides/) take you through each one in order.
