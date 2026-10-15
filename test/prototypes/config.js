/* Shared settings for the prototype suites.

   Everything environment-specific lives here, so the suites themselves hold
   only assertions.

     BASE_URL   where the mirror is served      default http://127.0.0.1:8098
     CHROMIUM   the Chromium binary             default: Playwright's own

   Both can be overridden:

     BASE_URL=http://localhost:3000 node test/prototypes/flows.js
*/
const path = require('path');

function resolvePlaywright() {
  /* Playwright may be a dependency of the repo, installed globally, or
     supplied by the environment. Try each before giving up with something
     that says what to do. */
  const candidates = [
    'playwright',
    '/opt/node-tools/node_modules/playwright',
    path.join(process.env.HOME || '', '.npm-global/lib/node_modules/playwright')
  ];
  for (const c of candidates) {
    try { return require(c); } catch (e) { /* try the next */ }
  }
  throw new Error(
    'Playwright not found. Install it with `npm i -D playwright`, or set ' +
    'NODE_PATH to a copy you already have.'
  );
}

const { chromium } = resolvePlaywright();

const BASE = (process.env.BASE_URL || 'http://127.0.0.1:8098').replace(/\/$/, '');

function launch() {
  const opts = {};
  if (process.env.CHROMIUM) opts.executablePath = process.env.CHROMIUM;
  else if (process.env.PLAYWRIGHT_BROWSERS_PATH) {
    opts.executablePath = path.join(process.env.PLAYWRIGHT_BROWSERS_PATH, 'chromium');
  }
  return chromium.launch(opts);
}

/* Animations and smooth scrolling make measurements race. Buckholt sets
   `scroll-behavior: smooth`, so a `window.scrollTo` reading taken without
   this is mid-animation. */
const STILL = '*{transition:none!important;animation:none!important}' +
              'html{scroll-behavior:auto!important}';

function counter() {
  const state = { pass: 0, fail: 0 };
  return {
    state,
    is(label, got, want) {
      if (String(got) === String(want)) state.pass += 1;
      else { state.fail += 1; console.log(`FAIL ${label}: got [${got}] want [${want}]`); }
    },
    ok(label, cond) {
      if (cond) state.pass += 1;
      else { state.fail += 1; console.log(`FAIL ${label}`); }
    },
    done() {
      console.log(`\n${state.pass} pass, ${state.fail} fail`);
      process.exit(state.fail ? 1 : 0);
    }
  };
}

module.exports = { chromium, launch, BASE, STILL, counter };
