# Originators — changes to feed back into the spec and Figma

Written 29 September 2026 from building the prototype in this folder. Three
sections: changes to `originators-spec.md`, changes to the Figma frames, and
tickets for the Buckholt design system rather than for this feature.

Every item says what the prototype does now, so the spec can be brought in line with
something already working rather than with a proposal.

> ## Status after revision 2 of the spec — 30 September 2026
>
> `originators-spec.md` revision 2 lands the design review and **supersedes several
> items below**. They are marked **RESOLVED** in place and were not built.
>
> | Item | Outcome |
> | --- | --- |
> | A1 Row count | **In the spec.** OR-00's Table bullet now carries it, and OR-04 / OR-05 hide it with the table. |
> | A2 Change warning covers the account holder | **RESOLVED \u2014 withdrawn.** There is no change warning. Edit originator carries an intro line with the product count instead. |
> | A3 Both warnings can appear at once | **RESOLVED \u2014 withdrawn.** No modal in this feature shows a warning alert. |
> | A4 Icon-only buttons carry tooltips | **In the spec.** OR-00's card footer description now states both tooltips and the Buckholt requirement. |
> | A5 Blocked delete no longer swaps icons | **RESOLVED \u2014 withdrawn.** There is no blocked delete: the default card has no bin and every other bin is always active. The keyboard-focus decision it asked for falls away with it. |
> | A6 "Up to four cards sit in a row" | **In the spec.** OR-01's Layout section now says three is the maximum at 1920px and gives the reason. |
> | B3 Blocked delete frames | **RESOLVED \u2014 withdrawn**, with A5. |
> | B4 Change warning bodies | **RESOLVED \u2014 withdrawn**, with A2 and A3. |
> | B1, B2, B5 | **Still open.** Frame changes, unaffected by revision 2. |
> | Section C | **Unaffected**, except C4, which is withdrawn with A5, and two new tickets, C9 and C10, added by the sticky table header. |
>
> Everything revision 2 asked for is built: explicit assignment, no warning alerts,
> the sticky action bar and table header, clickable rows, always-active delete that
> moves products to the default, and toasts without a close control.

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

> **RESOLVED — withdrawn by spec revision 2, 30 September 2026.** All warning alerts are gone from the modals. Edit originator now opens with the
> intro line "Changes to this originator apply to the **{count}** products that use
> it." Kept below for the record; do not implement.

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

> **RESOLVED — withdrawn by spec revision 2, 30 September 2026.** There are no warnings left to stack. Kept below for the record; do not
> implement.

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

> **RESOLVED — withdrawn by spec revision 2, 30 September 2026.** There is no blocked delete. The default originator has no bin at all, and every
> other bin is red and always active; confirming moves that originator’s products
> to the default. The keyboard-focus decision this item asked for is moot.
> Kept below for the record; do not implement.

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

*Reason:* the shape changing under the pointer read badly. Agreed 29 September 2026.

**And a decision is needed on keyboard focus.** The bin now uses Buckholt's
documented disabled state — the native `disabled` attribute — which is what the
design system asks for. A natively disabled control cannot take keyboard focus and
receives no pointer events, so the tooltip has to sit on a wrapper, and OR-10's
*"It appears on hover and on keyboard focus"* cannot be met as written: a keyboard
user gets the control's accessible name, which includes the reason, but not the
tooltip.

Either:

- the control stays natively disabled and OR-10 drops the keyboard-focus clause,
  relying on the accessible name to carry the reason; or
- the keyboard-focus clause stands and the control is enabled but inert, which is
  what the prototype did before and is not Buckholt's documented disabled state.

The prototype currently takes the first. Say which you want.

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

> **RESOLVED — withdrawn by spec revision 2, 30 September 2026.** Withdrawn with A5.

Replace the red prohibited icon with a grey bin and the "not allowed" cursor. The
tooltips are unchanged.

### B4. OR-03-04 and a new frame — change warning bodies

> **RESOLVED — withdrawn by spec revision 2, 30 September 2026.** Withdrawn with A2 and A3.

OR-03-04 draws only the bank-details body. Add frames or annotations for:

- account holder changed alone;
- account holder and bank details changed together;
- the change warning and the default change warning stacked.

### B5. App bar — "Accounts"

Drawn regular; the prototype uses semi-bold (600) at your request on 29 September
2026. Update the frame if the bolder weight is the intent.

---

### A7. Reassign originator subtitle — bold the count — **new**

The frames disagree with each other. OR-07-03 draws "You’re assigning a new
originator to **7** products." with the count bold; OR-06-03 and OR-09-03 draw theirs
in the regular weight. Confirmed by Laurence on 30 September 2026 that the bold one is
the intent, and the prototype now bolds it in every case. It is a `<strong>`, which
Buckholt sets to 500, the same treatment as the OR-03 intro line.

The action bar's selection text is the same treatment, confirmed at the same time:
"Select products to reassign", "{count} product(s) selected" and "All products
selected" are strong in full, not just the number. Add it to the OR-00 "Selection
text" table as a note.

Add to the OR-06 "Reassign originator modal" description:

> **Subtitle:** "You’re assigning a new originator to **{count}** product(s)." The
> count is bold. The all-products variant, "You’re reassigning all products.", has no
> count.

And update OR-06-03 and OR-09-03 to match OR-07-03.

### A8. What the sticky layers do at phone width — **needs a decision**

OR-00's "Sticky action bar and table header" does not say what happens below the
width where the table stops fitting. Two things collide there:

- `.table-content` has to be a horizontal scroller again (measured at 375px, the
  table's minimum is 347px in a 311px column), and a sticky `thead th` inside a
  scroller is positioned against *that* scrollport — it drops 340px down, below the
  first row. The header cannot stick while the scroller is back.
- The action bar stacks to five rows at that width, so pinning it alone would hold
  about 300px of a 760px phone viewport under the top bar.

The prototype keeps the **action bar** pinned at every width and takes only the table
header off below 576px. At 375px the pinned bar is 264px — tightened from 296px by
halving its vertical padding and using the Panel's 16px step between its two groups —
which with the 76px top bar is 340px of a 760px viewport. The bar stacks to four rows
there: two full-width inputs, the selection text, then the two actions, which
themselves stack below 414px.

**Ask:** confirm that the table header scrolling with the table at phone width is
acceptable — it cannot join the action bar until C9 is settled — and say whether the
action bar wants a more compact phone treatment. Making it shorter than four rows
needs a design decision, so nothing is invented here.

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

> **RESOLVED — withdrawn by spec revision 2, 30 September 2026.** Nothing in Originators needs this state any more. Worth keeping as a Buckholt
> question in its own right, but it is no longer blocking anything here.

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

### C6. The close control is 8px taller than the content row

`.toast` gives 8px of padding and `.toast-content` 4px on each side, leaving a 24px
content row. The default `.btn-close` is **32px**. Two consequences:

1. A toast built from the documented markup is **56px tall**. Every Originators frame
   draws **48px**, which is what the 24px `.btn-close-sm` produces.
2. The close control centres 4px below the first line of the message — the offset
   recorded in `css/buckholt-ai-fixes.css` corrections 3 and 4, which fixed the
   horizontal placement and left the vertical half open.

**The second is now corrected here**, by corrections 7 and 8, added 29 September 2026
with an entry in `discrepancies/known-issues.md` and an assertion in
`test/runtime-verification/`. The earlier audit had measured the wrong element:
against the **first line of the message** the icon and the body already agree, and it
is the close control that is low. Aligning the control alone, with an offset derived
from `--btn-close-height`, fixes every case including multi-line, and avoids both
failure modes that audit identified — `align-items: center` on the row (drops the
icon 36px when a note wraps) and `align-self: center` on the body (shifts the icon).

**Ask:** take corrections 7 and 8 upstream so the fix layer can drop them. They are
two lines each, and the offset is self-adjusting for `.btn-close` and
`.btn-close-sm`.

**Still open — the control's size.** Whether a Toast's close control should be 24px
is a design question the fix does not answer. The frames say yes: every one draws a
48px toast, and only the 24px control produces that. The prototype uses
`.btn-close-sm`, which Toast's Code & specs examples do not show.

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

### C9. `.table-content` is a scroll container, so a sticky table header cannot work

`.table-content` is `overflow-x: auto`. CSS makes `overflow-y` compute to `auto`
alongside it, so the element becomes a scroll container — and `position: sticky` on
`thead th` then binds to *that* scrollport instead of the page. A table header that
should stay under the app bar simply stops sticking.

OR-00's build notes anticipate this and say not to wrap the table in an overflow
container, so the prototype switches it off for this one table
(`.ori-table .table-content { overflow: visible }`) and hands it back below 576px,
where the three columns genuinely no longer fit.

**Ask:** decide what Table should do here. Either `.table-content` gains a documented
modifier that turns the scroller off for a sticky-header table, or Table documents a
sticky-header pattern in which `.table-content` is the vertical scroll container too
and the offsets are set against it.

### C10. `--table-header-background` is translucent, so a sticky header shows rows through it

`--table-header-background` is `--ui-overlay-03`, `rgba(26, 26, 26, 0.07)`. That is
fine for a header sitting on the page, and wrong for one that rows scroll underneath:
the rows show straight through. A background on `thead tr` does not fix it — the row's
background belongs to the table's background layer and does not travel with a sticky
cell.

The prototype paints the page surface behind the cell and layers Buckholt's own header
colour over it as a background image, so the rendered colour is unchanged:

```css
background-color: var(--ui-background-02);
background-image: linear-gradient(var(--table-header-background), var(--table-header-background));
```

**Ask:** give Table an opaque header token, or document this composition, for anyone
building a sticky header.

### C11. Table has no clickable-row state

OR-00 makes the whole row a click target. Buckholt's Table ships the hover background
(`.table tr:hover td` on `--table-hover-background`) and, with C3, anticipates a
selected row, but documents no *clickable* row — so the pointer affordance
(`cursor: pointer`) is the prototype's own.

**Ask:** document a clickable-row treatment, including whether the pointer changes.

## Already agreed and built, no action needed

Recorded here so nothing is chased twice.

- **OR-04-03's `"Th"`** is an illustrative Figma string, not a literal case. Matching
  is "contains the search text anywhere, ignoring case", so `"th"` does match 14
  seeded products. The prototype implements the stated rule; no spec change needed.
- **Blocked delete conditions.** *Superseded by spec revision 2, 30 September 2026:
  there is no blocked delete at all.* The default card has no bin; every other bin is
  red and always active, and confirming moves that originator's products to the
  default. Recorded here so the earlier agreement is not re-applied.
- **Toast has no close control.** Agreed 29 September 2026; the designs are being
  updated. The prototype's toast is now Code & specs example 7 exactly, and the
  `.btn-close-sm` it briefly used — not a documented combination on a Toast — is
  gone. This also removes the question of what size a Toast's close control should
  be, for this feature at least; the Buckholt ticket C6 stands for anyone who uses
  one.
- **Buttons in Button sets, and the native `disabled` attribute.** Both raised
  29 September 2026 and both now correct throughout: every `.btn` in the page and
  the modals sits in a `.button-set`, and every disabled control uses the native
  attribute. See PROTOTYPE.md 4 and 13.
- **Cards on the Bootstrap grid.** Raised 29 September 2026. The bespoke flex row is
  gone; cards sit in `.row > .col-12.col-md-6.col-xxl-4 > .card`. One consequence is
  worth a look — see PROTOTYPE.md 11: without the width floor the old row carried,
  the card footer wraps to two lines at some mid viewports.
