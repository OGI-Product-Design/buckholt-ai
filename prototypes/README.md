# Prototypes — NOT Buckholt

> **Nothing in this folder is design-system guidance.**
>
> Everything here is Mobius PAS application work built *with* Buckholt. It
> may be cited as an example of how to use the design system. It may **never**
> be cited as evidence of what the design system is, and nothing here should
> be promoted into `components/`, `foundations/` or `patterns/`.
>
> The source of truth is the rest of the repository. Start at
> [`../AGENTS.md`](../AGENTS.md).

## The prototypes

Each is a clickable, no-build prototype: open its `index.html` directly in a
browser. Everything is relative and nothing is compiled.

They are also deployed: `wrangler.jsonc` serves the repository root, so every
folder here is a URL too — `/prototypes/Mobius-navigation/`,
`/prototypes/BACS-calendar/` and so on. **The URLs changed when this folder
was created on 15 October 2026**, so `_redirects` in the repository root
sends every old link to its new home with a 301. Links shared before the
move still work; tested against a local Workers runtime.

There are **two deployments**, and they behave differently:

| | Serves | Redirects for the old URLs |
| --- | --- | --- |
| **GitHub Pages** | the three BACS prototypes, and the repository verbatim | `404.html` at the repository root, because Pages has no redirect mechanism |
| **Cloudflare** (`wrangler.jsonc`) | Mobius navigation | `_redirects`, which only Cloudflare reads |

`.assetsignore` narrows the **Cloudflare** deployment to what a prototype
needs. It does nothing on GitHub Pages, and it is not a privacy control —
this repository is public. If a prototype starts needing another file from
outside `prototypes/`, allow it there or it will 404 on Cloudflare while
working perfectly locally.

[`../PROTOTYPES.md`](../PROTOTYPES.md) has the live links.

| Folder | Feature | Built from |
| --- | --- | --- |
| `Originators/` | Accounts › BACS › Originators | `originators-spec.md` + `screenshots/` |
| `BACS-import/` | Accounts › BACS › Import | `bacs-import-spec.md` + `screenshots/` |
| `BACS-calendar/` | Accounts › BACS › Calendar | `calendar-spec.md` + `screenshots/` |
| `Mobius-navigation/` | Mobius navigation shell | `README.md` in that folder |
| `CH-SHELL/` | Configuration Hub shell: header, environment, avatar menu, breadcrumb band, app-card home | `ch-shell-spec.md` + `screenshots/` |
| `CH-USERS/` | Configuration Hub › User Management › Configuration Hub users (reuses `CH-SHELL/shell/` and `shared/blade`) | `ch-users-spec.md` + `screenshots/` |

The first three are tabs of one application and link to each other. Process
is still a placeholder inside `BACS-import/`.

`CH-SHELL/` is a different product (Configuration Hub, not Mobius PAS) and
its chrome is not the one in `shared/`. Every CH feature prototype loads the
shell from `CH-SHELL/shell/` rather than copying it; `CH-SHELL/PROTOTYPE.md`,
"How the shell is shared", says how.

Every folder carries a **`PROTOTYPE.md`** recording what was built and every
deviation from its spec, and most carry a **`SPEC-CHANGES.md`** feeding
findings back to the spec, the Figma frames and Buckholt itself. Read those
before changing a prototype — they explain why things are as they are.

## Shared

Everything used by more than one prototype lives in `shared/`:

| Path | What it is |
| --- | --- |
| `shared/app-shell.*`, `shared/blade.*` | The Mobius application chrome — top bar, left navigation, toast stack — and the Blade. Not Buckholt: both specs record the chrome as static, and Buckholt has no blade. See `shared/README.md`. |
| `shared/calendar/` | A month calendar **component**: grid, day cells, month picker. Not the same thing as the `BACS-calendar/` prototype, which is the page that uses it. Buckholt covers none of it, which is why it is here and not in `components/`. See `shared/calendar/calendar.md`. |
| `shared/data/` | Seed data shared between features. `calendar.js` holds the collection-day rules so the Process tab can read them when it is built. |

Changing anything under `shared/`, `shared/calendar/` or `shared/data/` changes more than
one feature. `test/regression.js` exists to catch that.

## Before you change one

1. Read [`../AGENTS.md`](../AGENTS.md) — the rules apply here too. A
   prototype reaches for a documented Buckholt component before it writes
   any CSS of its own.
2. Read that prototype's `PROTOTYPE.md`.
3. Run the suites afterwards: see [`../test/README.md`](../test/README.md).

## Why a component can live here and not in `components/`

`components/` is the Buckholt catalogue, and every folder in it is verified
against a saved Code & specs page by
`test/source-parity.py`, in both directions. A component
Buckholt has never documented cannot be verified that way, so filing it
there would present an invention as canonical.

`shared/calendar/` is the worked example: its spec asked for a new component
folder, Buckholt documents no calendar, so it sits here with its own
`calendar.md` explaining what it draws and — just as importantly — what it
does not, because the chevrons, the month buttons and the links inside it
are all Buckholt.
