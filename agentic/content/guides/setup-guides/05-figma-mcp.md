---
title: Figma MCP
lead: Figma MCP lets agents read the designs, and lets one agent, Extend, build them out.
---

## Who does it

Each designer, on their own machine, once their Figma seat is in place.

## What you need

- Cursor installed
- A Figma Full seat for anyone running {{agent:extend}}, because it writes
- Read access to the product's Figma files and libraries for everyone else

## Steps

1. Add the Figma MCP server to Cursor.
2. Sign in to Figma when Cursor asks.
3. Check read access: ask Cursor to list the frames on a page you can see.
4. For {{agent:extend}} only: check write access on a test file.
5. Set up Code Connect, so {{agent:align}}, {{agent:build}} and {{agent:relay}} can map Figma components to code.

## Done when

Cursor can read a named Figma page, and the people running {{agent:extend}} can write to a test file.

## Used by

{{agent:extend}} writes. {{agent:align}}, {{agent:build}} and {{agent:relay}} only read. {{agent:archive}} tracks daily calls and warns at 80% of the limit.

## Docs (external sites)

- [Figma Help Center](https://help.figma.com/)
