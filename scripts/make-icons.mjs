#!/usr/bin/env node
// Render brand/trident_mark.svg onto a wine square at every icon size Twenty ships.
// Uses the workspace's Puppeteer (Trident-AI.Dev/node_modules) — no new dependency.
import { readdirSync, readFileSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url)); // not .pathname: it %20-encodes spaces in the path
const puppeteer = createRequire(join(ROOT, '../package.json'))('puppeteer');
const DIRS = ['android', 'ios', 'windows11'].map((d) => join(ROOT, 'packages/twenty-front/public/images/icons', d));
const svg = readFileSync(join(ROOT, 'brand/trident_mark.svg'), 'utf8');
const pngSize = (buf) => [buf.readUInt32BE(16), buf.readUInt32BE(20)]; // IHDR width, height

const browser = await puppeteer.launch();
const page = await browser.newPage();
let count = 0;
for (const dir of DIRS) {
  for (const name of readdirSync(dir).filter((n) => n.endsWith('.png'))) {
    const file = join(dir, name);
    const [w, h] = pngSize(readFileSync(file));
    const box = Math.round(Math.min(w, h) * 0.72); // 72% of the short side: wide tiles must not clip the mark
    await page.setViewport({ width: w, height: h });
    await page.setContent(`<body style="margin:0;width:${w}px;height:${h}px;background:#1C0B12;
      display:grid;place-items:center"><div style="width:${box}px;height:${box}px">
      ${svg.replace('<svg', '<svg style="width:100%;height:100%"')}</div></body>`);
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: w, height: h } });
    count++;
  }
}
await browser.close();
copyFileSync(join(DIRS[0], 'android-launchericon-192-192.png'), join(ROOT, 'brand/icon-192.png'));
console.log(`icons rendered: ${count}`);
