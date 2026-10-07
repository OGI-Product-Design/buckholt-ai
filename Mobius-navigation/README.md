# Mobius navigation

A clickable rebuild of the Mobius two-level navigation redesign, using Buckholt's own
components, tokens and assets. Open `index.html` in a browser. Everything is relative
and nothing is built.

The source prototype is `reference/mobius-live-policy.html`, and the terminology log is
`reference/mobius-terminology-log.xlsx`. **The prototype is the source of truth for
structure, behaviour and wording. The repository is the source of truth for look and
feel.** None of the prototype's CSS, colours or fonts are used.

| File | What it is |
| --- | --- |
| `index.html` | The page: Buckholt runtime contract, the shared top bar, the menu column, Main, and the confirmation Modal. |
| `fixtures.js` | **All mock data in one file**: the client Reverend Motor API Automation, their 7 policies and every sample row. Swap this for real API responses. |
| `navigation-model.js` | What each level's menu and heading contain. A direct port of the prototype's `policyNav`, `policyActions`, `policyFlows`, `CLIENT_NAV`, `CONFIRMS` and `TITLES`. |
| `pages.js` | Every page, side panel and flow, built from Buckholt markup. |
| `mobius-navigation.js` | Routing, the menu, side panels, confirmations, the drawer and the events. |
| `mobius-navigation.css` | Prototype-only layout and bindings of Buckholt's own custom properties. |
| `PROTOTYPE.md` | Build notes: what is Buckholt, every deviation and gap, and how it was verified. |
| `reference/` | The source prototype and terminology log, unchanged. |

It reuses the shared prototype layer without changing it: `prototype/app-shell.css`
and `app-shell.js` (top bar, clock, toasts, tooltips) and `prototype/blade.*` (side
panels). Nothing outside this folder was changed.

## Routes

The prototype's hash routes, with the system modules added:

| Route | Level |
| --- | --- |
| `#dashboard` (default), `#search/{query}`, `#newclient` | App: Broking's Dashboard, search results and the Create new client flow. A bare `#search` goes to the Dashboard |
| `#activity`, `#renewals`, `#bordereau`, `#accounts` | App: the other system modules (placeholders) |
| `#c/{page}` | Client: `summary`, `business`, `ctx`, `cactivity`, `ccomplaints`, `checks`, `newquote` |
| `#p/{policy}/{page}` | Policy: `puco0068`, `puco0052`, `aad666` (Live), `y341` (Automatic Decline), `zz646` (Lapsed), `z315` (Incomplete), `zz2966` (Prospect) |

A page that a policy's status does not have redirects to that policy's overview.
