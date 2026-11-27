// Fails if anything outside agentic/ has changed compared with the base
// branch. The site must not touch Buckholt or any other part of the
// repository.
//
//   BASE_REF=origin/main node scripts/check-locked.mjs   (default origin/main)
//
// Checks committed changes since the merge base, plus staged, unstaged and
// untracked files.

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BASE = process.env.BASE_REF || 'origin/main';
const git = (...args) => execFileSync('git', args, { cwd: REPO, encoding: 'utf8' }).split('\n').filter(Boolean);

let changed = [];
try {
  const base = git('merge-base', BASE, 'HEAD')[0];
  changed = changed.concat(git('diff', '--name-only', base, 'HEAD'));
} catch {
  console.warn(`Could not find ${BASE}; checking uncommitted changes only.`);
}
changed = changed.concat(
  git('diff', '--name-only'),
  git('diff', '--name-only', '--cached'),
  git('ls-files', '--others', '--exclude-standard')
);

const outside = [...new Set(changed)].filter(f => !f.startsWith('agentic/'));
if (outside.length) {
  console.error(`Files outside agentic/ have changed. The site must not touch them:\n${outside.map(f => `  ${f}`).join('\n')}`);
  process.exit(1);
}
console.log('Nothing outside agentic/ has changed');
