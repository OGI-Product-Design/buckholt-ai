# Core vs Mobius: side by side

A self-contained export of the Core vs Mobius NFR evidence dashboard (snapshot 13 to 17 November 2026).

## Run it
- Open `index.html` in any modern browser, or host the folder on any static web server (SharePoint, Azure Static Web Apps, an internal web server).
- No internet connection or build step is needed: d3 is bundled and all data is in `data.js`.

## Files
- `index.html`: the page, styles and drawing code
- `d3.min.js`: charting library (d3 v7, ISC licence)
- `data.js`: every dataset the page uses, as one script
- `data/`: the same datasets as CSV files, for reference and audit

## Updating figures
Edit the CSV in `data/`, then regenerate `data.js` (each file becomes `window.DATA["<file name>"]` as an array of row objects), or edit `data.js` directly.

## Notes
- Mobius on-screen figures use the LogRocket segment "Known live Mobius customers (UI users)": ten live tenants from the Mobius wiki register.
- Sources are named at the foot of every section.
