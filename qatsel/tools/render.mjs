#!/usr/bin/env node
// QATSEL offline renderer: drives engine/render.html in headless Chromium (SwiftShader on
// machines without a GPU) and pipes raw RGBA frames into ffmpeg.
//
//   node tools/render.mjs --design 1 --w 1320 --h 2868 --still 3.0 --out ghost.png
//   node tools/render.mjs --design 2 --w 3440 --h 1440 --video --dur 12 --out illusion.mp4
//
// Flags: --duo  --loop 10  --fps 30  --start 0  --crf 18  --codec h264|hevc  --strips 4
//        --glitch <amount> --gseed <n>  (force a glitch state for stills)
//        --type 0  (render without typography)  --split  (duo: also write left/right halves)
//        --gpu (render on the local GPU)  --channel chrome (use installed Chrome)
//        --frame <n> (grain seed for stills)  --mode 0 (IV printed off)  --grain <scale> --ghold <frames>
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = createRequire('/opt/node22/lib/node_modules/')('playwright')); }

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i < 0 ? d : args[i + 1]; };
const flag = (k) => args.includes(`--${k}`);

const design = +opt('design', 1);
const W = +opt('w', 1320), H = +opt('h', 2868);
const loop = +opt('loop', 10);
const fps = +opt('fps', 30);
const out = opt('out');
const strips = +opt('strips', Math.max(1, Math.round((W * H) / 2.5e6)));
const duo = flag('duo');
const typeOp = opt('type', '1');
const modeQ = (opt('mode') != null ? `&mode=${opt('mode')}` : '') + (opt('grain') != null ? `&grain=${opt('grain')}` : '') + (opt('ghold') != null ? `&ghold=${opt('ghold')}` : '');
if (!out) { console.error('--out required'); process.exit(1); }
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });

const mime = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' };
let sink = null;
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/frame') {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', async () => {
      const buf = Buffer.concat(chunks);
      try { await sink(buf); res.end('ok'); } catch (e) { res.statusCode = 500; res.end(String(e)); }
    });
    return;
  }
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p)) { res.statusCode = 404; return res.end(); }
  res.setHeader('content-type', mime[path.extname(p)] || 'application/octet-stream');
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

function ffmpeg(argv) {
  const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...argv], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg exit ${c}`)))));
  const write = (buf) => new Promise((res, rej) => { ff.stdin.write(buf, (e) => (e ? rej(e) : res())); });
  return { ff, done, write, end: () => ff.stdin.end() };
}
const rawIn = ['-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`];

// --gpu: use the machine's GPU (fast). Default is SwiftShader so it also runs on GPU-less servers.
const gpuArgs = flag('gpu') ? ['--ignore-gpu-blocklist', '--enable-gpu'] :
  ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-gpu-watchdog',
   '--disable-features=GpuWatchdog', '--gpu-watchdog-timeout-seconds=600'];
const browser = await chromium.launch({
  headless: true,
  channel: opt('channel'),
  args: [...gpuArgs, '--js-flags=--max-old-space-size=8192'],
});
const page = await browser.newPage();
page.on('console', (m) => { if (m.type() === 'error') console.error('[page]', m.text()); });
page.setDefaultTimeout(0);
const url = `http://127.0.0.1:${port}/engine/render.html?design=${design}&w=${W}&h=${H}&loop=${loop}&strips=${strips}&type=${typeOp}${duo ? '&duo=1' : ''}${modeQ}`;
await page.goto(url);
await page.waitForFunction(() => window.READY || window.ERR, null, { timeout: 0 });
const err = await page.evaluate(() => window.ERR);
if (err) { console.error(err.slice(0, 4000)); process.exit(1); }

const t0 = Date.now();
if (!flag('video')) {
  const t = +opt('still', loop * 0.25);
  const g = opt('glitch'), gs = opt('gseed');
  const enc = ffmpeg([...rawIn, '-i', '-', '-frames:v', '1', '-pix_fmt', 'rgb24', path.resolve(out)]);
  sink = enc.write;
  const fr = +opt('frame', 1);
  const r = await page.evaluate(([t, fr, g, gs]) => window.renderFrame(t, fr, g, gs), [t, fr, g == null ? null : +g, gs == null ? null : +gs]);
  enc.end(); await enc.done;
  console.log(`still ${out} ${W}x${H} t=${t} render=${r.render.toFixed(0)}ms total=${Date.now() - t0}ms`);
  if (duo && flag('split')) {
    const base = out.replace(/\.png$/, '');
    for (const [side, x] of [['L', 0], ['R', W / 2]]) {
      await new Promise((res, rej) => spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', out, '-vf', `crop=${W / 2}:${H}:${x}:0`, `${base}-${side}.png`]).on('close', (c) => (c ? rej(c) : res())));
    }
  }
} else {
  const start = +opt('start', 0);
  const dur = +opt('dur', loop);
  const n = Math.round(dur * fps);
  const codec = opt('codec', 'h264');
  const crf = opt('crf', codec === 'hevc' ? '20' : '18');
  const venc = codec === 'hevc'
    ? ['-c:v', 'libx265', '-preset', 'medium', '-crf', crf, '-pix_fmt', 'yuv420p10le', '-tag:v', 'hvc1', '-x265-params', 'log-level=error:aq-mode=3:psy-rd=2.0:psy-rdoq=1.0']
    : ['-c:v', 'libx264', '-preset', 'slow', '-crf', crf, '-pix_fmt', 'yuv420p', '-tune', 'grain', '-profile:v', 'high'];
  const extra = (opt('vf') ? ['-vf', opt('vf')] : []);
  const enc = ffmpeg([...rawIn, '-r', String(fps), '-i', '-', ...extra, ...venc, '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-movflags', '+faststart', path.resolve(out)]);
  sink = enc.write;
  let acc = 0;
  for (let i = 0; i < n; i++) {
    const t = start + i / fps;
    const frame = Math.round(((t % loop) + loop) % loop * fps);
    const r = await page.evaluate(([t, f]) => window.renderFrame(t, f), [t, frame]);
    acc += r.render;
    if (i % 30 === 0 || i === n - 1) {
      const el = (Date.now() - t0) / 1000;
      process.stdout.write(`\r${path.basename(out)} ${i + 1}/${n}  avg render ${(acc / (i + 1)).toFixed(0)}ms  elapsed ${el.toFixed(0)}s  eta ${((el / (i + 1)) * (n - i - 1)).toFixed(0)}s   `);
    }
  }
  enc.end(); await enc.done;
  console.log(`\nvideo ${out} ${W}x${H} ${n} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}
await browser.close();
server.close();
