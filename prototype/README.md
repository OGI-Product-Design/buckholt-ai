# Prototype shared layer

Everything in this folder is shared by the Mobius PAS prototypes in
`Originators/` and `BACS-import/`. It is **not** Buckholt, and nothing here
may be read as design-system guidance.

| File | What it is |
|---|---|
| `app-shell.css` | The static Mobius chrome: top bar, left navigation, and the toast stack's position. Reproduced by visually inspecting OR-00-01 and IM-00-01, then placed in Buckholt's own `layout-03` grid areas. Both specs record this chrome as static. |
| `app-shell.js` | `Shell` — the live clock, `showToast(message, variant)` (Buckholt Toast), tooltip init/dispose (Buckholt Tooltip), HTML escaping, and `wireChrome()`, which makes the chrome links and the current tab inert. |
| `blade.css`, `blade.js` | `Blade` — a right-edge panel with a scrim, a focus trap, Esc to close and focus return. Buckholt has no blade; `bacs-import-spec.md` section 13.1 defines one and asks for it as a reusable component. Built on the Bootstrap 5.1.3 Offcanvas plugin the app already loads, with its own CSS from Buckholt tokens, because `css/buckholt.css` ships no `.offcanvas` rule. |

**The chrome markup itself lives in each page's own HTML, not here.** It is
static application furniture, so it belongs in the page: it is there to read
in the source, it is there with the JavaScript off, and nothing structural
depends on a script having run. Only its styling and behaviour are shared.
Copy the `<header class="app-bar">` and `<aside id="sidebar" class="app-sidenav">`
blocks from `Originators/index.html` into a new page.

**The top bar is sticky** (`top: 0`, `z-index: 1030`), so it stays in view while the
page scrolls and a feature can position its own sticky layer under it. Its height is
published as `--app-header-height` on `:root`, as a fallback of `4.75rem`; a feature
that depends on the exact value should re-measure the element with a `ResizeObserver`
and set the variable itself, as `Originators/originators.js` does. 1030 keeps the bar
above a page's sticky layers and below Bootstrap's modal backdrop (1050), the modal
(1055), the blade (1056) and the toast stack.

## Using the shell

```html
<link rel="stylesheet" href="../css/buckholt.css">
<link rel="stylesheet" href="../css/buckholt-ai-fixes.css">
<link rel="stylesheet" href="../prototype/app-shell.css">
<link rel="stylesheet" href="my-feature.css">
...
<header class="app-bar"></header>
<aside id="sidebar" class="app-sidenav"></aside>
...
<div class="toast-container app-toasts"></div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="../prototype/app-shell.js"></script>
```

```js
Shell.wireChrome();                                        // chrome links and the current tab do nothing
Shell.startClock();                                        // ticks on the minute
Shell.showToast('File submitted for import', 'success');   // info | success | warning | error
Shell.initTooltips(root);                                  // after rendering markup with data-bs-toggle="tooltip"
Shell.disposeTooltips(root);                               // before replacing it
```

The BACS section tabs are Buckholt Page navigation and are written into each
page's HTML too, with `.active` on the current page and real links to the
others:

```html
<ul class="nav nav-underline">
  <li class="nav-item"><a class="nav-link" href="#/process">Process</a></li>
  <li class="nav-item"><a class="nav-link active" href="#/import" aria-current="page">Import</a></li>
  <li class="nav-item"><a class="nav-link" href="../Originators/index.html">Originators</a></li>
  <li class="nav-item"><a class="nav-link" href="#/calendar">Calendar</a></li>
</ul>
```

## Using the blade

```js
var blade = new Blade({
  id: 'reason-codes-blade',
  title: 'Reason codes',
  body: '<p>…</p>',
  initialFocus: '#rc-search',      // defaults to the first input, else the close button
  width: '25rem',                  // defaults to 400px, full width below 576px
  footer: null,                    // optional slot
  onOpen: fn,
  onClose: fn
});

blade.open(triggerElement);        // focus returns here on close
blade.setBody(html);
blade.close();
```

Changing anything here changes both features. The measurements in
`app-shell.css` came from the Originators build and are unchanged.
