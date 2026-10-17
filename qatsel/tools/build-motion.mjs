#!/usr/bin/env node
// Renders the animated deliverables.
//   Live Photos (3 s, 30 fps, key frame first, glitch at 1.0 s): iPhone 18 Pro Max / Pro, duo pairs, iPad
//   Seamless loops (10 s, 24 fps, H.264): Galaxy Z Fold 8 main + cover, ultrawide, MacBook Pro 16"
//   node tools/build-motion.mjs [--only live|loops] [--design 1] [--device ultrawide] [--tmp DIR]
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
const onlyDevice = opt('device');
const tmp = opt('tmp', fs.mkdtempSync(path.join(os.tmpdir(), 'qatsel-motion-')));
const LOOP = 10, GLITCH_AT = 0.42;
const LIVE_START = GLITCH_AT * LOOP - 1.0, LIVE_DUR = 3.0;
const dev = (id) => DEVICES.find((d) => d.id === id);

function run(cmd, argv) {
  const r = spawnSync(cmd, argv, { stdio: ['ignore', 'inherit', 'inherit'] });
  if (r.status !== 0) throw new Error(`${cmd} ${argv.join(' ')} failed`);
}
const gpu = args.includes('--gpu') ? ['--gpu'] : [];
const render = (extra) => run('node', [path.join(here, 'render.mjs'), '--loop', String(LOOP), ...gpu, ...extra]);
const live = (extra) => run('python3', [path.join(here, 'livephoto.py'), ...extra]);
const designs = DESIGNS.filter((d) => !onlyDesign || String(d.n) === onlyDesign);
// resumable: finished outputs are skipped; renders land under a temporary name and are renamed when complete
const done = (f) => fs.existsSync(f);
const renderTo = (out, extra) => {
  const part = out.replace(/(\.\w+)$/, '.part$1');
  render([...extra, '--out', part]);
  fs.renameSync(part, out);
};
const want = (id) => !onlyDevice || onlyDevice === id;

if (only !== 'loops') {
  for (const d of designs) {
    // single phone master → Pro Max (native) and Pro (same aspect, downscaled)
    const sources = [
      { src: dev('iphone-18-pro-max'), duo: false, targets: [['iphone-18-pro-max', null, null], ['iphone-18-pro', null, '1206x2622']] },
      { src: dev('iphone-duo-pro-max'), duo: true, targets: [
        ['iphone-duo-pro-max', 'L', null], ['iphone-duo-pro-max', 'R', null],
        ['iphone-duo-pro', 'L', '1206x2622'], ['iphone-duo-pro', 'R', '1206x2622']] },
      { src: dev('ipad-pro'), duo: false, targets: [['ipad-pro', null, null]] },
    ];
    for (const s of sources) {
      if (!s.targets.some(([id]) => want(id))) continue;
      const base = `${d.slug}_${s.src.id}`;
      const name = (id, side) => `QATSEL_${d.slug}_${id}${side ? '-' + side : ''}`;
      const movOf = (id, side) => path.join(root, 'exports', 'live-photos', id, `${name(id, side)}.MOV`);
      if (s.targets.every(([id, side]) => !want(id) || done(movOf(id, side)))) { console.log(`live ${base} already done`); continue; }
      const clip = path.join(tmp, `${base}_live.mp4`);
      const key = path.join(tmp, `${base}_key.png`);
      const common = ['--design', String(d.n), '--w', String(s.src.w), '--h', String(s.src.h), '--grain', '0.8', ...(s.duo ? ['--duo'] : [])];
      const t0 = Date.now();
      if (!done(key)) renderTo(key, [...common, '--still', String(LIVE_START), '--frame', String(Math.round(LIVE_START * 30))]);
      if (!done(clip)) renderTo(clip, [...common, '--video', '--start', String(LIVE_START), '--dur', String(LIVE_DUR), '--fps', '30', '--crf', '12']);
      for (const [id, side, size] of s.targets) {
        if (!want(id) || done(movOf(id, side))) continue;
        const out = path.join(root, 'exports', 'live-photos', id);
        const hw = s.src.w / 2;
        const crop = side ? `${hw}:${s.src.h}:${side === 'L' ? 0 : hw}:0` : null;
        live(['--video', clip, '--still', key, '--out', out, '--name', name(id, side),
              ...(crop ? ['--crop', crop] : []), ...(size ? ['--size', size] : [])]);
      }
      console.log(`live ${base} done in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
  }
}

if (only !== 'live') {
  const loopDevices = DEVICES.filter((x) => x.loop && want(x.id));
  for (const x of loopDevices) {
    for (const d of designs) {
      const out = path.join(root, 'exports', 'loops', x.id, `QATSEL_${d.slug}_${x.id}_${x.w}x${x.h}_10s-loop.mp4`);
      if (done(out)) continue;
      const t0 = Date.now();
      renderTo(out, ['--design', String(d.n), '--w', String(x.w), '--h', String(x.h), '--video', '--dur', String(LOOP), '--fps', '24',
                     '--crf', '23', '--grain', '0.5', '--ghold', '2']);
      console.log(`loop ${path.basename(out)} done in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
  }
}
