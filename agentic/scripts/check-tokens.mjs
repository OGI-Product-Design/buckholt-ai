// Fails if agentic/css/extensions.css contains a hard-coded colour.
// Colours must come from Buckholt tokens: var(--...).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../css/extensions.css');
const NAMED = ['black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'grey', 'gray', 'silver', 'navy', 'teal', 'maroon', 'olive', 'lime', 'aqua', 'fuchsia', 'cyan', 'magenta', 'brown', 'gold', 'indigo', 'violet'];
const PATTERNS = [
  [/#[0-9a-f]{3,8}\b/i, 'hex colour'],
  [/\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\s*\(/i, 'colour function'],
  [new RegExp(`:\\s*[^;{}]*\\b(${NAMED.join('|')})\\b`, 'i'), 'named colour']
];

const source = fs.readFileSync(FILE, 'utf8').replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
const problems = [];
source.split('\n').forEach((line, i) => {
  for (const [re, what] of PATTERNS) {
    const m = line.match(re);
    if (m) problems.push(`  line ${i + 1}: ${what} "${m[0].trim()}"`);
  }
});

if (problems.length) {
  console.error(`extensions.css has hard-coded colours; use Buckholt tokens instead:\n${problems.join('\n')}`);
  process.exit(1);
}
console.log('extensions.css: no hard-coded colours');
