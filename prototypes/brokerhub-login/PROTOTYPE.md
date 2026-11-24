# brokerhub-login — BrokerHub login prototype

> **Not Buckholt.** Application work built *with* Buckholt. Nothing here is
> design-system guidance; see [`../README.md`](../README.md).

**Synthetic demo.** No request is made, nothing is stored, no email is sent,
and nothing reveals whether an account exists.

Built 24 Nov 2026 from [`prototype-build-spec.md`](prototype-build-spec.md)
(UX spec revision 8, 24 Nov 2026) and the eight frame exports in
[`screens/`](screens/).

## Sources and access

| Source | Status |
|---|---|
| Build spec | `prototype-build-spec.md`, committed here as supplied (still says "blocked on D13"; see below) |
| UX spec rev 8 | https://claude.ai/artifact/YKM6R7g3Lwgx3jcUo8uRYv: **not read** in this build. The decision below still needs recording there |
| Figma | BrokerHub Demo, section `10:639`. **Not opened live.** Only the PNG exports supplied on 24 Nov 2026 (UX spec rev 7) were read, so parity is with those snapshots, not with the current Figma file |
| Frames read (as PNG) | `10:640`, `11:854`, `10:1903`, `11:1094`, `12:1029`, `12:1196`, `12:1331`, `12:1433` |
| Buckholt | `AGENTS.md`, `CANONICAL-MARKUP.md`, `patterns/page-layout`, `patterns/forms`, components `alert`, `text-input`, `card`, `link`, `button`, `text-block`, `form`, `list`; `foundations/typography/type-sets.md`, `foundations/colour/palette.md`, `foundations/iconography/catalogue.md`; `css/buckholt.css` selectors |

## Decisions taken for this build

| Item | Decision |
|---|---|
| **D13** recovery link placement | **Option A**: Standalone link directly below the password field (frame `10:640`). Laurence, 24 Nov 2026, in the build session. Option B is not built. **Record this in the UX spec.** |
| Working branch | None. Built on the working tree; not committed (Laurence, 24 Nov 2026) |

## Open it

`index.html`. No build. It needs to be served over HTTP (any static server
from the repository root) so the relative `../../css/` paths resolve; opening
the file directly works in most browsers too. Proxima Soft and Font Awesome
load from Typekit and the Font Awesome kit, so they need network access.

Demo account (fictional, set in one place at the top of `brokerhub-login.js`):
`alex.morgan@brokerage.example` / `BrokerHub-demo-1`. Neither is shown on screen.

Refreshing returns to SCR-01 default; nothing persists.

## What was built

All four screens are in one page; `brokerhub-login.js` shows one at a time.
Every screen change reproduces page-load behaviour: the screen's `h1` takes
focus and the document title changes.

| SCR | States | Title |
|---|---|---|
| SCR-01 Sign in | Default; email missing; password missing; both missing; invalid email; unsuccessful | "Sign in to BrokerHub" (prefixed "Error: " on validation errors) |
| SCR-02 Forgotten password request | Default; missing email; invalid email | "Reset your password – BrokerHub" |
| SCR-03 Recovery confirmation | Single state; `{address}` is the submitted value, wording otherwise identical | "Check your email – BrokerHub" |
| SCR-04 Demo destination | Single state; restart clears all state | "You are signed in – BrokerHub demo" |

## Buckholt mapping

| Spec role | Built with | Source |
|---|---|---|
| Page shell | `.layout[data-layout=layout-03]`, `<header>`, `<main>` → `.page-body` → `.page-frame` → `.container` → `.page-pane` → `.page-panel` | `patterns/page-layout` |
| Card, Size=Medium | `.card > .card-body` (runtime: 32px padding, 24px gap, 16px radius, `#dadada` border) | `components/card` |
| Heading, Headline 02 | `.text-block > h1.headline-02` | `components/text-block`, type sets |
| Body copy | `<p>` in `.text-block` | `components/text-block` |
| Email field with hint | Text input example 2: `.input-label` holding `label.form-label` + `small.form-helper` | `components/text-input` |
| Password with View toggle | Text input example 5: `button.input-btn` after the input; icon `fa-regular fa-eye` / `fa-eye-slash` (View / View-off) | `components/text-input`, iconography catalogue |
| Field error | Text input example 7: `.invalid-feedback` after `.response`, shown by `.form-control.is-invalid`. Leading error icon in the field and before the message come from the runtime | `components/text-input`, `css/buckholt.css` |
| Links | `a.link-standalone` (no icon); inline `<a>` for "Reset it" and the summary entries | `components/link` |
| Primary action | `.button-set.button-set-stacked > button.btn.btn-primary.btn-lg > .button-label` | `components/button` |
| Error summary, sign-in failure | Alert "Alert status" error variant with `.alert-icon`, `.alert-message > h6`, plus "Alert note" | `components/alert` |
| Demo notices | Alert info variant with icon, message only | `components/alert` |

The Figma-only deviations in spec §2 (D18) are handled: Proxima Soft not
Nunito; Alerts carry their icon; field values are real values; the password
label is a real `<label>`.

## Deviations and judgement calls

1. **`<form class="card-body">`.** The documented Card body is a `<div>`. The
   sign-in and reset cards use a `<form>` element carrying `.card-body` so the
   Card's own 24px item gap spaces the fields, as the Figma frames do. The
   Buckholt Form component (`.form-body`, 32px gap, `.form-actions`) was not
   used because it would change the reviewed spacing. Classes are unchanged.
2. **Card width.** Buckholt's runtime Card has no width. Figma's
   Size=Medium is 384px, so `brokerhub-login.css` sets `max-width: 24rem` on
   the card as page layout. It shrinks below that on narrow screens.
3. **Button set "Top margin=True".** No Buckholt class for it. The runtime
   gap between the link and the button is 32px; the frame shows about 36px.
   Not adjusted.
4. **Error summary list.** Entries are inline links in a `ul.list-unstyled`
   inside `.alert-note`. Buckholt's List component draws bullets, which the
   frames do not show; the Alert documents no list markup. Gap reported.
5. **Alert heading level.** The documented Alert message is `<h6>`, so the
   error Alerts put an `h6` before the screen's `h1`. Kept to preserve the
   canonical markup; a heading-order checker may flag it.
6. **`role="alert"` on the demo notices.** Documented on every Alert, so kept.
   A screen reader may announce "Demo only" or "Demo destination" when those
   screens appear, as well as the focused heading.
7. **Unsuccessful attempt title.** The "Error: " title prefix is specified for
   validation errors only, so it is not added for the unsuccessful attempt.
8. **Email format check.** `something@domain.tld`, no spaces. `type="email"`
   inputs trim surrounding spaces in the browser; comparison with the demo
   account also ignores case (Q5 assumption).

## Assets not in the repository (spec §11)

| Asset | In the prototype |
|---|---|
| ogi portal logo (Portal header) | Labelled dashed placeholder: "[Placeholder: ogi portal logo, asset not in repository]", accessible name "ogi portal" |
| Portal background artwork (arcs) | Omitted. Only the base colour is used, from the Buckholt palette (`--primary-100`, `#04133b`) |
| Portal header pattern / existing Log in pattern | No such pattern in `patterns/`. Header is a plain `<header>` in `layout-03` |

## Checks run, 24 Nov 2026

Served from the repository root over HTTP and driven in the Claude desktop
browser (Chromium) at 1920 × 1080 and 375 × 812.

| Scenario (spec §10) | Result |
|---|---|
| (1) Submit empty | Pass. Error Alert with two linked entries, both fields `is-invalid` + `aria-invalid`, hint and error in `aria-describedby`, focus on the Alert, title "Error: Sign in to BrokerHub". Summary link moves focus to its field |
| (2) `alex.morgan@brokerage` | Pass. Format message in field and summary; values kept |
| (3) Valid address, wrong password | Pass. "We could not sign you in" Alert, no field invalid, email kept, password cleared and re-masked, focus on the Alert |
| (4) Demo account, then restart | Pass. Mixed case and surrounding spaces accepted; SCR-04 with focus on heading; restart clears fields, Alerts and confirmation address |
| (5) Recovery: Reset it, empty, invalid, valid, both SCR-03 routes | Pass. SCR-03 wording identical for a registered and an unregistered address; "Try a different email address" returns an empty field; the SCR-03 "Back to sign in" button and the SCR-02 "Back to sign in" link both return to an empty SCR-01 |
| (6) Keyboard only | Partial. Tab order on SCR-01 is email, password, show password, link, Sign in (option A). Enter submits; Tab into the error Alert and Enter on an entry focuses the field. Buckholt focus ring (2px `#1748d0`) shown on the button. **Not tested with a screen reader** |
| Show password | Pass. Type, accessible name and `aria-pressed` change |
| Visual vs frames | Close at 1920 × 1080: card 384px wide, labels 20/28 `#454545`, link `#1748d0` 16/24, heading 28/36, Proxima Soft. Card sits 6px higher and is 18px taller than `10:640` |
| 375px wide | Card 311px with 32px margins; no horizontal scroll (layout unreviewed, spec §9) |
| Console | No errors |
| Contrast, email hint | `.form-helper` renders 12px at `rgba(26,26,26,0.624)` on white, about 4.9:1. Passes AA for text; it is small (D18) |

**Not run:** an automated accessibility scan (axe could not be loaded in this
session), screen reader testing, the repository's Node suites (no Node on this
machine, and none covers this prototype), and a live Figma comparison.

## Drift to feed back

- The frames set "Sign in to BrokerHub" heavier than "Reset your password",
  "Check your email" and "You are signed in". The build uses Headline 02
  (Semibold 600) for all four, as spec §2 says.
- The error-summary entries in `10:1903` are not underlined; in `12:1196`
  they are. The build uses Buckholt inline links (underlined) on both.
- Q3, Q5, Q9, Q11, Q12, Q13 remain open as listed in the spec.
