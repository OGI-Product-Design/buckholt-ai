# Mobius PAS — client search → client summary

A Product Design exploration, built with the Buckholt design system in this repository.

**Open `mobius/index.html` in a browser.** It is a working prototype: search, refine,
select a record, compare, then open the client. Nothing outside this folder was changed.

> The prototype loads the Font Awesome **Pro** kit documented in `CLAUDE.md`. Buckholt's markup
> uses `fa-regular` throughout and the regular face is a Pro style, so on a Free kit the icons
> render as empty `.notdef` boxes. That is the known dependency recorded in
> `discrepancies/known-issues.md`, not a fault in this page.

---

## Problem

A broker takes a call and searches for "John Smith". Fourteen records come back.

The current screens answer *"which records match the name?"*. The broker's actual question is
*"which of these is the person on the phone, and what do they hold?"* — and the two questions have
almost no overlap, because the columns the results table shows are the columns that cannot
discriminate. Six of these records share a name, a date of birth **and** a postcode. Reading them
across a table is reading the same row six times.

So the broker expands a row, reads the policies, collapses it, expands the next, and holds the
comparison in their head. Everything that actually separates one record from another — the products,
the vehicle registration, whether cover is live — sits behind that expand step. Then choosing a
client throws away the list, so a wrong guess costs a full round trip.

Three costs, in order of size:

1. **Identification is done on the wrong evidence.** Identity fields collide; holdings do not.
2. **Comparison is serial and lossy.** Only one candidate is legible at a time.
3. **Commitment is expensive.** Opening a client discards the search.

## Design hypothesis

> If the policy a client holds is what identifies the record, then the policy belongs in the
> scannable row — not behind an expand step. And if identity fields collide, the interface should
> say what *differs*, rather than repeating what is the same.

Two consequences follow. Records that share an identity should be presented as one person holding
several records, because that is what they are. And selection should be cheap and reversible, so the
broker can move between two plausible candidates without paying for the mistake.

## Key decisions

**1. Group by identity signature, not by row.**
Records are grouped where name + date of birth + postcode all agree. "14 matching records" becomes
"14 matching records across 8 people". The group heading leads with `Born 01/02/1980`, because the
date of birth is what separates one John Smith from another — the shared name is demoted to an
eyebrow. Groups are a scanning aid only; every record inside stays directly selectable.

**2. Give every record a policy fingerprint.**
Each row carries `Open Market Commercial Vehicle · Tradesman Liability · DE346GTRE`, plus a status
tag and a `+1 more` count. That line is the single biggest change from the current product: a broker
who has been told "it's about the van" can now pick the right record from the list without opening
anything.

**3. Master/detail instead of expand-in-place.**
Selecting a record fills a persistent Card beside the list: identity, the actions, policies, contact.
The list never moves, so comparing two candidates is two clicks and no lost context. Selection is a
native `<button>` with `aria-pressed`, plus arrow-key movement, because a broker comparing
near-identical records moves up and down the list far more than they tab through it. The actions sit
directly under the identity rather than at the foot of the card: the pane is pinned, so anything
below the fold of a long policy list would be out of reach.

**4. Name the ambiguity instead of hiding it.**
When a group holds more than one record, the detail pane shows an Info alert: *"6 records share this
name, date of birth and postcode — they differ by products held, number of policies, email,
telephone."* The differing fields are computed, not written. If nothing separates them, it says so
and tells the broker to confirm with the client. That is a more honest answer than a longer table.

**5. Anchor the client summary on holdings.**
The summary opens with identity, three numbers (live policies, annual premium, open claims) and then
**Policies** as the default tab. Needs attention, Relationships and Admin are one click away. Admin
detail is real, but it is not what the broker came for.

**6. Keep the identity pinned, and keep the way back.**
Opening a client pins a context strip — name, date of birth, reference — with *Back to results*. The
search is still there when the broker returns.

**7. Duplicates are a data-quality task, not a search result.**
The "these records should probably be merged" warning lives on the client page, under Relationships,
where someone can act on it. On the search screen it would be noise at the exact moment the broker
is trying to concentrate.

## Buckholt components used

Layout is the documented Page-layout pattern end to end:
`main > .page-body > .page-frame > .container > .page-pane > .page-panel`, with Bootstrap
`.row`/`.col-*` owning horizontal structure and Buckholt owning hierarchy and rhythm.

| Component | Where |
| --- | --- |
| Page layout (pattern) | Both views; Panel 32px / Pane 64px / Frame 64px, verified in the runtime |
| Input rows (pattern) | The refine controls, `.row.input-row` with `col-12 col-sm-6` |
| Text input | Application-bar search (`.input-icon` + `.input-btn`), "Narrow by" with helper text |
| Select | "Holdings" filter |
| Text block / Heading attachment | Page heading with a Standalone Link; group headings with a Tag; section headings with a count Tag |
| Link | `.link-standalone` for *New client*, *Back to results*, and the stacked-view return |
| Versa-tile | Every result row and every policy, including the documented Progress-bar composition |
| Progress bar | `.progress.progress-sm` inside Versa-tile, showing term elapsed |
| Tag | Status tags (`success` / `info` / `warning`), record counts, `+N more` |
| Alert | Info (ambiguity) and Warning (duplicate records, with `.alert-contextbar`) |
| Card | The whole detail pane — Card supplies the surface, the 2rem padding and the 1.5rem body rhythm |
| Summary meta | Identity in the detail pane and at the head of the client page |
| Key-value pair | `.key-value-table` for contact and admin; `.grid.key-value-grid` for the three headline numbers |
| Icon block | `sm` in tiles, `xl` in the empty state, `xxl expressive-dark expressive-primary` in Summary meta |
| Button / Button set | *Open client*, *New quote*, *Review duplicates*; sets carry `.button-set-no-offset` |
| Menu button / Menu | *Client actions*, including `.menu-item-danger` and `.menu-divider` |
| Tabs | Policies / Needs attention / Relationships / Admin |
| Avatar | The signed-in user |
| Typography | `eyebrow`, `headline-02`, `title-02`, `body-02`, `support-01`, `label-01` |

Every class in the rendered page resolves to `buckholt.css`, `bootstrap.min.css`, Font Awesome, or
an `mx-` application class. That is asserted by a harness run, not by eye.

**Deliberately not used.** Table — it is the component the current screen uses, it is the only
`SOURCE PARTIAL` component in the repository, and a table is the wrong shape for records that must be
compared rather than read. Modal, Accordion and Lookup were considered and rejected: Modal and
Accordion re-introduce the serial comparison the design is trying to remove, and Lookup is for
known-value retrieval, which is the opposite of this task. Card is used for the detail pane but not
for result rows, where Versa-tile is the lighter, denser fit.

## Novel composition

Everything below uses documented components; the arrangements are new.

- **Grouped Versa-tiles under a Heading attachment.** Buckholt documents both; it does not document
  a grouped result set. The heading carries the identity, the tiles carry the records.
- **A status Tag set in `.versatile-actions`.** The documented content of that slot is a Button set.
  A tag set is composition beyond the source evidence, and it is flagged here rather than presented
  as documented Buckholt.
- **Versa-tile as a policy row with the Progress-bar variant carrying term elapsed.** The variant is
  documented; using progress to mean *how close this policy is to renewal* is this design's meaning.
- **`.key-value-stacked.key-value-flipped.key-value-lg` inside `.key-value-grid`** to make three
  headline numbers. The Key-value rules ask that `.key-value-stacked` not be added to grid items
  "unless that modifier is separately required" — here it is: the number must lead and the label
  must follow.

### Application-layer additions, declared

All in `styles.css`, all scoped to this screen, none of them recreating a Buckholt surface. The
detail pane deliberately has no custom surface at all — it is a Card.

1. **Selection state on a Versa-tile.** Buckholt documents a selected state for Card
   (`.card-selectable.active`) and Tag (`.tag-selectable.active`), but not for Versa-tile. The
   affordance is supplied here using Buckholt's own action colour and border-width tokens.
2. **Wrapping instead of truncating** for `.versatile-label` and `.versatile-text` inside result and
   policy tiles. Buckholt truncates both by default; a truncated client reference is exactly the
   thing the broker is trying to tell apart.
3. **`--columns` set from the stylesheet** rather than the inline `style` attribute the canonical
   example uses, so the key-value grid can drop to one column on a phone. Same documented knob, not
   an override — and the change `responsive/component-guidance.md` recommends for this variant.
4. **`scroll-padding-top` on `html`**, composed from spacing tokens, so in-page scrolling clears the
   sticky application bar.

Two more are not this design's inventions but this repository's own prescriptions, applied because
Buckholt is silent and `responsive/component-guidance.md` says what to do:

5. **`.progress { min-width: 22rem }` relaxed inside a policy tile below 768px.** Buckholt floors
   every progress bar at 352px, which no tile can hold once the workspace has stacked. The guidance's
   instruction is to relax it in a narrowly scoped application rule and never globally; that is
   exactly what is done, and the reduced precision is accepted.
6. **`overflow-wrap: anywhere` on `.key`, `.value`, `.summary-meta-body` and `.versatile-label`**
   within this screen's containers. Buckholt sets `break-word`, which wraps the text but does not
   reduce the element's min-content width — so a grid track still sizes to the longest token and
   pushes a 320px page sideways. This screen is made almost entirely of unbroken tokens, so it hits
   the case the guidance describes squarely.

`.button-set-no-offset` is worth naming separately: it exists in `buckholt.css` but not in
`components/button/rules.md`. It is used here because the alternative was an application-layer rule
reaching in to cancel a Buckholt component's margin, which is worse. It is a runtime-only modifier,
recorded as such.

### Reported gap

`foundations/iconography/catalogue.md` documents **no product-line icons** — nothing for commercial
vehicle, shop, tradesman liability or home. The foundation's own rule is to report the gap rather
than substitute a plausible Font Awesome icon, so no product-icon map was invented. The icon in a
result row therefore carries something the catalogue *does* support and the broker actually needs:
`fa-shield-check` live cover, `fa-shield` policies but none live, `fa-user` no policies held. The
product is named in the text beside it.

## What I deliberately changed

- **The results table is gone.** Records are grouped tiles, not rows in a grid of repeated columns.
- **Policies moved from behind an expand step into the scannable row.**
- **Address and postcode are shown once per person, not once per record.**
- **The heading leads with date of birth**, not the name every candidate shares.
- **Comparison happens beside the list**, not by expanding and collapsing in place.
- **Filters were re-aimed.** Rather than more identity fields, the refine controls narrow by
  *anything that discriminates* (a free-text field matching DOB, postcode, policy number or
  registration) and by *holdings* (has an active policy, renewal invited, incomplete, none).
- **The client summary is prioritised, not flattened.** Three numbers and one anchored list, with
  the rest behind Tabs, instead of several equal-weight panels.
- **Duplicate-record warnings moved** off search and onto the client page.
- **The date of birth is a heading, not a column.**

## What I deliberately retained

- **The reference format.** `SMI/J/01021980/0007` and `ZZ0004120` are shown verbatim; brokers read
  them aloud to clients and quote them to insurers.
- **Every identity field.** Nothing was dropped — date of birth, full address, postcode, telephone
  and email are all still reachable; they moved to where they are useful.
- **Records that hold no policy.** They still appear, still selectable, marked *No policies held*.
  Deduplicating them away would hide real data.
- **Named statuses.** Active, Renewal invited, Incomplete, Prospect, Lapsed keep their meanings.
- **Search-first entry.** The broker still starts by typing a name into a persistent search field.
- **The duplicate collision itself.** Six records share one identity in the sample data because that
  is what the reference screens show. The design has to survive it, not assume it away.

## Assumptions

1. **Reference format.** `SMI/J/01021980/0007` decodes as surname/initial/`ddmmyyyy`/sequence. The
   grouping rests on this; if it is wrong, the grouping key changes but the design does not.
2. **The call is usually about a policy.** Groups with live business sort first for that reason.
3. **A search returns tens of records, not thousands.** At larger scale the grouped list needs
   pagination or server-side grouping — the component choices would not change.
4. **`claims`, `connected` and `portal` exist** as fields on a client record. They are stubbed in
   `data.js`.
5. **Today is 08 September 2026**, matching the reference screens. Term progress and "renews in N
   days" are computed against it.
6. **A broker works at a desk.** Desktop is the primary target; 768 / 375 / 320 are supported and
   verified, but the master/detail workspace is designed for a wide screen.
7. **Data is fictional.** Names, addresses, policy numbers and registrations are invented for the
   prototype.

## Verified

Measured in Chromium against the real `buckholt.css`, not asserted:

- **No document-level horizontal overflow** at 1440 / 768 / 375 / 320, in all three states (results,
  results with a selection, client summary).
- **No page errors** in any state.
- **Every class** in the rendered DOM resolves to Buckholt, Bootstrap, Font Awesome or `mx-`.
- **Every icon** appears in `foundations/iconography/catalogue.md`.
- **Every control has an accessible name**; every `label[for]`, `aria-controls`, `aria-labelledby`
  and `aria-describedby` resolves to a real element; no duplicate IDs.
- **Spacing is the documented scale**: Panel 32px, Pane 64px, Frame 64px padding and gap; every
  application value a `--spacer-*` or `--padding-*` token, or a `calc()` of them.

## Files

```
index.html   page shell, runtime contract in the documented order, both views
styles.css   application layout only — every selector mx-prefixed, every value a token
app.js       prototype behaviour; emits canonical Buckholt markup, decides nothing about styling
data.js      14 fictional client records across 8 identity groups
```
