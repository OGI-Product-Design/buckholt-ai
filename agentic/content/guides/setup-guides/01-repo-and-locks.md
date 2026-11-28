---
title: Repo and locks
lead: Agents can only be trusted with the repo if the folders they must never change are locked.
---

## Who does it

Laurence or Jon, with a GitHub organisation admin.

## What you need

- Admin access to the Buckholt prototyping repo
- Buckholt core and any captured legacy CSS, ready to move into their folders

## Steps

1. Create the folders: `/buckholt`, `/legacy`, `/extensions`, `/sandbox`, `/prototypes`, `/context`, `/agents`, `/.cursor/rules` and `/tests`. The [repo zones](/repo-and-buckholt/) explain what each one is for.
2. Move Buckholt core into `/buckholt` and any captured legacy CSS into `/legacy/[product]`.
3. Add a `CODEOWNERS` file so changes to the locked folders need their owners' review.
4. Turn on branch protection for `main`: require pull requests and code owner review.
5. Add a check that fails any pull request that changes `/buckholt` or `/legacy` without owner approval.
6. Add the shared rules to `/.cursor/rules`, and one rules file per agent to `/agents`.

```text "CODEOWNERS"
/buckholt/   [Buckholt owners team]
/legacy/     [Buckholt owners team]
/agents/     [workflow owners]
/.cursor/    [workflow owners]
```

## Done when

A pull request that touches `/buckholt` cannot be merged without an owner's approval, and every agent has its rules file.

## Used by

Every agent. {{agent:build}}, {{agent:extend}} and {{agent:range}} rely on the locks most.

## Docs (external sites)

- [About code owners, GitHub Docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [About protected branches, GitHub Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
