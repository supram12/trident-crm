#!/usr/bin/env node
// Trident CRM rebrand. `check` exits 1 on any user-visible "Twenty";
// `apply` rewrites catalog msgstr text. Idempotent; re-run after every
// upstream merge and inside the Docker build (after lingui extract).
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url)); // not .pathname: it %20-encodes spaces in the path
const CATALOG_ROOTS = ['packages/twenty-front/src', 'packages/twenty-emails/src', 'packages/twenty-server/src'];

const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  if (n === 'node_modules' || n === 'generated') return [];
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const poFiles = () => CATALOG_ROOTS.map((r) => join(ROOT, r)).filter(existsSync)
  .flatMap(walk).filter((p) => p.endsWith('.po'));

// Rebrand only msgstr text (msgid is the lookup key and must not change).
// Continuation lines ("...") belong to whichever field came last.
export const rebrandPo = (src) => {
  let field = null;
  return src.split('\n').map((line) => {
    if (line.startsWith('msgid')) field = 'id';
    else if (line.startsWith('msgstr')) field = 'str';
    else if (!line.startsWith('"')) field = null;
    if (field !== 'str') return line;
    return line.replace(/Twenty CRM/g, 'Trident CRM').replace(/\bTwenty\b/g, 'Trident CRM');
  }).join('\n');
};

const CHECKS = [
  ['catalog msgstr says Twenty', () => poFiles().flatMap((p) => {
    const src = readFileSync(p, 'utf8');
    return src === rebrandPo(src) ? [] : [p.replace(ROOT, '')];
  })],
];

const mode = process.argv[2];
if (mode === 'apply') {
  for (const p of poFiles()) {
    const src = readFileSync(p, 'utf8');
    const out = rebrandPo(src);
    if (out !== src) writeFileSync(p, out);
  }
  console.log('brand: catalogs rebranded');
} else if (mode === 'check') {
  let failed = false;
  for (const [label, run] of CHECKS) {
    const hits = run();
    console.log(`${hits.length ? '✗' : '✓'} ${label}`);
    hits.slice(0, 5).forEach((h) => console.log(`    ${h}`));
    failed ||= hits.length > 0;
  }
  process.exit(failed ? 1 : 0);
} else {
  console.error('usage: node scripts/brand.mjs check|apply');
  process.exit(2);
}
