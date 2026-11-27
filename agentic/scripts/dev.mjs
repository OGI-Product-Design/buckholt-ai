// Local preview with live reload. No dependencies.
//
//   npm run dev:site            then open http://localhost:8080
//   PORT=3000 npm run dev:site
//
// Rebuilds when anything in agentic/ (except site/) changes, then tells open
// pages to reload. The reload script is added only to responses from this
// server; it is never written into site/.

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(SITE, 'site');
const PORT = Number(process.env.PORT) || 8080;
// SERVE_ONLY=1: serve the build as it is, without rebuilding or live reload
// (used by the tests).
const SERVE_ONLY = process.env.SERVE_ONLY === '1';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json'
};
const RELOAD = '<script>new EventSource("/__reload").onmessage=()=>location.reload();</script>';
const clients = new Set();

function safeBuild() {
  try {
    // A fresh process each time, so changes to the build scripts apply too.
    execFileSync(process.execPath, [path.join(SITE, 'scripts/build.mjs')], { stdio: 'inherit' });
    for (const res of clients) res.write('data: reload\n\n');
  } catch (err) {
    console.error('Build failed; fix the error above and save again.');
  }
}

let timer;
if (!SERVE_ONLY) {
safeBuild();
fs.watch(SITE, { recursive: true }, (event, file) => {
  if (!file || file.startsWith('site') || file.startsWith('node_modules') || file.startsWith('test-results') || file === 'index.html') return;
  clearTimeout(timer);
  timer = setTimeout(safeBuild, 100);
});
// The Buckholt stylesheets are copied into the build, so watch them too.
fs.watch(path.resolve(SITE, '..', 'css'), () => {
  clearTimeout(timer);
  timer = setTimeout(safeBuild, 100);
});
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/__reload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  let file = path.join(DIST, decodeURIComponent(url.pathname));
  if (!file.startsWith(DIST)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  let status = 200;
  if (!fs.existsSync(file)) { file = path.join(DIST, '404.html'); status = 404; }
  const type = TYPES[path.extname(file)] || 'application/octet-stream';
  let body = fs.readFileSync(file);
  if (type.startsWith('text/html') && !SERVE_ONLY) body = body.toString().replace('</body>', `${RELOAD}</body>`);
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}).listen(PORT, () => console.log(`Agentic UX site: http://localhost:${PORT}`));
