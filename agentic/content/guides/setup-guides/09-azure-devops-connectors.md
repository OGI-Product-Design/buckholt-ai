---
title: Azure DevOps connectors
lead: Agents read features and write to stories through Azure DevOps, so the work and the record stay in one place.
---

## Who does it

Laurence, with an Azure DevOps project administrator, then each person who runs {{agent:relay}}.

## What you need

- The design board set up
- Microsoft 365 Copilot, for {{agent:brief}}
- Cursor, for {{agent:relay}}

## Steps

1. Connect Azure DevOps to Microsoft 365 Copilot, so {{agent:brief}} can read features, stories and their fields.
2. Add the Azure DevOps MCP server to Cursor, so {{agent:relay}} can add UX sections and links to stories.
3. Limit {{agent:relay}}'s access: it may add to stories and set Design status, but never change engineering statuses or the PM's story text.
4. Check both: {{agent:brief}} reads a test feature; {{agent:relay}} adds a UX section to a test story.

## Done when

A test feature runs from Ready for design to Handed over, with {{agent:brief}} reading it and {{agent:relay}} writing the UX section.

## Used by

{{agent:brief}} and {{agent:relay}}.

## Docs (external sites)

- [Model Context Protocol (MCP), Cursor Docs](https://cursor.com/docs/mcp)
- [Azure DevOps documentation, Microsoft Learn](https://learn.microsoft.com/en-us/azure/devops/)
