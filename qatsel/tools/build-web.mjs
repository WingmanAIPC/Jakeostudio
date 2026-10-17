#!/usr/bin/env node
// Assembles the real-time deliverables from engine/:
//   wallpaper-engine/QATSEL/  — Wallpaper Engine "web" project (import the folder)
//   lookbook/index.html       — single-file lookbook with the live engine inlined
//   [--artifact <path>]       — the same lookbook without the document skeleton (for publishing)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const eng = (f) => fs.readFileSync(path.join(root, 'engine', f), 'utf8');
const args = process.argv.slice(2);
const artifactOut = args.includes('--artifact') ? args[args.indexOf('--artifact') + 1] : null;

// ---------------------------------------------------------- Wallpaper Engine
const we = path.join(root, 'wallpaper-engine', 'QATSEL');
fs.mkdirSync(we, { recursive: true });
for (const f of ['index.html', 'qatsel.js', 'qatsel-fonts.js', 'live.js']) fs.copyFileSync(path.join(root, 'engine', f), path.join(we, f));
const project = {
  contentrating: 'Everyone',
  description: 'QATSEL — Quiet Ambient Techno Soul of Eternal Life. Four real-time designs rendered live on your GPU at native resolution: I GHOST, II ILLUSION, III WIELDER, IV SAVED (+ Nocturne). Click anywhere to break the illusion.',
  file: 'index.html',
  general: {
    properties: {
      schemecolor: { order: 0, text: 'ui_browse_properties_scheme_color', type: 'color', value: '0.098 0.165 0.600' },
      design: {
        order: 1, text: 'Design', type: 'combo', value: '1',
        options: [
          { label: 'I — GHOST', value: '1' },
          { label: 'II — ILLUSION', value: '2' },
          { label: 'III — WIELDER', value: '3' },
          { label: 'IV — SAVED', value: '4' },
          { label: 'IV — SAVED (Nocturne)', value: '5' },
        ],
      },
      glitchinterval: { order: 2, text: 'Glitch every (seconds, 0 = off)', type: 'slider', value: 14, min: 0, max: 120, fraction: false },
      glitchintensity: { order: 3, text: 'Glitch intensity', type: 'slider', value: 100, min: 0, max: 100, fraction: false },
      speed: { order: 4, text: 'Motion speed (%)', type: 'slider', value: 100, min: 25, max: 200, fraction: false },
      typography: { order: 5, text: 'Typography', type: 'bool', value: true },
      audioreactive: { order: 6, text: 'Audio-reactive light', type: 'bool', value: false },
      renderscale: { order: 7, text: 'Render scale (%) — lower for lighter GPU load', type: 'slider', value: 100, min: 40, max: 100, fraction: false },
    },
    supportsaudioprocessing: true,
  },
  preview: 'preview.jpg',
  tags: ['Abstract', 'Sci-Fi'],
  title: 'QATSEL — Quiet Ambient Techno Soul of Eternal Life',
  type: 'web',
  version: 1,
  visibility: 'private',
};
fs.writeFileSync(path.join(we, 'project.json'), JSON.stringify(project, null, 2) + '\n');
console.log('wallpaper-engine/QATSEL ready');

// ------------------------------------------------------------------ lookbook
const tpl = fs.readFileSync(path.join(root, 'lookbook', 'template.html'), 'utf8');
const inline = (s) => s.replace(/<\/script/gi, '<\\/script');
const body = tpl
  .replace('<!--QATSEL_FONTS-->', `<script>${inline(eng('qatsel-fonts.js'))}</script>`)
  .replace('<!--QATSEL_ENGINE-->', `<script>${inline(eng('qatsel.js'))}</script>`)
  .replace('<!--QATSEL_LIVE-->', `<script>${inline(eng('live.js'))}</script>`);
const full = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
fs.writeFileSync(path.join(root, 'lookbook', 'index.html'), full);
if (artifactOut) fs.writeFileSync(artifactOut, body);
console.log(`lookbook ${(Buffer.byteLength(full) / 1024).toFixed(0)} KB`);
