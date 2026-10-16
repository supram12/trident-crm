#!/usr/bin/env node
// Render brand/trident_logo_lockup.svg, unmodified, on a flat wine band for emails (opaque, so it reads the same on light and dark mail clients).
// Output is 2x the 160x150 display size set in packages/twenty-emails/src/components/Logo.tsx.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url)); // not .pathname: it %20-encodes spaces in the path
const puppeteer = createRequire(join(ROOT, '../package.json'))('puppeteer');
const svg = readFileSync(join(ROOT, 'brand/trident_logo_lockup.svg'), 'utf8');
const [W, H] = [320, 300];
// The lockup's art sits in x 209..821, y 216..786 of its 1024 square; scale and centre that box with 24px padding.
const s = (W - 48) / 612;
const left = (W - 612 * s) / 2 - 209 * s;
const top = (H - 570 * s) / 2 - 216.1 * s;

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: W, height: H });
await page.setContent(`<body style="margin:0;width:${W}px;height:${H}px;background:#1C0B12;position:relative;overflow:hidden">
  ${svg.replace('<svg', `<svg style="position:absolute;left:${left}px;top:${top}px;width:${1024 * s}px;height:${1024 * s}px"`)}</body>`);
await page.screenshot({ path: join(ROOT, 'packages/twenty-front/public/images/trident/email-logo.png'), clip: { x: 0, y: 0, width: W, height: H } });
await browser.close();
console.log('email logo rendered');
