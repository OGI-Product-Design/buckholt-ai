---
title: Repo and Buckholt
slug: repo-and-buckholt/
lead: Buckholt never changes. Agents create only in three folders, and everything they make outside Buckholt is flagged and registered.
---

## Repo zones

{{diagram:repo-zones}}

> Proposed layout: These folder names are the proposed layout for the prototyping repo. They are not all in place yet.

## Locks

`/buckholt` holds Buckholt core and `/legacy/[product]` holds captured legacy CSS. No agent writes to either. Changing them needs the owner's approval.

Every agent that touches code is told so in its rules: {{agent:archive}} never edits them, {{agent:build}} never writes to them.

## Extensions

When Buckholt has no component for what a design needs, it becomes an extension.

- In code, {{agent:build}} first reuses an existing register entry. If there is none, it builds the component in `/extensions/[product]/`.
- In Figma, {{agent:extend}} builds it on the Extensions page with an `x/` prefix.

Every code extension follows the same rules:

- Buckholt tokens only (CSS custom properties). No hard-coded colours, spacing, radii or fonts.
- Class prefix `x-` and the attribute `data-buckholt="false"`.
- One entry per component in the extensions register, with both halves: Figma and code.

{{agent:align}} checks that extension components are flagged and register entries have both halves. {{agent:audit}} flags `x-` components with no register entry. {{agent:archive}} flags register entries missing a half in its weekly check.

```html "An extension, flagged"
<div class="x-example" data-buckholt="false">
  ...
</div>
```

## Sandbox

{{agent:range}} works only in `/sandbox/[product]/[feature]/`. Explorations are clickable greybox HTML using `greybox.css` only, with an "Exploration, not for build" banner on every page. They never use Buckholt, brand colours or tokens.

Nothing in the sandbox is ever promoted. {{agent:build}} never imports from it, and {{agent:audit}} does not check it.

## Styling modes

Each product pack records the product's styling mode. {{agent:build}} follows it:

| Mode | What Build uses |
|---|---|
| Buckholt | Buckholt HTML and CSS |
| Legacy | The product's legacy CSS |
| Hybrid | What the pack says, with every Buckholt element labelled |

{{agent:align}} checks for styling-mode mismatches, such as Buckholt parts in a legacy screen.

## Rules files

- `/agents` holds one file per agent: its job, triggers, steps, limits and when it is done. Laurence writes them.
- `/.cursor/rules` holds the rules every agent follows.

Both change only by pull request. Each agent page on this site shows its rules file.

## Tests

`/tests` holds the Playwright and axe checks. {{agent:audit}} runs them on every new or changed prototype.
