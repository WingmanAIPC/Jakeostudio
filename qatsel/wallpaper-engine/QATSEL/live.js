/*
 * QATSEL live runtime — real-time playback for Wallpaper Engine (web), Plash on macOS,
 * Lively Wallpaper, or any browser.
 *
 * URL parameters (all optional):
 *   design   1 GHOST · 2 ILLUSION · 3 WIELDER · 4 SAVED · 5 SAVED (nocturne)
 *   glitch   seconds between glitches, 0 = never   (default 14)
 *   intensity glitch strength 0..1                 (default 1)
 *   type     0 hides the typography                 (default 1)
 *   scale    render scale 0.25..1 (GPU budget)      (default 1)
 *   duo      1 = two-panel pair layout
 */
(function (global) {
  'use strict';

  function parseDesign(v) {
    const n = Math.max(1, Math.min(5, parseInt(v, 10) || 1));
    return n === 5 ? { design: 4, mode: 0 } : { design: n, mode: null };
  }

  async function start(canvas, init = {}) {
    await QATSEL.loadFonts();
    const q = new URLSearchParams(location.search);
    const st = {
      ...parseDesign(init.design != null ? init.design : q.get('design')),
      glitch: init.glitch != null ? init.glitch : q.has('glitch') ? +q.get('glitch') : 14,
      intensity: init.intensity != null ? init.intensity : q.has('intensity') ? +q.get('intensity') : 1,
      type: init.type != null ? init.type : q.has('type') ? +q.get('type') : 1,
      scale: init.scale != null ? init.scale : q.has('scale') ? +q.get('scale') : 1,
      duo: init.duo != null ? init.duo : q.get('duo') === '1',
      speed: 1,
      audioOn: false,
      paused: false,
    };
    const eng = new QATSEL.Engine(canvas, {});
    let W = 0, H = 0, dirty = true;
    let t = 0, last = performance.now(), frame = 0;
    let nextGlitch = 3 + Math.random() * 4, gStart = -100, gSeed = 1;
    let audio = 0, audio_target = 0, drawn = false;

    function size() {
      const dpr = Math.min(global.devicePixelRatio || 1, 3);
      const r = canvas.getBoundingClientRect();
      const w = Math.max(64, Math.round((r.width || innerWidth) * dpr * st.scale));
      const h = Math.max(64, Math.round((r.height || innerHeight) * dpr * st.scale));
      if (w !== W || h !== H || dirty) {
        W = w; H = h; dirty = false;
        eng.configure({ design: st.design, mode: st.mode, width: W, height: H, duo: st.duo, typeOpacity: st.type ? 1 : 0, loop: 10 });
      }
    }

    function tick(now) {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!st.paused || !drawn) {
        drawn = true;
        t += dt * st.speed;
        frame++;
        size();
        // glitch scheduling: irregular, never in lockstep with the loop
        if (st.glitch > 0 && t >= nextGlitch) {
          gStart = t; gSeed = 1 + Math.floor(Math.random() * 9973);
          nextGlitch = t + st.glitch * (0.65 + 0.7 * Math.random());
        }
        const age = t - gStart;
        eng.glitchOverride = st.glitch > 0 ? QATSEL.glitchEvent(age, st.intensity, gSeed) : 0;
        eng.gseedOverride = Math.floor(age * 15) + gSeed * 31;
        audio += ((st.audioOn ? audio_target : 0) - audio) * 0.18;
        eng.audio = audio;
        eng.render(t, frame);
      }
      raf = requestAnimationFrame(tick);
    }
    let raf = requestAnimationFrame(tick);
    addEventListener('resize', () => size());

    const api = {
      engine: eng,
      set(p) {
        if (p.design != null) { Object.assign(st, parseDesign(p.design)); dirty = true; }
        if (p.glitch != null) { st.glitch = +p.glitch; nextGlitch = t + Math.max(1, st.glitch * 0.5); }
        if (p.intensity != null) st.intensity = +p.intensity;
        if (p.type != null) { st.type = p.type ? 1 : 0; dirty = true; }
        if (p.scale != null) { st.scale = Math.max(0.25, Math.min(1, +p.scale)); dirty = true; }
        if (p.speed != null) st.speed = +p.speed;
        if (p.duo != null) { st.duo = !!p.duo; dirty = true; }
        if (p.audio != null) st.audioOn = !!p.audio;
        if (p.paused != null) st.paused = !!p.paused;
        if (dirty) size();
      },
      glitchNow() { gStart = t; gSeed = 1 + Math.floor(Math.random() * 9973); },
      audioLevel(v) { audio_target = Math.max(0, Math.min(1, v)); },
      stop() { cancelAnimationFrame(raf); },
      state: st,
    };
    return api;
  }

  global.QATSEL_LIVE = { start };
})(window);
