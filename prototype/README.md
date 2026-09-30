# Prototype shared layer

Everything in this folder is shared by the Mobius PAS prototypes in
`Originators/` and `BACS-import/`. It is **not** Buckholt, and nothing here
may be read as design-system guidance.

| File | What it is |
|---|---|
| `app-shell.css` | The static Mobius chrome: top bar, left navigation, and the toast stack's position. Reproduced by visually inspecting OR-00-01 and IM-00-01, then placed in Buckholt's own `layout-03` grid areas. Both specs record this chrome as static. |
| `app-shell.js` | `Shell` — the chrome markup, the live clock, the BACS section tabs (Buckholt Page navigation), `showToast(message, variant)` (Buckholt Toast), tooltip init/dispose (Buckholt Tooltip) and HTML escaping. |
| `blade.css`, `blade.js` | `Blade` — a right-edge panel with a scrim, a focus trap, Esc to close and focus return. Buckholt has no blade; `bacs-import-spec.md` section 13.1 defines one and asks for it as a reusable component. Built on the Bootstrap 5.1.3 Offcanvas plugin the app already loads, with its own CSS from Buckholt tokens, because `css/buckholt.css` ships no `.offcanvas` rule. |

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
Shell.mountChrome({ sidebar: 'bacs', avatar: 'AC' });
container.innerHTML = Shell.bacsTabs('import', {
  process: '#/process',
  import: '#/import',
  originators: '../Originators/index.html',
  calendar: '#/calendar'
});
Shell.startClock();
Shell.showToast('File submitted for import', 'success');   // info | success | warning | error
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
