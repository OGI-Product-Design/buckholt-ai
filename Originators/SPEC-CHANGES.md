# Originators — changes to feed back into the spec and Figma

Written 29 September 2026 from building the prototype in this folder. Three
sections: changes to `originators-spec.md`, changes to the Figma frames, and
tickets for the Buckholt design system rather than for this feature.

Every item says what the prototype does now, so the spec can be brought in line with
something already working rather than with a proposal.

---

## A. Changes to `originators-spec.md`

### A1. Row count below the Product assignments table — **new, not in the spec**

Add to the OR-00-01 "Product assignments" section, after the Table bullet:

> **Row count:** below the table, left-aligned with the table, a count of the rows
> currently shown, e.g. "Showing 1-34 of 34". All rows show on one page, so the
> range always starts at 1 and both numbers are the number of rows shown. It
> follows the search and the Originator filter together — "Showing 1-9 of 9" for
> the search "Krypton - Open Market Motor", "Showing 1-2 of 2" with the filter set
> to Real Insure LTD. There are no pagination controls.

Add to the OR-04 "No results state" rules and the OR-05 "No products assigned state"
rules:

> The row count is hidden along with the table and its header row.

### A2. OR-03 change warning now covers the account holder — **replaces existing text**

The "Bank details warning" section becomes:

> ### Change warning
>
> A warning alert appears between the Make default toggle and the buttons when the
> account holder, the sort code or the account number is changed. It tells the user
> how many products the change affects before they confirm.
>
> - **Style:** amber background, darker amber left edge and a warning triangle icon.
> - **Title:** "This change will affect 32 products". The number is the originator's
>   current product count; with one product it reads "1 product".
> - **Body:** depends on what has changed.
>
> | Changed | Body |
> | --- | --- |
> | Account holder only | These products will show the new account holder name. Check the name before confirming. |
> | Sort code and/or account number only | Future collections for these products will go to the new account. Check the sort code and account number before confirming. |
> | Account holder and bank details | Future collections for these products will go to the new account, and they will show the new account holder name. Check the details before confirming. |
>
> - **Layout:** the modal grows downwards to fit the alert.
>
> The alert shows only when one of those three fields differs from the saved value
> and the originator has at least one product. The body updates live as fields
> change. It disappears if all three are changed back. Changes to User No. or
> Bureau No. alone never show it.

And in the OR-03 Rules, replace *"Changing the sort code or account number of an
originator with products shows the bank details warning before confirming"* with:

> Changing the account holder, the sort code or the account number of an originator
> with products shows the change warning before confirming.

Keep *"Editing bank details does not change product assignments"* and add:

> Renaming an originator does not change product assignments either.

### A3. Both warnings can appear at once — **new**

Add to OR-11 "Default change warning":

> An edit can raise the change warning (OR-03) and the default change warning at the
> same time — renaming the current default and switching Make default off, for
> instance. Both alerts show, stacked, in this order: Make default toggle, Choose new
> default, default change warning, change warning, buttons.

### A4. Icon-only buttons carry tooltips — **new**

Add to the OR-00-01 "Originator cards" footer description:

> Both icon buttons carry a tooltip: "Edit originator" and "Delete originator". This
> is a design-system requirement — Buckholt's Button guidance requires a tooltip on
> every icon-only Button as well as an accessible name.

### A5. Blocked delete no longer swaps icons — **replaces existing text**

The OR-10 "Blocked delete" section becomes:

> - **Icon:** at rest a blocked bin is grey, showing it is unavailable; an available
>   bin is blue, like the edit icon. A blocked bin keeps its bin shape on hover and
>   keyboard focus, shows no hover background, and the pointer becomes the browser's
>   "not allowed" cursor.
> - **Tooltip:** a small tooltip above the icon explains what the user must do first.
>   It appears on hover and on keyboard focus.

And in the steps table, OR-10-02 and OR-10-03 responses become:

> The bin stays grey, the pointer shows the "not allowed" cursor, and a tooltip
> reads "…". Clicking does nothing.

*Reason:* the shape changing under the pointer read badly, and the native cursor
already says "you cannot do this" without moving anything. Agreed 29 September 2026.

### A6. "Up to four cards sit in a row" — **needs a decision**

OR-01 "Layout" says up to four cards sit in a row. Measured on OR-00-01, the drawn
card is 506px wide in a 1557px content area, so four cards plus three 32px gaps need
2120px. Four per row is not reachable at 1920px at that card width.

Either the card is narrower than drawn, or the limit is three at 1920px and four only
at a wider viewport. The prototype implements one to three exactly as drawn and wraps
a fourth to a second row.

---

## B. Changes to the Figma frames

### B1. Row count — every frame showing the table

Only the re-uploaded OR-00-01 draws it. Add it to every other frame that shows the
Product assignments table, with the count matching that frame's state:

| Frame | Count |
| --- | --- |
| OR-01-01 to OR-01-04, OR-02-01, OR-03-01, OR-03-05, OR-04-01, OR-05-01, OR-06-01, OR-07-01, OR-08-01, OR-10-01 to OR-10-07, OR-11-01 to OR-11-06 | Showing 1-34 of 34 |
| OR-04-02 | Showing 1-9 of 9 |
| OR-05-04 | Showing 1-2 of 2 |
| OR-06-02, OR-06-05, OR-06-06, OR-07-02, OR-07-05, OR-07-06, OR-08-02, OR-08-05, OR-08-06, OR-09-01 to OR-09-06 | Showing 1-34 of 34 |
| OR-04-03, OR-05-05 | none — hidden with the table |

Styling as drawn on OR-00-01: 12px, regular, `--text-primary`, left edge on the
table's, about 24px below the table's last row border.

> Worth confirming: the count is drawn in primary text colour, not grey. If grey was
> intended, say so and it is a one-line change.

### B2. Card tooltips — OR-00-01 and every frame showing a card

Show the "Edit originator" and "Delete originator" tooltips, not only the
blocked-delete ones on OR-10-02 and OR-10-03.

### B3. Blocked delete — OR-10-02 and OR-10-03

Replace the red prohibited icon with a grey bin and the "not allowed" cursor. The
tooltips are unchanged.

### B4. OR-03-04 and a new frame — change warning bodies

OR-03-04 draws only the bank-details body. Add frames or annotations for:

- account holder changed alone;
- account holder and bank details changed together;
- the change warning and the default change warning stacked.

### B5. App bar — "Accounts"

Drawn regular; the prototype uses semi-bold (600) at your request on 29 September
2026. Update the frame if the bolder weight is the intent.

---

## C. Tickets for the Buckholt design system

These are not Originators changes. Each one is a gap the prototype hit and worked
around; each workaround is scoped to `Originators/originators.css` and commented.

### C1. Page navigation has no underline active state

Buckholt's documented Page navigation active state is a light blue pill
(`--nav-link-background-active`). The BACS tab bar is drawn with an underline, which
is `.nav-underline` — a real Buckholt class, but documented on **Tabs**, not Page
navigation. The prototype combines Page navigation markup with the Tabs underline
modifier, which nothing documents.

**Ask:** does Page navigation have an underline variant? If so, document it. If not,
the frames should use the pill.

### C2. `.card-footer` is undocumented, and incomplete in the runtime

Card's Code & specs page does not cover `.card-footer`, though the runtime ships it
with its own tokens (`--card-cap-padding-y/x`, `--card-cap-background`) and a
companion rule (`.card:has(.card-footer) .card-body`).

It also has **no bottom corner radii**, and `.card` is `overflow: visible`, so the
footer's square corners bleed past the card's 16px radius anywhere it is used.
Bootstrap's own base ships that radius rule and this build dropped it.

**Ask:** document `.card-footer`, and add
`border-bottom-left-radius: calc(var(--card-radius) - var(--card-border-width))` and
the matching right — the expression `.card-header-tabs .nav-link.active` already uses.

### C3. Table has no documented selected-row state

`.table` declares `--table-background-state` and consumes it in
`box-shadow: inset 0 0 0 9999px var(--table-background-state, …)`, but no shipped
class ever sets it. The runtime clearly anticipates a row state that the
documentation does not describe.

**Ask:** document a selected-row treatment and the class that sets that variable.
The prototype binds it to `--action-04`, which is the `#E8EDFA` the frames draw.

### C4. No "available but blocked, with an explanation" control state

Buckholt documents disabled. It does not document a control that stays hoverable,
focusable and tooltip-bearing while doing nothing — which is what a blocked delete
needs, since `disabled` would suppress the tooltip that explains the block.

**Ask:** document this state, including whether `cursor: not-allowed` is the
intended affordance. It is currently doing work no Buckholt token covers.

### C5. Icon catalogue has no bank icon

`foundations/iconography/catalogue.md` has 111 icons and no bank or financial
institution icon. The originator cards and the BACS navigation item both need one;
the prototype uses `fa-regular fa-building-columns`.

**Ask:** add it to the catalogue with a documented role.

### C6. Toast's close control is taller than its content row

`.toast` gives 8px of padding and `.toast-content` 4px on each side, leaving a 24px
content row. The default `.btn-close` is **32px**. Two consequences:

1. A toast built from the documented markup is **56px tall**. Every Originators frame
   draws **48px**, which is what the 24px `.btn-close-sm` produces.
2. `.toast-content` is a flex row with no `align-items`, so the 32px control stretches
   `.toast-body` while its own 24px line sits at the top — the message renders 4px
   above the icon and the close control. This is the offset already recorded as open
   in `css/buckholt-ai-fixes.css` correction 4, which fixed the close control's
   horizontal placement and left the vertical half.

The cause is the same for both, and it is not the missing `align-items`: it is that
the close control is 8px taller than everything else in the row.

**Ask:** make `.toast .btn-close` 24px, matching the content row and the frames, or
document `.btn-close-sm` as the Toast close control. Either removes the offset
without the `align-items` change that correction 4 rejected, which drops the icon
36px when a multi-line `.toast-note` is present.

**Alert has the same geometry** — `.alert-content` carries the same padding and no
`align-items` — and should be answered at the same time, though Alert is used inline
and its height is less constrained.

The prototype uses `.btn-close-sm`. Toast's Code & specs examples show the plain
`.btn-close`, so this is not a documented combination; the evidence that the frames
use it is the 48px height.

### C7. `--toast-max-width` is 22rem; every frame draws 20rem

`.toast` sets `width: var(--toast-max-width)` with `--toast-max-width: 22rem` (352px).
All six Originators frames that show a toast draw it **320px** wide, consistently and
regardless of message length.

**Ask:** confirm which is right. The prototype sets 20rem, scoped to its own toast
container.

### C8. Toast's success example uses the wrong icon

Toast's Code & specs page shows `fa-solid fa-circle-info` inside its `.toast-success`
example. Iconography maps Success-solid to `fa-solid fa-circle-check`, which is what
the frames draw and what the prototype uses.

**Ask:** correct the documented example. Low priority, but it will mislead anyone
copying that block.

---

## Already agreed and built, no action needed

Recorded here so nothing is chased twice.

- **OR-04-03's `"Th"`** is an illustrative Figma string, not a literal case. Matching
  is "contains the search text anywhere, ignoring case", so `"th"` does match 14
  seeded products. The prototype implements the stated rule; no spec change needed.
- **Blocked delete conditions.** The bin is blocked when the originator is the
  default **or** has products assigned, and resting when both are false. Confirmed
  29 September 2026; the prototype already did this.
