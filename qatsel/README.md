# QATSEL — Quiet Ambient Techno Soul of Eternal Life

A wallpaper package of four designs built around one anonymous figure made of light, delivered as
static wallpapers, Live Photos, seamless loops and a real-time WebGL wallpaper.

| | Design | Line | Motif |
|---|---|---|---|
| I | **GHOST** | *ambient, ghostly* | Standing figure with a sky for skin: stars rise through the body, spiked stars around it, a horizon of light at its feet. |
| II | **ILLUSION** | *break the illusion* | Arms open inside light-speed streams on three depths; overexposed core, falling petals of light, wide chromatic fringes. |
| III | **WIELDER** | *tech cyber wielder* | An open hand drawn as a CRT raster: scanlines bend over the fingers, x-ray bones, electric filaments, a light in the palm. |
| IV | **SAVED** | *capable of achieving all dreams* | The same light printed as ultramarine halftone on off-white paper; solid-ink floating figure with knocked-out stars. |
| IV·N | **SAVED — Nocturne** | bonus | The night underneath the print (what IV's glitch reveals), as its own wallpaper. |

**Shared system.** Every design is light over a dot matrix. Once per loop a quantized glitch tears bands sideways and
exposes the matrix (in IV, the night under the paper) for about half a second. Radial chromatic aberration, frosted
grain, a faint CRT raster and an off-white garment-tag label tie the four together. All effects scale with the
screen's short side, so the texture reads the same on a phone and on a 34" ultrawide.

## What's in the package

```
exports/
  stills/<device>/        JPEG, sRGB, 4:4:4, q95 — every design + IV Nocturne, at native resolution
  live-photos/<device>/   Live Photo pairs: QATSEL_<design>_<device>.JPG + .MOV (HEVC, 3 s, key frame first)
  loops/<device>/         10 s seamless loops, 24 fps, H.264 MP4
wallpaper-engine/QATSEL/  Wallpaper Engine "web" wallpaper (real time, any resolution)
lookbook/index.html       Single-file live lookbook (open in any browser)
engine/                   The renderer (WebGL2, no dependencies) + live runtime
tools/                    Offline render pipeline (Playwright + ffmpeg + Python)
fonts/                    IBM Plex Mono, Instrument Serif, Inter (SIL OFL 1.1)
```

| Display | Pixels | Still | Motion |
|---|---|---|---|
| iPhone 18 Pro Max | 1320 × 2868 | ✓ | Live Photo |
| iPhone 18 Pro | 1206 × 2622 | ✓ | Live Photo |
| iPhone duo pair (Pro Max / Pro) | 2 × 1320 × 2868 / 2 × 1206 × 2622 | L + R | Live Photo L + R |
| Galaxy Z Fold 8 — main | 1848 × 2448 | ✓ | MP4 loop |
| Galaxy Z Fold 8 — cover | 1248 × 1972 | ✓ | MP4 loop |
| MacBook Pro 16" | 3456 × 2234 | ✓ | MP4 loop · live page |
| MacBook Pro 14" / Air 15" / Air 13" | 3024 × 1964 / 2880 × 1864 / 2560 × 1664 | ✓ | live page |
| iPad Pro 13" / 11" (rotation-safe square) | 2752 × 2752 | ✓ | Live Photo |
| Ultrawide | 3440 × 1440 | ✓ | Wallpaper Engine (live) · MP4 loop |

The duo pair is one composition across two phones: set `-L` on one and `-R` on the other, lay them side by side.
The `-PREVIEW` file shows the pair as one image.

## Install

**iPhone / iPad — Live Photo.** Each pair is a `.JPG` + `.MOV` with the same name and the same content identifier.
On a Mac, drag both files into Photos together; Photos merges them into one Live Photo and iCloud syncs it. On the
device: Settings → Wallpaper → Add New Wallpaper → Photos → pick it, keep Live Photo on. The motion (and the glitch at
~1 s) plays when you wake the screen. Phone-only route: open the `.MOV` in a converter such as intoLive.

**iPhone / iPad — still.** Save the JPEG to Photos and set it the same way.

**Galaxy Z Fold 8.** Copy the MP4 to the phone → Settings → Wallpaper and style → Change wallpapers → Lock screen →
Gallery → choose the video. The main and cover screens are set separately; use the matching file for each.

**MacBook.** Still: System Settings → Wallpaper → Add Photo. Live: macOS has no native video wallpaper — open
`wallpaper-engine/QATSEL/index.html` in [Plash](https://sindresorhus.com/plash) to run the engine live at native
resolution, or play the MP4 loop with a video-wallpaper app.

**Wallpaper Engine (3440 × 1440 or any monitor).** Open Wallpaper → Open from File → select
`wallpaper-engine/QATSEL/index.html`. Properties: design (incl. Nocturne), glitch interval and intensity, motion speed,
typography, audio-reactive light, render scale. Click the desktop to break the illusion on demand. The MP4 loop in
`exports/loops/ultrawide` also works as a Wallpaper Engine video wallpaper.

The live page takes URL parameters too: `index.html?design=3&glitch=20&type=0&scale=0.75`.

### Live Photo notes

The pairs are built by `tools/livephoto.py` without Apple frameworks: the JPEG carries an Apple MakerNote
`ContentIdentifier`, the MOV carries the same id in `com.apple.quicktime.content.identifier` and a timed-metadata
track with `com.apple.quicktime.still-image-time`. ExifTool 13.59 reads all three back. They have not been tested
on a physical iPhone from the render machine; if Photos imports a pair as two separate items, use the converter route.

## Re-render

Requirements: Node 18+, `npm i -g playwright` (or a local install), ffmpeg with libx264/libx265, Python 3 with
Pillow and piexif. On a machine with a GPU add `--gpu` — renders take minutes instead of hours.

```sh
node tools/render.mjs --design 1 --w 1320 --h 2868 --still 2 --out ghost.png --gpu        # one still
node tools/render.mjs --design 2 --w 3440 --h 1440 --video --dur 10 --fps 24 --out a.mp4 --gpu
node tools/build-stills.mjs --gpu                     # every still
node tools/build-motion.mjs --gpu                     # Live Photos + loops
node tools/build-web.mjs                              # Wallpaper Engine folder + lookbook
```

Any resolution works: the composition re-lays itself for portrait, square, landscape, ultrawide and duo
(`--duo`) canvases. Device targets live in `tools/devices.mjs`.

## Engine

`engine/qatsel.js` is one WebGL2 pipeline used by every deliverable:

1. **bake** (once) — the figure as a signed-distance field (standing, open-armed, supine, hand with x-ray bones) plus
   vertical light smears; tileable star, petal and grain textures.
2. **atmosphere** (¼ res) — frosted, melting fbm gradients, halo volume, nebula inside the body.
3. **scene** (full res) — silhouette, stars, streams, raster, filaments, light smears.
4. **bloom** — seven-level dual-filter chain.
5. **post** — quantized glitch, radial chromatic aberration, halftone print, type, CRT raster, film grain.

Every animated term is periodic in the loop length, so exported loops are seamless; the live runtime schedules
glitches irregularly instead.
