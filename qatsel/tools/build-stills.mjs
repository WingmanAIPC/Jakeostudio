#!/usr/bin/env node
// Renders every static wallpaper: 4 designs × every device (+ IV Nocturne bonus).
// PNG masters go to a temp folder, then become sRGB-tagged 4:4:4 JPEG (q95) in exports/stills.
//   node tools/build-stills.mjs [--only iphone-18-pro-max] [--design 2] [--tmp /path]
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEVICES, DESIGNS } from './devices.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i < 0 ? d : args[i + 1]; };
const only = opt('only');
const onlyDesign = opt('design');
const tmp = opt('tmp', fs.mkdtempSync(path.join(os.tmpdir(), 'qatsel-')));
const T = 2.0; // calm moment in the loop

const jobs = [];
for (const dev of DEVICES) {
  if (only && dev.id !== only) continue;
  for (const d of DESIGNS) {
    if (onlyDesign && String(d.n) !== onlyDesign) continue;
    jobs.push({ dev, d, mode: null, slug: d.slug });
    if (d.n === 4 && !dev.duo) jobs.push({ dev, d, mode: 0, slug: 'IV-SAVED-NOCTURNE' });
  }
}

const toJpeg = (src, dst) => {
  const py = `
import sys
from PIL import Image, ImageCms
im = Image.open(sys.argv[1]).convert('RGB')
icc = ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes()
im.save(sys.argv[2], quality=95, subsampling=0, optimize=True, icc_profile=icc)
`;
  const r = spawnSync('python3', ['-c', py, src, dst], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`jpeg failed ${dst}`);
};

let k = 0;
for (const j of jobs) {
  k++;
  const { dev, d } = j;
  const outDir = path.join(root, 'exports', 'stills', dev.id);
  fs.mkdirSync(outDir, { recursive: true });
  const base = `QATSEL_${j.slug}_${dev.id}`;
  const png = path.join(tmp, `${base}.png`);
  const argv = [path.join(here, 'render.mjs'), '--design', String(d.n), '--w', String(dev.w), '--h', String(dev.h), '--still', String(T), '--out', png];
  if (dev.duo) argv.push('--duo');
  if (args.includes('--gpu')) argv.push('--gpu');
  if (j.mode != null) argv.push('--mode', String(j.mode));
  const t0 = Date.now();
  const r = spawnSync('node', argv, { stdio: ['ignore', 'ignore', 'inherit'] });
  if (r.status !== 0) { console.error(`FAILED ${base}`); continue; }
  if (dev.duo) {
    const hw = dev.w / 2;
    for (const [side, x] of [['L', 0], ['R', hw]]) {
      const half = path.join(tmp, `${base}-${side}.png`);
      spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', png, '-vf', `crop=${hw}:${dev.h}:${x}:0`, half]);
      toJpeg(half, path.join(outDir, `${base}-${side}_${hw}x${dev.h}.jpg`));
    }
    toJpeg(png, path.join(outDir, `${base}-PREVIEW_${dev.w}x${dev.h}.jpg`));
  } else {
    toJpeg(png, path.join(outDir, `${base}_${dev.w}x${dev.h}.jpg`));
  }
  console.log(`[${k}/${jobs.length}] ${base} ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}
console.log(`PNG masters kept in ${tmp}`);
