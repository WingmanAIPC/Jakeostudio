/*
 * QATSEL — Quiet Ambient Techno Soul of Eternal Life
 * Real-time / offline wallpaper engine (WebGL2, no dependencies).
 *
 * One renderer drives every deliverable: offline PNG / MP4 / Live Photo renders,
 * the Wallpaper Engine web wallpaper and the lookbook preview.
 *
 * Pipeline per frame:
 *   bake    (once)   figure signed-distance field + vertical light smears
 *   atmos   (1/4 res) frosted, melting gradients, halo volume, figure nebula
 *   scene   (full)   figure, stars, streaks, scan raster
 *   bloom   (1/2..1/64) dual-filter blur chain
 *   post    (full)   glitch, chromatic aberration, halftone, type, grain
 */
(function (global) {
  'use strict';

  // ---------------------------------------------------------------- GLSL ----

  const HEAD = `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
`;

  const COMMON = `
#define PI 3.14159265359
#define TAU 6.28318530718
uniform vec2  uRes;
uniform float uTime;
uniform float uLoop;
uniform float uFrame;
uniform float uPx;
uniform float uMd;
uniform float uBreath;
uniform float uAudio;
uniform vec4  uFig[2];
uniform float uFlip[2];
uniform int   uFigN;
uniform sampler2D uFigTex;
uniform float uFigBox;
uniform sampler2D uTileS;
uniform sampler2D uTileF;
uniform float uTileSCells;
uniform float uTileFCells;
uniform sampler2D uNoise;
uniform vec4 uHero[9];

uint pcg(uint v){ uint s = v*747796405u + 2891336453u; uint w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u; return (w >> 22u) ^ w; }
uint hu(ivec2 p){ return pcg(uint(p.x)*1597334677u ^ pcg(uint(p.y)*3812015801u)); }
uint hu(ivec3 p){ return pcg(uint(p.x)*1597334677u ^ pcg(uint(p.y)*3812015801u ^ pcg(uint(p.z)*2798796415u))); }
float u2f(uint h){ return float(h >> 8u) * (1.0/16777216.0); }
float hash(ivec2 p){ return u2f(hu(p)); }
float hashf(float x, float s){ return u2f(pcg(uint(int(x)) ^ pcg(uint(int(s)) + 0x9E3779B9u))); }

vec3 gvec(ivec3 i){ uint h = hu(i); return vec3(float(h & 1023u), float((h >> 10u) & 1023u), float((h >> 20u) & 1023u)) * (2.0/1023.0) - 1.0; }
float gnoise(vec3 p){
  ivec3 i = ivec3(floor(p)); vec3 f = fract(p);
  vec3 u = f*f*f*(f*(f*6.0 - 15.0) + 10.0);
  float a = dot(gvec(i), f);
  float b = dot(gvec(i + ivec3(1,0,0)), f - vec3(1,0,0));
  float c = dot(gvec(i + ivec3(0,1,0)), f - vec3(0,1,0));
  float d = dot(gvec(i + ivec3(1,1,0)), f - vec3(1,1,0));
  float e = dot(gvec(i + ivec3(0,0,1)), f - vec3(0,0,1));
  float g = dot(gvec(i + ivec3(1,0,1)), f - vec3(1,0,1));
  float h = dot(gvec(i + ivec3(0,1,1)), f - vec3(0,1,1));
  float k = dot(gvec(i + ivec3(1,1,1)), f - vec3(1,1,1));
  return mix(mix(mix(a,b,u.x), mix(c,d,u.x), u.y), mix(mix(e,g,u.x), mix(h,k,u.x), u.y), u.z);
}
float vnoise(vec2 p){
  ivec2 i = ivec2(floor(p)); vec2 f = fract(p); vec2 u = f*f*(3.0 - 2.0*f);
  return mix(mix(hash(i), hash(i + ivec2(1,0)), u.x), mix(hash(i + ivec2(0,1)), hash(i + ivec2(1,1)), u.x), u.y);
}
float tn(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0 - 2.0*f); return texture(uNoise, (i + f + 0.5)/512.0).r; }
float tn3(vec3 p){
  float zi = floor(p.z); float zf = fract(p.z); zf = zf*zf*(3.0 - 2.0*zf);
  vec2 o1 = vec2(37.0, 17.0)*zi;
  return mix(tn(p.xy + o1), tn(p.xy + o1 + vec2(37.0, 17.0)), zf);
}
float gn(vec3 p){ return (tn3(p) - 0.5)*1.25; }
vec2 rnd2(vec2 px){ return texelFetch(uNoise, ivec2(px) & 511, 0).ba; }
float fbm(vec3 p, int oct){
  float s = 0.0, a = 0.5;
  for (int k = 0; k < 6; k++){
    if (k >= oct) break;
    s += a*gn(p);
    p = vec3(mat2(0.8, 0.6, -0.6, 0.8)*p.xy*2.03, p.z*1.6) + vec3(3.1, 7.7, 1.3);
    a *= 0.5;
  }
  return s;
}
float PH(){ return uTime/uLoop; }
vec2  LC(float r){ float a = TAU*PH(); return r*vec2(cos(a), sin(a)); }
// seamless, morphing fbm: two fields riding cos/sin of the loop phase
float lfbm(vec2 p, float r, int oct){ vec2 c = LC(r); return 0.7071*(fbm(vec3(p, c.x), oct) + fbm(vec3(p + vec2(31.4, -17.2), c.y + 5.3), oct)); }
float lvn(vec2 p, float r){ return tn(p + LC(r)); }

vec2 toFig(vec2 px, int i){
  vec4 F = uFig[i];
  vec2 d = (px - F.xy)/F.z;
  float c = cos(F.w), s = sin(F.w);
  d = vec2(c*d.x + s*d.y, -s*d.x + c*d.y);
  d.x *= uFlip[i];
  return d;
}
vec4 figTex(vec2 q){
  vec2 uv = q/(2.0*uFigBox) + 0.5;
  vec4 v = texture(uFigTex, clamp(uv, 0.0, 1.0));
  float e = length(max(abs(q) - uFigBox, 0.0));
  v.xy += e;
  v.zw *= exp(-e/0.25);
  return v;
}
float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

// star cells with four-point diffraction spikes; p in cell units
float starLayer(vec2 p, float pxPerCell, float density, uint seed, float spike){
  vec2 ip = floor(p);
  float acc = 0.0;
  float maxL = 0.30*pxPerCell;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
    ivec2 c = ivec2(ip) + ivec2(i, j);
    uint h = pcg(hu(c) ^ seed);
    if (u2f(h) > density) continue;
    uint h2 = pcg(h), h3 = pcg(h2), h4 = pcg(h3), h5 = pcg(h4);
    vec2 pos = vec2(c) + 0.15 + 0.7*vec2(u2f(h2), u2f(h3));
    float m = u2f(h4); m = m*m*m;
    float tw = 0.55 + 0.45*sin(TAU*(PH()*float(1u + (h5 & 3u)) + u2f(h5)));
    vec2 d = (p - pos)*pxPerCell/uPx;
    float r2 = dot(d, d);
    float sig = 0.65 + 1.9*m;
    float core = exp(-r2/(sig*sig));
    float L = min((5.0 + 60.0*m)*spike, maxL/uPx);
    float sp = exp(-abs(d.y)/0.55)*exp(-abs(d.x)/L) + exp(-abs(d.x)/0.55)*exp(-abs(d.y)/L);
    acc += (core*(0.35 + 3.0*m) + sp*m*1.6)*tw;
  }
  return acc;
}
// baked tiles: rg = layer A (intensity, twinkle code), ba = layer B
float tw(float code){ float c4 = code*4.0; return 0.55 + 0.45*sin(TAU*(PH()*(floor(c4) + 1.0) + fract(c4))); }
float starsS(vec2 cells){ vec4 t = textureLod(uTileS, cells/uTileSCells, 0.0); return t.r*tw(t.g); }
float starsS2(vec2 cells){ vec4 t = texture(uTileS, cells/uTileSCells); return t.b*tw(t.a); }
float starsF(vec2 cells){ vec4 t = textureLod(uTileF, cells/uTileFCells, 0.0); return t.r*tw(t.g); }
float starsF2(vec2 cells){ vec4 t = texture(uTileF, cells/uTileFCells); return t.b*tw(t.a); }
// a single bright star with long spikes; d in reference px
float heroStar(vec2 d, float size, float len){
  float r2 = dot(d, d);
  float core = exp(-r2/(size*size)) + 0.25*exp(-sqrt(r2)/(size*4.0));
  float sp = exp(-abs(d.y)/0.8)*exp(-abs(d.x)/len) + exp(-abs(d.x)/0.8)*exp(-abs(d.y)/len);
  vec2 e = mat2(0.7071, 0.7071, -0.7071, 0.7071)*d;
  sp += 0.25*(exp(-abs(e.y)/0.6)*exp(-abs(e.x)/(len*0.35)) + exp(-abs(e.x)/0.6)*exp(-abs(e.y)/(len*0.35)));
  return core*2.2 + sp;
}
`;

  const VS = `${HEAD}
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

  // ---------------------------------------------------------- figure bake ---
  const BAKE_SDF = `${HEAD}
uniform vec2 uBakeRes;
uniform float uBox;
uniform int uPose;
out vec4 o;

float smin(float a, float b, float k){ float h = max(k - abs(a - b), 0.0)/k; return min(a, b) - h*h*k*0.25; }
float sdTaper(vec2 p, vec2 pa, vec2 pb, float ra, float rb){
  vec2 ba = pb - pa; float h = length(ba); vec2 dn = ba/h;
  vec2 q = vec2(abs(dot(p - pa, vec2(dn.y, -dn.x))), dot(p - pa, dn));
  float b = (ra - rb)/h; float a = sqrt(1.0 - b*b);
  float k = dot(q, vec2(-b, a));
  if (k < 0.0) return length(q) - ra;
  if (k > a*h) return length(q - vec2(0.0, h)) - rb;
  return dot(q, vec2(a, b)) - ra;
}
float sdEll(vec2 p, vec2 c, vec2 r, float ang){
  p -= c; float cs = cos(ang), sn = sin(ang);
  p = vec2(cs*p.x + sn*p.y, -sn*p.x + cs*p.y);
  float k0 = length(p/r); float k1 = length(p/(r*r));
  return k0*(k0 - 1.0)/k1;
}

// shared torso + head; s: 0 standing, 1 floating
float torso(vec2 p){
  vec2 a = vec2(abs(p.x), p.y);
  float d = sdEll(p, vec2(0.0, 0.433), vec2(0.048, 0.062), 0.0);
  d = smin(d, sdEll(p, vec2(0.0, 0.405), vec2(0.040, 0.040), 0.0), 0.02);
  d = smin(d, sdTaper(p, vec2(0.0, 0.392), vec2(0.0, 0.332), 0.021, 0.028), 0.02);
  d = smin(d, sdTaper(a, vec2(0.018, 0.342), vec2(0.096, 0.302), 0.024, 0.033), 0.035);
  d = smin(d, sdEll(p, vec2(0.0, 0.242), vec2(0.090, 0.082), 0.0), 0.035);
  d = smin(d, sdTaper(p, vec2(0.0, 0.205), vec2(0.0, 0.090), 0.076, 0.064), 0.035);
  d = smin(d, sdEll(p, vec2(0.0, 0.032), vec2(0.086, 0.066), 0.0), 0.035);
  d = smin(d, sdEll(a, vec2(0.104, 0.280), vec2(0.036, 0.050), -0.35), 0.02);
  return d;
}
vec2 poseStand(vec2 p){
  vec2 a = vec2(abs(p.x), p.y);
  float d = torso(p);
  d = smin(d, sdTaper(a, vec2(0.106, 0.286), vec2(0.152, 0.120), 0.031, 0.023), 0.014);
  d = smin(d, sdTaper(a, vec2(0.152, 0.120), vec2(0.196, -0.040), 0.025, 0.016), 0.010);
  d = smin(d, sdTaper(a, vec2(0.197, -0.044), vec2(0.209, -0.100), 0.019, 0.018), 0.012);
  d = smin(d, sdTaper(a, vec2(0.209, -0.100), vec2(0.217, -0.142), 0.016, 0.008), 0.010);
  d = smin(d, sdTaper(a, vec2(0.049, 0.012), vec2(0.043, -0.236), 0.051, 0.030), 0.020);
  d = smin(d, sdEll(a, vec2(0.050, -0.305), vec2(0.029, 0.075), 0.06), 0.016);
  d = smin(d, sdTaper(a, vec2(0.043, -0.240), vec2(0.037, -0.452), 0.031, 0.017), 0.012);
  d = smin(d, sdTaper(a, vec2(0.037, -0.455), vec2(0.047, -0.497), 0.018, 0.011), 0.010);
  float core = min(sdTaper(p, vec2(0.0, 0.44), vec2(0.0, -0.02), 0.002, 0.002),
                   sdTaper(a, vec2(0.0, 0.31), vec2(0.105, 0.29), 0.002, 0.002));
  return vec2(d, core);
}
vec2 poseOpen(vec2 p){
  vec2 a = vec2(abs(p.x), p.y);
  float d = torso(p);
  d = smin(d, sdTaper(a, vec2(0.104, 0.292), vec2(0.250, 0.240), 0.031, 0.023), 0.016);
  d = smin(d, sdTaper(a, vec2(0.250, 0.240), vec2(0.392, 0.192), 0.024, 0.016), 0.010);
  d = smin(d, sdTaper(a, vec2(0.394, 0.191), vec2(0.447, 0.183), 0.018, 0.017), 0.012);
  d = smin(d, sdTaper(a, vec2(0.447, 0.183), vec2(0.488, 0.181), 0.015, 0.008), 0.010);
  d = smin(d, sdTaper(a, vec2(0.046, 0.012), vec2(0.034, -0.236), 0.050, 0.029), 0.020);
  d = smin(d, sdEll(a, vec2(0.041, -0.305), vec2(0.028, 0.074), 0.04), 0.016);
  d = smin(d, sdTaper(a, vec2(0.034, -0.240), vec2(0.027, -0.452), 0.030, 0.016), 0.012);
  d = smin(d, sdTaper(a, vec2(0.027, -0.452), vec2(0.024, -0.515), 0.017, 0.008), 0.010);
  float core = min(sdTaper(p, vec2(0.0, 0.44), vec2(0.0, -0.02), 0.002, 0.002),
                   sdTaper(a, vec2(0.0, 0.30), vec2(0.45, 0.185), 0.002, 0.002));
  return vec2(d, core);
}
vec2 poseLie(vec2 p){
  float d = sdEll(p, vec2(-0.433, 0.024), vec2(0.062, 0.048), 0.22);
  d = smin(d, sdTaper(p, vec2(-0.392, 0.014), vec2(-0.328, 0.006), 0.021, 0.029), 0.02);
  d = smin(d, sdEll(p, vec2(-0.240, 0.004), vec2(0.088, 0.070), -0.03), 0.035);
  d = smin(d, sdTaper(p, vec2(-0.205, -0.002), vec2(-0.085, -0.014), 0.062, 0.054), 0.035);
  d = smin(d, sdEll(p, vec2(-0.032, -0.020), vec2(0.068, 0.064), 0.05), 0.035);
  d = smin(d, sdEll(p, vec2(-0.292, 0.040), vec2(0.046, 0.036), 0.4), 0.02);
  // raised arm, reaching up
  d = smin(d, sdTaper(p, vec2(-0.298, 0.040), vec2(-0.252, 0.196), 0.030, 0.023), 0.015);
  d = smin(d, sdTaper(p, vec2(-0.252, 0.196), vec2(-0.194, 0.330), 0.024, 0.016), 0.010);
  d = smin(d, sdTaper(p, vec2(-0.193, 0.332), vec2(-0.172, 0.384), 0.017, 0.015), 0.010);
  d = smin(d, sdTaper(p, vec2(-0.172, 0.384), vec2(-0.160, 0.420), 0.013, 0.007), 0.008);
  // trailing arm
  d = smin(d, sdTaper(p, vec2(-0.284, -0.028), vec2(-0.200, -0.126), 0.029, 0.022), 0.015);
  d = smin(d, sdTaper(p, vec2(-0.200, -0.126), vec2(-0.088, -0.166), 0.023, 0.015), 0.010);
  d = smin(d, sdTaper(p, vec2(-0.087, -0.167), vec2(-0.036, -0.186), 0.016, 0.008), 0.010);
  // near leg, knee lifted
  d = smin(d, sdTaper(p, vec2(0.004, -0.004), vec2(0.226, 0.052), 0.050, 0.030), 0.020);
  d = smin(d, sdTaper(p, vec2(0.226, 0.052), vec2(0.428, -0.016), 0.031, 0.017), 0.012);
  d = smin(d, sdTaper(p, vec2(0.430, -0.016), vec2(0.494, -0.002), 0.017, 0.009), 0.010);
  // far leg, straight
  d = smin(d, sdTaper(p, vec2(0.004, -0.040), vec2(0.236, -0.054), 0.049, 0.029), 0.020);
  d = smin(d, sdTaper(p, vec2(0.236, -0.054), vec2(0.446, -0.068), 0.030, 0.016), 0.012);
  d = smin(d, sdTaper(p, vec2(0.448, -0.068), vec2(0.508, -0.058), 0.016, 0.008), 0.010);
  float core = sdTaper(p, vec2(-0.44, 0.02), vec2(0.02, -0.02), 0.002, 0.002);
  return vec2(d, core);
}
vec2 poseHand(vec2 p){
  float d = sdTaper(p, vec2(0.0, -0.185), vec2(0.004, 0.058), 0.086, 0.110);
  d = smin(d, sdEll(p, vec2(0.002, 0.070), vec2(0.116, 0.050), -0.10), 0.03);
  d = smin(d, sdEll(p, vec2(0.066, -0.098), vec2(0.072, 0.100), -0.50), 0.03);
  d = smin(d, sdEll(p, vec2(-0.066, -0.062), vec2(0.048, 0.120), 0.06), 0.03);
  d = smin(d, sdTaper(p, vec2(0.0, -0.200), vec2(0.0, -0.340), 0.079, 0.068), 0.045);
  d = smin(d, sdTaper(p, vec2(0.0, -0.340), vec2(-0.025, -1.150), 0.070, 0.102), 0.045);
  float b = 1e9;
  // carpals
  b = min(b, sdEll(p, vec2(-0.030, -0.205), vec2(0.026, 0.020), 0.3));
  b = min(b, sdEll(p, vec2(0.020, -0.212), vec2(0.024, 0.019), -0.2));
  b = min(b, sdEll(p, vec2(0.058, -0.188), vec2(0.020, 0.018), 0.5));
  b = min(b, sdEll(p, vec2(-0.050, -0.172), vec2(0.018, 0.022), 0.0));
  b = min(b, sdEll(p, vec2(-0.004, -0.172), vec2(0.022, 0.018), 0.1));
  b = min(b, sdEll(p, vec2(0.040, -0.160), vec2(0.018, 0.016), -0.3));
  // forearm bones
  b = min(b, sdTaper(p, vec2(0.030, -0.245), vec2(0.010, -1.15), 0.030, 0.018));
  b = min(b, sdTaper(p, vec2(-0.040, -0.240), vec2(-0.062, -1.15), 0.018, 0.022));
  // fingers: index, middle, ring, pinky (thumb sits at +x: palm faces the viewer)
  vec2 base[4] = vec2[4](vec2(0.071, 0.090), vec2(0.024, 0.101), vec2(-0.024, 0.094), vec2(-0.067, 0.073));
  float ang[4] = float[4](0.15, 0.03, -0.11, -0.29);
  vec3 len[4] = vec3[4](vec3(0.124, 0.074, 0.060), vec3(0.137, 0.086, 0.064), vec3(0.127, 0.080, 0.060), vec3(0.097, 0.060, 0.050));
  float rr[4] = float[4](0.026, 0.027, 0.025, 0.021);
  vec2 cb[4] = vec2[4](vec2(0.040, -0.150), vec2(0.010, -0.152), vec2(-0.020, -0.148), vec2(-0.048, -0.140));
  for (int i = 0; i < 4; i++){
    float a0 = ang[i]; float cur = -0.035*sign(a0 + 0.02);
    vec2 d0 = vec2(sin(a0), cos(a0));
    vec2 d1 = vec2(sin(a0 + cur), cos(a0 + cur));
    vec2 d2 = vec2(sin(a0 + 2.0*cur), cos(a0 + 2.0*cur));
    vec2 j0 = base[i]; vec2 j1 = j0 + d0*len[i].x; vec2 j2 = j1 + d1*len[i].y; vec2 j3 = j2 + d2*len[i].z;
    float r = rr[i];
    d = smin(d, sdTaper(p, j0 - d0*0.03, j1, r*1.05, r*0.90), 0.018);
    d = smin(d, sdTaper(p, j1, j2, r*0.88, r*0.78), 0.008);
    d = smin(d, sdTaper(p, j2, j3, r*0.77, r*0.62), 0.006);
    // bones with joint gaps
    b = min(b, sdTaper(p, cb[i], j0 - d0*0.010, 0.012, 0.014));
    b = min(b, sdEll(p, j0 - d0*0.008, vec2(0.016, 0.013), -a0));
    b = min(b, sdTaper(p, j0 + d0*0.012, j1 - d0*0.008, r*0.46, r*0.36));
    b = min(b, sdTaper(p, j1 + d1*0.009, j2 - d1*0.006, r*0.40, r*0.32));
    b = min(b, sdTaper(p, j2 + d2*0.008, j3 - d2*0.014, r*0.34, r*0.22));
  }
  // thumb
  vec2 t0 = vec2(0.046, -0.165), t1 = vec2(0.146, -0.064), t2 = vec2(0.202, 0.016), t3 = vec2(0.240, 0.074);
  d = smin(d, sdTaper(p, t0, t1, 0.044, 0.033), 0.03);
  d = smin(d, sdTaper(p, t1, t2, 0.031, 0.026), 0.010);
  d = smin(d, sdTaper(p, t2, t3, 0.025, 0.018), 0.008);
  b = min(b, sdTaper(p, t0 + vec2(0.012, 0.012), t1 - vec2(0.008, 0.008), 0.015, 0.013));
  b = min(b, sdTaper(p, t1 + vec2(0.008, 0.010), t2 - vec2(0.006, 0.008), 0.012, 0.010));
  b = min(b, sdTaper(p, t2 + vec2(0.006, 0.008), t3 - vec2(0.006, 0.010), 0.010, 0.007));
  return vec2(d, b);
}
void main(){
  vec2 uv = gl_FragCoord.xy/uBakeRes;
  vec2 p = (uv - 0.5)*2.0*uBox;
  vec2 r;
  if (uPose == 1) r = poseStand(p);
  else if (uPose == 2) r = poseOpen(p);
  else if (uPose == 3) r = poseHand(p);
  else r = poseLie(p);
  o = vec4(r, 0.0, 0.0);
}
`;

  // vertical light smears (dripping / rising), integrated once from the silhouette
  const BAKE_SMEAR = `${HEAD}
uniform sampler2D uSrc;
uniform vec2 uBakeRes;
uniform float uBox;
uniform float uLen;
out vec4 o;
float m(vec2 uv){ float d = texture(uSrc, uv).x; return smoothstep(0.006, -0.004, d); }
void main(){
  vec2 uv = gl_FragCoord.xy/uBakeRes;
  vec4 s = texture(uSrc, uv);
  float stepU = (uLen/(2.0*uBox))/40.0;
  float dn = 0.0, up = 0.0, wsum = 0.0;
  for (int k = 1; k <= 40; k++){
    float fk = float(k);
    float w = exp(-fk/14.0);
    dn += w*m(uv + vec2(0.0, fk*stepU));
    up += w*m(uv - vec2(0.0, fk*stepU));
    wsum += w;
  }
  o = vec4(s.x, s.y, dn/wsum, up/wsum);
}
`;

  // star / petal tiles (tileable: cell indices wrap), baked once per job
  const BAKE_TILE = `${HEAD}
#define TAU 6.28318530718
uniform vec2 uBakeRes;
uniform float uCells;
uniform float uRefPx;
uniform vec4 uA;
uniform vec4 uB;
out vec4 o;
uint pcg(uint v){ uint s = v*747796405u + 2891336453u; uint w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u; return (w >> 22u) ^ w; }
uint hu(ivec2 p){ return pcg(uint(p.x)*1597334677u ^ pcg(uint(p.y)*3812015801u)); }
float u2f(uint h){ return float(h >> 8u) * (1.0/16777216.0); }
vec2 layer(vec2 p, vec4 P){
  float pxPerCell = uBakeRes.x/uCells;
  vec2 ip = floor(p);
  float acc = 0.0, best = 0.0, code = 0.0;
  int C = int(uCells + 0.5);
  float maxL = 0.30*pxPerCell;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
    ivec2 c = ivec2(ip) + ivec2(i, j);
    ivec2 cw = ivec2((c.x % C + C) % C, (c.y % C + C) % C);
    uint h = pcg(hu(cw) ^ uint(P.z));
    if (u2f(h) > P.x) continue;
    uint h2 = pcg(h), h3 = pcg(h2), h4 = pcg(h3), h5 = pcg(h4);
    vec2 pos = vec2(c) + 0.15 + 0.7*vec2(u2f(h2), u2f(h3));
    float m = u2f(h4); m = m*m*m;
    vec2 d = (p - pos)*pxPerCell/uRefPx;
    float v;
    if (P.w < 0.5){
      float r2 = dot(d, d);
      float sig = 0.65 + 1.9*m;
      float core = exp(-r2/(sig*sig));
      float L = min((5.0 + 60.0*m)*P.y, maxL/uRefPx);
      float sp = exp(-abs(d.y)/0.55)*exp(-abs(d.x)/L) + exp(-abs(d.x)/0.55)*exp(-abs(d.y)/L);
      v = core*(0.35 + 3.0*m) + sp*m*1.6;
    } else {
      float a = u2f(pcg(h5 + 9u))*TAU;
      d = mat2(cos(a), sin(a), -sin(a), cos(a))*d;
      float sz = (4.0 + 9.0*u2f(pcg(h5 + 4u)))*P.y;
      v = exp(-pow(length(d/vec2(sz, sz*0.42)), 2.0))*(0.5 + 0.8*u2f(pcg(h5 + 7u)));
    }
    acc += v;
    if (v > best){ best = v; code = (float(h5 & 3u) + u2f(h5))/4.0; }
  }
  return vec2(acc, code);
}
void main(){
  vec2 p = gl_FragCoord.xy/uBakeRes*uCells;
  o = vec4(layer(p, uA), layer(p, uB));
}
`;

  const BAKE_GRAIN = `${HEAD}
uniform vec2 uBakeRes;
out vec4 o;
uint pcg(uint v){ uint s = v*747796405u + 2891336453u; uint w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u; return (w >> 22u) ^ w; }
float u2f(uint h){ return float(h >> 8u) * (1.0/16777216.0); }
void main(){
  ivec2 p = ivec2(gl_FragCoord.xy);
  uint h = pcg(uint(p.x)*1597334677u ^ pcg(uint(p.y)*3812015801u));
  o = vec4(u2f(h), u2f(pcg(h)), u2f(pcg(h + 1u)), u2f(pcg(h + 2u)));
}
`;

  // ------------------------------------------------------------ designs ----
  // Each design = atmosphere (quarter res) + scene (full res).
  // Atmosphere alpha carries a scalar field the scene re-uses (nebula / wash).

  const ATMOS = {};
  const SCENE = {};

  // ===================================================== I · GHOST ========
  ATMOS[1] = `
uniform float uDown;
out vec4 o;
void main(){
  vec2 px = gl_FragCoord.xy*uDown;
  float md = uMd;
  vec2 s = (px - 0.5*uRes)/md;
  float yN = px.y/uRes.y;
  float feet = (uFig[0].y - 0.5*uFig[0].z);
  float hz = (px.y - feet)/md;

  vec3 deep  = vec3(0.0016, 0.0030, 0.016);
  vec3 ultra = vec3(0.0040, 0.0170, 0.115);
  vec3 cob   = vec3(0.020, 0.080, 0.480);
  vec3 col = mix(ultra, deep, smoothstep(0.15, 1.05, yN));
  col = mix(col, deep*1.4, smoothstep(0.0, -0.35, hz));

  // frosted, melting cloud field
  vec2 c = LC(0.55);
  vec2 w = s*1.15;
  float n1 = fbm(vec3(w + vec2(1.7, 9.2), c.x), 4);
  float n2 = fbm(vec3(w + vec2(8.3, 2.8), c.y), 4);
  float cl = fbm(vec3(w*1.35 + 1.9*vec2(n1, n2), 0.7*(c.x - c.y)), 5);
  float clouds = smoothstep(-0.38, 0.55, cl);
  col *= 0.45 + 1.25*clouds;
  col += cob*0.10*pow(clouds, 4.0);

  // horizon: a thin line of light at the figure's feet
  float wob = fbm(vec3(s.x*2.2, 4.0, c.x*0.6), 3);
  float hzw = hz + 0.006*wob;
  float band = exp(-abs(hzw)/0.010)*0.30 + exp(-abs(hzw)/0.060)*0.20 + exp(-max(-hzw, 0.0)/0.20)*0.04;
  band *= 0.7 + 0.6*smoothstep(-0.3, 0.4, fbm(vec3(s.x*3.0, 1.0, c.y), 3));
  col += vec3(0.04, 0.17, 0.85)*band*0.6;

  // halo volume of the figure(s)
  float dmin = 1e9; float neb = 0.0; float bestd = 1e9;
  for (int i = 0; i < 2; i++){
    if (i >= uFigN) break;
    vec2 q = toFig(px, i);
    vec4 f = figTex(q);
    float ds = f.x*uFig[i].z/md;
    dmin = min(dmin, ds);
    if (f.x < bestd){
      bestd = f.x;
      neb = lfbm(q*vec2(5.5, 4.5) + vec2(0.0, -0.8), 0.45, 4);
    }
  }
  float r = max(dmin, 0.0);
  float br = 0.85 + 0.30*uBreath + 0.35*uAudio;
  col += vec3(0.04, 0.24, 1.0)*(0.30*exp(-r/0.020) + 0.13*exp(-r/0.075) + 0.05*exp(-r/0.28))*br;
  // ground pool under the feet
  for (int i = 0; i < 2; i++){
    if (i >= uFigN) break;
    vec2 g = (px - vec2(uFig[i].x, feet))/md;
    float pool = exp(-length(g*vec2(1.0, 4.5))/0.07);
    col += vec3(0.08, 0.34, 1.0)*pool*0.22*br;
  }
  o = vec4(col, neb);
}
`;
  SCENE[1] = `
uniform sampler2D uAtm;
out vec4 o;
void main(){
  vec2 px = gl_FragCoord.xy;
  float md = uMd;
  float ph = PH();
  vec2 jit = (rnd2(px) - 0.5)*7.0*uPx;
  vec4 atm = texture(uAtm, (px + jit)/uRes);
  vec3 col = atm.rgb;
  float feet = (uFig[0].y - 0.5*uFig[0].z);

  // drifting dust in screen space (seamless cross-fade between two rising fields)
  vec2 sp = px/(md*0.055);
  float fa = fract(ph), fb = fract(ph + 0.5);
  float wa = 1.0 - abs(2.0*fa - 1.0);
  float dust = starsS(sp + vec2(0.0, -fa*3.0))*wa + starsS(sp + vec2(5.37, -fb*3.0 + 7.1))*(1.0 - wa);
  float above = smoothstep(-0.02, 0.05, (px.y - feet)/md);
  col += vec3(0.55, 0.75, 1.0)*dust*0.40*(0.35 + 0.65*above);
  col += vec3(0.5, 0.7, 1.0)*starsS2(px/(md*0.022) + vec2(3.3, 1.7))*0.25;

  for (int i = 0; i < 2; i++){
    if (i >= uFigN) break;
    vec2 q = toFig(px, i);
    vec4 f = figTex(q);
    float d = f.x;
    float pu = 1.0/uFig[i].z;
    float footFade = mix(0.55, 1.0, smoothstep(-0.50, -0.25, q.y));
    if (d < 0.03){
    float ero = (lvn(q*vec2(150.0, 95.0), 3.0) - 0.5)*0.012 + (lvn(q*vec2(40.0, 22.0), 2.0) - 0.5)*0.010;
    float body = smoothstep(pu*1.5 + 0.0025, -pu*1.5 - 0.0025, d + ero);

    float heart = exp(-length((q - vec2(0.0, 0.245))*vec2(1.0, 0.85))/0.11);
    float headL = exp(-length(q - vec2(0.0, 0.43))/0.075);
    float neb = atm.a;
    float L = 0.22 + 0.30*smoothstep(-0.45, 0.45, q.y) + 0.95*heart + 0.45*headL + 0.40*neb;
    vec3 cyan = vec3(0.05, 0.42, 1.00);
    vec3 ice  = vec3(0.50, 0.82, 1.00);
    vec3 wht  = vec3(1.00, 0.98, 0.95);
    vec3 skin = mix(cyan, ice, smoothstep(0.35, 1.10, L));
    skin = mix(skin, wht, smoothstep(1.05, 1.9, L));
    float galaxy = 0.55 + 0.9*smoothstep(-0.45, 0.55, neb);
    skin *= L*galaxy*0.85*(0.9 + 0.2*uBreath + 0.3*uAudio);
    // stars living inside the body, slowly rising
    vec2 sq = q*28.0;
    float fa2 = fract(ph), fb2 = fract(ph + 0.5);
    float wa2 = 1.0 - abs(2.0*fa2 - 1.0);
    float st = starsF(sq + vec2(0.0, -fa2*2.0))*wa2 + starsF(sq + vec2(9.5, -fb2*2.0 + 4.0))*(1.0 - wa2);
    st += starsF2(q*70.0 + vec2(2.0, 0.0))*0.7;
    skin += vec3(0.85, 0.93, 1.0)*st*1.1;
    // rare warm specks (complementary)
    float spk = step(0.9978, texelFetch(uNoise, ivec2(floor(q*420.0)) & 511, 0).g);
    skin += vec3(1.0, 0.42, 0.12)*spk*0.9*body;
    col = mix(col, skin, body*0.90*footFade);
    }

    // rim + inner glow
    col += vec3(0.30, 0.68, 1.0)*exp(-abs(d)/(0.0035 + pu))*0.30*footFade;
    float r = max(d, 0.0);
    col += vec3(0.06, 0.36, 1.0)*(exp(-r/0.008)*0.32 + exp(-r/0.028)*0.12);

    // aura rays (polar, around the chest)
    if (r < 0.32 && d > 0.0){
      vec2 rc = (q - vec2(0.0, 0.20))*vec2(1.0, 0.75);
      float ang = atan(rc.y, rc.x);
      float rays = tn(vec2(ang*24.0, 0.0) + LC(1.2)) * tn(vec2(ang*61.0, 3.0) + LC(0.8));
      rays = rays*rays*rays*4.0;
      col += vec3(0.20, 0.55, 1.0)*rays*exp(-r/0.06)*smoothstep(0.0, 0.01, d)*0.22;
    }
    // dripping light below the arms and body
    if (f.z > 0.002 && d > 0.0){
      float colN = lvn(vec2(q.x*160.0, 0.0), 2.0)*lvn(vec2(q.x*47.0, 5.0), 1.0);
      col += vec3(0.12, 0.48, 1.0)*f.z*colN*smoothstep(0.0, 0.02, d)*0.55;
    }

    // mirrored reflection on the ground plane
    vec2 rq = q; rq.y = -1.0 - q.y;
    if (rq.y > -0.5 && q.y < -0.5){
      vec4 rf = figTex(rq + vec2(0.006*sin(q.y*180.0 + TAU*ph*2.0), 0.0));
      float refl = smoothstep(0.01, -0.01, rf.x)*exp(-(-0.5 - q.y)/0.10);
      col += vec3(0.10, 0.40, 1.0)*refl*0.30;
    }
  }

  // hero stars with long spikes around the figure
  for (int k = 0; k < 9; k++){
    vec4 H = uHero[k];
    vec2 hd = (px - H.xy)/uPx;
    float ln = H.w;
    if (max(abs(hd.x), abs(hd.y)) > ln*6.0) continue;
    float sz = fract(H.z)*4.0, tw = floor(H.z)/100.0;
    col += vec3(0.75, 0.88, 1.0)*heroStar(hd, sz, ln)*(0.35 + 0.65*tw)*0.55;
  }

  // anamorphic streak through the head
  for (int i = 0; i < 2; i++){
    if (i >= uFigN) break;
    vec2 hpos = uFig[i].xy + vec2(0.0, 0.43*uFig[i].z);
    vec2 dd = (px - hpos)/md;
    float an = exp(-abs(dd.y)/0.0016)*exp(-abs(dd.x)/0.55)*(0.7 + 0.3*sin(TAU*ph));
    col += vec3(0.10, 0.35, 1.0)*an*0.35;
  }
  o = vec4(col, 1.0);
}
`;

  // ================================================== II · ILLUSION =======
  ATMOS[2] = `
uniform float uDown;
out vec4 o;
void main(){
  vec2 px = gl_FragCoord.xy*uDown;
  float md = uMd;
  vec2 s = (px - 0.5*uRes)/md;
  float yN = px.y/uRes.y;
  vec3 col = mix(vec3(0.0025, 0.0045, 0.020), vec3(0.0010, 0.0016, 0.006), smoothstep(0.0, 1.0, 1.0 - yN)*0.6);
  vec2 c = LC(0.5);
  // streaming fog bands along the travel direction
  vec2 dir = vec2(cos(0.27), sin(0.27));
  vec2 r = vec2(dot(s, dir), dot(s, vec2(-dir.y, dir.x)));
  float n1 = fbm(vec3(r.x*0.6 - PH()*2.0, r.y*5.0, c.x), 4);
  float n2 = fbm(vec3(r*vec2(1.2, 3.2) + vec2(n1*1.4, 0.0), c.y), 4);
  float fog = smoothstep(-0.25, 0.6, n2);
  col += vec3(0.006, 0.016, 0.070)*fog*0.9;
  col += vec3(0.010, 0.030, 0.140)*pow(fog, 3.0)*0.6;
  float dmin = 1e9;
  for (int i = 0; i < 2; i++){
    if (i >= uFigN) break;
    vec2 q = toFig(px, i);
    dmin = min(dmin, figTex(q).x*uFig[i].z/md);
  }
  float rr = max(dmin, 0.0);
  float br = 0.9 + 0.25*uBreath + 0.35*uAudio;
  col += vec3(0.08, 0.28, 1.0)*(0.42*exp(-rr/0.025) + 0.16*exp(-rr/0.10) + 0.05*exp(-rr/0.40))*br;
  o = vec4(col, fog);
}
`;
  SCENE[2] = `
uniform sampler2D uAtm;
out vec4 o;
float lanes(vec2 s, float lw, float dens, float thick, float bright, uint seed, float spd, float ph){
  vec2 dir = vec2(cos(0.27), sin(0.27));
  float u = dot(s, dir), v = dot(s, vec2(-dir.y, dir.x));
  float lane = floor(v/lw);
  uint h = pcg(uint(int(lane)) ^ seed);
  if (u2f(h) > dens) return 0.0;
  uint h2 = pcg(h), h3 = pcg(h2), h4 = pcg(h3), h5 = pcg(h4), h6 = pcg(h5);
  float vc = (lane + 0.25 + 0.5*u2f(h2))*lw;
  float th = thick*(0.5 + u2f(h3));
  float pxw = 0.55*uPx/uMd;
  float tw = max(th, pxw);
  float prof = exp(-pow((v - vc)/tw, 2.0))*(th/tw);
  float P = 0.55 + 1.5*u2f(h4);
  float k = floor(1.0 + 3.0*u2f(h5))*spd;
  float x = fract((u - k*P*ph)/P + u2f(h6));
  float sl = 0.25 + 0.6*u2f(pcg(h6));
  float seg = x < sl ? pow(x/sl, 2.2)*smoothstep(1.0, 0.985, x/sl) : 0.0;
  return prof*seg*bright*(0.35 + 0.65*u2f(pcg(h6 ^ 77u)));
}
void main(){
  vec2 px = gl_FragCoord.xy;
  float md = uMd;
  float ph = PH();
  vec2 jit = (rnd2(px) - 0.5)*6.0*uPx;
  vec4 atm = texture(uAtm, (px + jit)/uRes);
  vec3 col = atm.rgb;
  vec2 s = (px - 0.5*uRes)/md;

  // light-speed streams (three parallax depths)
  float far  = lanes(s, 0.0042, 0.55, 0.00045, 0.55, 7u, 1.0, ph);
  float mid  = lanes(s, 0.0110, 0.45, 0.00095, 1.10, 19u, 2.0, ph);
  float near = lanes(s, 0.0290, 0.30, 0.00260, 1.60, 37u, 3.0, ph);
  float fog = atm.a;
  vec3 sc = vec3(0.55, 0.75, 1.0);
  col += sc*far*(0.35 + 0.8*fog) + vec3(0.75, 0.88, 1.0)*mid*(0.5 + 0.7*fog) + vec3(0.9, 0.95, 1.0)*near;

  for (int i = 0; i < 2; i++){
    if (i >= uFigN) break;
    vec2 q = toFig(px, i);
    vec4 f = figTex(q);
    float d = f.x;
    float pu = 1.0/uFig[i].z;
    float br = 0.9 + 0.2*uBreath + 0.3*uAudio;
    if (d < 0.02){
    float ero = (lvn(q*vec2(120.0, 80.0), 2.5) - 0.5)*0.008;
    float body = smoothstep(pu*1.5 + 0.002, -pu*1.5 - 0.002, d + ero);
    // overexposed core, cooler toward the extremities
    float core = smoothstep(0.0, 0.035, -d);
    float reach = length(q - vec2(0.0, 0.2));
    vec3 hot = mix(vec3(1.0, 0.99, 0.97)*3.2, vec3(0.65, 0.85, 1.0)*2.0, smoothstep(0.15, 0.5, reach));
    vec3 skin = mix(vec3(0.45, 0.70, 1.0)*1.6, hot, core)*br;
    col = mix(col, skin, body);
    }
    float r = max(d, 0.0);
    col += vec3(0.25, 0.55, 1.0)*(exp(-r/0.005)*0.8 + exp(-r/0.020)*0.25)*br;
    // god-rays from the chest
    vec2 rc = q - vec2(0.0, 0.24);
    float ang = atan(rc.y, rc.x);
    float rays = tn(vec2(ang*40.0, 0.0) + LC(1.0))*tn(vec2(ang*13.0, 9.0) + LC(0.6)); rays = rays*rays*3.0;
    col += vec3(0.35, 0.62, 1.0)*rays*exp(-r/0.12)*smoothstep(0.0, 0.02, d)*0.32;
    // falling light petals (baked petal tile, seamless cross-fade)
    float dist = length((q - vec2(0.0, 0.15))*vec2(0.8, 1.0));
    if (dist < 0.8){
      float fa = fract(ph), fb = fract(ph + 0.5);
      float wa = 1.0 - abs(2.0*fa - 1.0);
      vec2 pq = q*9.0;
      float pet = starsF2(pq + vec2(0.0, fa*1.6))*wa + starsF2(pq + vec2(4.3, fb*1.6 + 2.2))*(1.0 - wa);
      col += vec3(0.80, 0.90, 1.0)*pet*smoothstep(0.80, 0.22, dist)*0.9;
      col += vec3(0.7, 0.85, 1.0)*starsF(q*30.0)*smoothstep(0.7, 0.1, dist)*0.5;
    }
  }
  o = vec4(col, 1.0);
}
`;

  // =================================================== III · WIELDER ======
  ATMOS[3] = `
uniform float uDown;
out vec4 o;
void main(){
  vec2 px = gl_FragCoord.xy*uDown;
  float md = uMd;
  vec2 s = (px - 0.5*uRes)/md;
  float yN = px.y/uRes.y;
  vec3 col = mix(vec3(0.0018, 0.0026, 0.0085), vec3(0.0035, 0.0060, 0.020), smoothstep(0.0, 1.0, yN));
  vec2 c = LC(0.5);
  // heavenly beam falling from above toward the hand
  vec2 tip = uFig[0].xy + vec2(0.0, 0.32*uFig[0].z);
  float bx = (px.x - (uFigN > 1 ? 0.5*uRes.x : tip.x))/md;
  float above = (px.y - tip.y)/md;
  float spread = 0.07 + 0.16*max(above, 0.0);
  float ang = atan(bx, max(above + 0.6, 0.05));
  float stri = 0.55 + 0.45*tn(vec2(ang*38.0, 0.0) + LC(0.7));
  float beam = exp(-pow(bx/spread, 2.0))*smoothstep(-0.30, 0.35, above)*stri;
  float n = fbm(vec3(s*vec2(1.6, 0.8) + vec2(0.0, -PH()*0.0), c.x), 4);
  float m = fbm(vec3(s*2.4 + vec2(n), c.y), 4);
  float frost = smoothstep(-0.3, 0.6, m);
  col += vec3(0.04, 0.09, 0.32)*beam*(0.35 + 0.7*frost)*0.55;
  col += vec3(0.006, 0.014, 0.05)*frost*0.7;
  // source glow at the top edge
  float src = exp(-length((px - vec2(uFigN > 1 ? 0.5*uRes.x : tip.x, uRes.y*1.05))/md*vec2(0.9, 1.6))/0.22);
  col += vec3(0.20, 0.34, 0.75)*src*0.45;
  float dmin = 1e9;
  for (int i = 0; i < 2; i++){
    if (i >= uFigN) break;
    dmin = min(dmin, figTex(toFig(px, i)).x*uFig[i].z/md);
  }
  float rr = max(dmin, 0.0);
  col += vec3(0.10, 0.24, 0.80)*(0.35*exp(-rr/0.03) + 0.18*exp(-rr/0.12))*(0.9 + 0.2*uBreath + 0.4*uAudio);
  o = vec4(col, frost);
}
`;
  SCENE[3] = `
uniform sampler2D uAtm;
out vec4 o;
void main(){
  vec2 px = gl_FragCoord.xy;
  float md = uMd;
  float ph = PH();
  vec2 jit = (rnd2(px) - 0.5)*6.0*uPx;
  vec4 atm = texture(uAtm, (px + jit)/uRes);
  vec3 col = atm.rgb;

  // dust motes caught in the beam
  vec2 sp = px/(md*0.06);
  float fa = fract(ph), fb = fract(ph + 0.5);
  float wa = 1.0 - abs(2.0*fa - 1.0);
  float dust = starsS(sp + vec2(0.0, fa*2.0))*wa + starsS(sp + vec2(6.41, fb*2.0 + 3.0))*(1.0 - wa);
  col += vec3(0.6, 0.75, 1.0)*dust*0.45*(0.25 + 4.0*luma(atm.rgb));

  float pitch = 9.0*uPx;
  float lum = 0.0; float rim = 0.0; float bone = 0.0; float fil = 0.0; float halo = 0.0;
  float disp = 0.0;
  float star = 0.0;
  for (int i = 0; i < 2; i++){
    if (i >= uFigN) break;
    vec2 q = toFig(px, i);
    vec4 f = figTex(q);
    float d = f.x;
    float pu = 1.0/uFig[i].z;
    float inside = smoothstep(pu*1.2, -pu*1.2, d);
    float th = smoothstep(0.0, 0.06, -d);
    float wave = lvn(vec2(q.x*7.0, q.y*3.0), 1.5);
    float arm = smoothstep(-0.44, -0.22, q.y);
    float l = inside*(0.26 + 0.30*th + 0.22*wave)*arm;
    float bn = smoothstep(0.003, -0.002, f.y)*inside*arm;
    l += bn*0.55;
    lum = max(lum, l);
    bone = max(bone, bn);
    disp += (l*1.2 + bn*0.8)*pitch*0.9;
    rim = max(rim, exp(-abs(d)/(0.003 + pu))*arm);
    halo = max(halo, exp(-max(d, 0.0)/0.03)*arm);
    // electric filaments hugging the contour
    if (d > -0.02 && d < 0.09){
      for (int k = 0; k < 3; k++){
        float fk = float(k);
        float off = 0.010 + 0.016*fk;
        float wig = (lvn(q*vec2(26.0, 26.0) + vec2(fk*7.1, 0.0), 1.8) - 0.5)*0.030 + (lvn(q*90.0 + vec2(0.0, fk*3.3), 1.2) - 0.5)*0.008;
        float line = exp(-abs(d - off + wig)/(0.0016 + pu*0.8));
        float gate = smoothstep(0.45, 0.75, lvn(q*vec2(9.0, 9.0) + vec2(fk*13.0, 0.0), 1.0 + fk*0.5));
        fil += line*gate*(0.9 - 0.25*fk)*arm;
      }
    }
    // the light held in the palm
    vec2 sd = (q - vec2(0.010, -0.030))*uFig[i].z/uPx;
    float pulse = 0.75 + 0.25*sin(TAU*ph*2.0) + 0.3*uAudio;
    float rr = length(sd);
    star += (exp(-rr/10.0)*0.9 + exp(-rr/34.0)*0.22 + heroStar(sd, 3.5, 110.0)*0.55)*pulse;
    float ang = atan(sd.y, sd.x);
    float rays = pow(tn(vec2(ang*30.0, 0.0) + LC(1.0)), 4.0)*exp(-rr/110.0)*smoothstep(4.0, 30.0, rr);
    star += rays*0.9*pulse;
  }

  // raster scanlines: lines rise where the hand is, like a scanned waveform
  float wv = sin(px.x/(31.0*uPx) + TAU*ph*2.0 + px.y/(57.0*uPx));
  float y2 = px.y + disp + lum*wv*pitch*0.22;
  float fy = fract(y2/pitch);
  float lw = mix(0.06, 0.24, clamp(lum*1.5, 0.0, 1.0));
  float line = smoothstep(lw + 0.07, lw - 0.03, abs(fy - 0.5));
  float gapN = tn(vec2(px.x/(9.0*uPx), floor(y2/pitch)*1.7) + LC(4.0));
  float breaks = mix(1.0, smoothstep(0.18, 0.4, gapN), 0.8);
  vec3 cream = vec3(0.98, 0.95, 0.88);
  vec3 ice = vec3(0.55, 0.72, 1.0);
  vec3 hand = mix(ice, cream, smoothstep(0.25, 0.8, lum))*line*lum*1.25*breaks;
  hand += cream*bone*line*0.8;
  // soft flesh between the lines so the hand keeps its volume
  hand += mix(ice, cream, 0.3)*lum*0.10;
  col += hand;
  col += mix(ice, cream, 0.4)*rim*0.40;
  col += vec3(0.25, 0.45, 1.0)*halo*0.16;
  col += vec3(0.85, 0.92, 1.0)*fil*0.70;
  col += vec3(1.0, 0.96, 0.90)*star*0.9;
  // faint CRT raster across the whole field
  col += vec3(0.06, 0.09, 0.20)*line*0.06*(1.0 - lum);
  o = vec4(col, 1.0);
}
`;

  // ===================================================== IV · SAVED =======
  // Rendered as light; the post pass prints it as ultramarine halftone on paper.
  ATMOS[4] = `
uniform float uDown;
out vec4 o;
void main(){
  vec2 px = gl_FragCoord.xy*uDown;
  float md = uMd;
  vec2 s = (px - 0.5*uRes)/md;
  vec2 c = LC(0.5);
  vec3 col = vec3(0.0030, 0.0050, 0.024);
  // cobalt washes (oil-paint melt)
  float n1 = fbm(vec3(s*1.1 + vec2(2.0, 5.0), c.x), 4);
  float n2 = fbm(vec3(s*1.1 + vec2(7.0, 1.0), c.y), 4);
  float w = fbm(vec3(s*vec2(1.6, 1.0) + 1.7*vec2(n1, n2), 0.5*(c.x + c.y)), 5);
  float wash = smoothstep(-0.12, 0.50, w);
  col += vec3(0.02, 0.08, 0.40)*wash*0.38;
  float dmin = 1e9;
  for (int i = 0; i < 2; i++){
    if (i >= uFigN) break;
    dmin = min(dmin, figTex(toFig(px, i)).x*uFig[i].z/md);
  }
  float rr = max(dmin, 0.0);
  float br = 0.9 + 0.2*uBreath + 0.3*uAudio;
  col += vec3(0.10, 0.35, 1.0)*(0.45*exp(-rr/0.018) + 0.20*exp(-rr/0.070) + 0.06*exp(-rr/0.25))*br;
  o = vec4(col, wash);
}
`;
  SCENE[4] = `
uniform sampler2D uAtm;
out vec4 o;
void main(){
  vec2 px = gl_FragCoord.xy;
  float md = uMd;
  float ph = PH();
  vec2 jit = (rnd2(px) - 0.5)*6.0*uPx;
  vec4 atm = texture(uAtm, (px + jit)/uRes);
  vec3 col = atm.rgb;
  float knock = 0.0;
  for (int i = 0; i < 2; i++){
    if (i >= uFigN) break;
    vec2 q = toFig(px, i);
    vec4 f = figTex(q);
    float d = f.x;
    float pu = 1.0/uFig[i].z;
    float ero = (lvn(q*vec2(110.0, 140.0), 2.0) - 0.5)*0.004;
    float body = smoothstep(pu*1.5 + 0.002, -pu*1.5 - 0.002, d + ero);
    float br = 0.9 + 0.2*uBreath + 0.3*uAudio;
    float core = smoothstep(0.0, 0.03, -d);
    vec3 skin = mix(vec3(0.5, 0.8, 1.0)*1.4, vec3(1.0, 0.98, 0.95)*2.6, core)*br;
    // knock-out stars: the body is a sky
    float st = starsF(q*30.0);
    knock = max(knock, body*(1.0 - clamp(st*1.4, 0.0, 0.95)));
    col = mix(col, skin, body);
    float r = max(d, 0.0);
    col += vec3(0.20, 0.55, 1.0)*(exp(-r/0.006)*0.55 + exp(-r/0.025)*0.20)*br;
    // vertical light smears above and below (streaky columns, slowly flowing)
    float colA = lvn(vec2(q.x*95.0, 0.0), 2.0);
    float colB = lvn(vec2(q.x*31.0, 4.0), 1.0);
    float cols = pow(colA*colB, 1.5)*2.4;
    float streak = (f.z + f.w)*cols*smoothstep(0.0, 0.015, d);
    float flow = 0.7 + 0.3*sin(TAU*(ph + q.x*3.0));
    col += vec3(0.30, 0.62, 1.0)*streak*flow*1.6;
  }
  o = vec4(col, knock);
}
`;

  // ---------------------------------------------------------------- bloom --
  const BLOOM_DOWN = `${HEAD}
uniform sampler2D uSrc; uniform vec2 uSrcTexel; uniform float uPrefilter;
out vec4 o;
void main(){
  vec2 uv = (gl_FragCoord.xy*2.0)*uSrcTexel;
  vec2 h = uSrcTexel;
  vec3 c = texture(uSrc, uv).rgb*4.0;
  c += texture(uSrc, uv + vec2(-h.x, -h.y)).rgb;
  c += texture(uSrc, uv + vec2( h.x, -h.y)).rgb;
  c += texture(uSrc, uv + vec2(-h.x,  h.y)).rgb;
  c += texture(uSrc, uv + vec2( h.x,  h.y)).rgb;
  c *= 0.125;
  if (uPrefilter > 0.5){ c = min(c, vec3(24.0)); float l = max(c.r, max(c.g, c.b)); c *= smoothstep(0.25, 1.4, l); }
  o = vec4(c, 1.0);
}
`;
  const BLOOM_UP = `${HEAD}
uniform sampler2D uSrc; uniform sampler2D uBase; uniform vec2 uSrcTexel; uniform float uMixBase;
out vec4 o;
void main(){
  vec2 uv = gl_FragCoord.xy/vec2(textureSize(uBase, 0));
  vec2 h = uSrcTexel*0.5;
  vec3 c = vec3(0.0);
  c += texture(uSrc, uv + vec2(-h.x*2.0, 0.0)).rgb;
  c += texture(uSrc, uv + vec2(-h.x, h.y)).rgb*2.0;
  c += texture(uSrc, uv + vec2(0.0, h.y*2.0)).rgb;
  c += texture(uSrc, uv + vec2(h.x, h.y)).rgb*2.0;
  c += texture(uSrc, uv + vec2(h.x*2.0, 0.0)).rgb;
  c += texture(uSrc, uv + vec2(h.x, -h.y)).rgb*2.0;
  c += texture(uSrc, uv + vec2(0.0, -h.y*2.0)).rgb;
  c += texture(uSrc, uv + vec2(-h.x, -h.y)).rgb*2.0;
  c /= 12.0;
  o = vec4(c + texture(uBase, uv).rgb*uMixBase, 1.0);
}
`;

  // ----------------------------------------------------------------- post --
  const POST = `${HEAD}
uniform vec2  uRes;
uniform float uPx;
uniform float uMd;
uniform float uFrame;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform sampler2D uBloomWide;
uniform sampler2D uText;
uniform float uGlitch;
uniform float uGSeed;
uniform float uBloomAmt;
uniform float uExposure;
uniform float uCA;
uniform float uGrain;
uniform float uGrainSize;
uniform float uScan;
uniform float uVig;
uniform int   uMode;
uniform vec3  uInk;
uniform vec3  uInk2;
uniform vec3  uPaper;
uniform vec3  uTextCol;
uniform float uTextOp;
uniform float uDot;
uniform float uFlipY;
uniform sampler2D uGrainTex;
uniform sampler2D uAtmP;
out vec4 o;

uint pcg(uint v){ uint s = v*747796405u + 2891336453u; uint w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u; return (w >> 22u) ^ w; }
float u2f(uint h){ return float(h >> 8u)*(1.0/16777216.0); }
float h2(vec2 p, uint s){ return u2f(pcg(uint(int(p.x))*1597334677u ^ pcg(uint(int(p.y))*3812015801u ^ s))); }
float vn(vec2 p, uint s){ vec2 i = floor(p); vec2 f = fract(p); vec2 u = f*f*(3.0 - 2.0*f);
  return mix(mix(h2(i, s), h2(i + vec2(1, 0), s), u.x), mix(h2(i + vec2(0, 1), s), h2(i + vec2(1, 1), s), u.x), u.y); }

vec3 hdr(vec2 uv){ return texture(uScene, uv).rgb + uBloomAmt*texture(uBloom, uv).rgb; }
vec3 scn(vec2 uv){ return texture(uScene, uv).rgb; }
vec3 tone(vec3 x){
  x *= uExposure;
  vec3 y = 1.0 - exp(-x);
  float l = dot(x, vec3(0.2126, 0.7152, 0.0722));
  float w = smoothstep(0.9, 5.0, l);
  return mix(y, vec3(1.0 - exp(-l*0.9)), w*0.75);
}
// fast sRGB encode (Taylor, <0.1% error)
vec3 toSRGB(vec3 c){ c = clamp(c, 0.0, 1.0); vec3 s1 = sqrt(c), s2 = sqrt(s1), s3 = sqrt(s2); return clamp(0.662002687*s1 + 0.684122060*s2 - 0.323583601*s3 - 0.0225411470*c, 0.0, 1.0); }

// halftone print of a light image: ink = light
vec3 halftone(vec2 px, vec2 uvOff, float pitch, vec3 bg, vec3 ink, vec3 ink2, float gain, bool knock){
  vec2 cell = floor(px/pitch) + 0.5;
  vec2 cpx = cell*pitch;
  vec2 cuv = cpx/uRes + uvOff;
  vec3 c = tone(texture(uScene, cuv).rgb*0.6 + texture(uBloomWide, cuv).rgb*uBloomAmt*0.9);
  float L = clamp(dot(c, vec3(0.3, 0.55, 0.15))*gain, 0.0, 1.0);
  float jit = (h2(cell, 7u) - 0.5)*0.08;
  float cov = clamp(L + jit*L, 0.0, 1.0);
  if (knock) cov = pow(smoothstep(0.035, 0.95, cov), 0.85);
  float r = sqrt(cov)*pitch*0.72;
  float aa = 0.8;
  float dd = length(px - cpx);
  float dotA = smoothstep(r + aa, r - aa, dd);
  // misregistered second plate
  vec2 off = vec2(1.6, -1.1)*uPx;
  float dd2 = length(px - off - cpx);
  float dotB = smoothstep(r*0.92 + aa, r*0.92 - aa, dd2);
  vec3 col = bg;
  col = mix(col, ink2, dotB*0.35);
  col = mix(col, ink, dotA);
  return col;
}

void main(){
  vec2 px = gl_FragCoord.xy;
  if (uFlipY > 0.5) px.y = uRes.y - px.y;
  vec2 uv = px/uRes;
  float g = uGlitch;
  uint gs = uint(int(uGSeed));

  // ---- glitch: quantized band tears, block shifts, frame jump
  vec2 duv = vec2(0.0);
  float reveal = 0.0;
  float bandEdge = 0.0;
  if (g > 0.001){
    float rowA = floor(uv.y*7.0 + h2(vec2(1.0), gs)*3.0);
    float rowB = floor(uv.y*38.0);
    float rowC = floor(uv.y*160.0);
    float onA = step(1.0 - 0.42*g, h2(vec2(rowA, 3.0), gs));
    float onB = step(1.0 - 0.30*g, h2(vec2(rowB, 5.0), gs));
    float onC = step(1.0 - 0.18*g, h2(vec2(rowC, 9.0), gs));
    float sh = onA*(h2(vec2(rowA, 11.0), gs) - 0.5)*0.16 + onB*(h2(vec2(rowB, 13.0), gs) - 0.5)*0.05 + onC*(h2(vec2(rowC, 17.0), gs) - 0.5)*0.02;
    float q = 8.0*uPx/uRes.x;
    duv.x = floor(sh*g/q + 0.5)*q;
    reveal = onA*step(0.45, h2(vec2(rowA, 19.0), gs));
    // block mosaic (bitmap poster blocks)
    vec2 blk = floor(uv*vec2(12.0, 22.0));
    float bOn = step(1.0 - 0.10*g, h2(blk, gs ^ 0x55u))*step(0.35, g)*max(onB, onA*0.5);
    duv += bOn*(vec2(h2(blk, gs ^ 0x77u), h2(blk, gs ^ 0x99u)) - 0.5)*vec2(0.06, 0.01);
    reveal = max(reveal, bOn*0.999);
    if (h2(vec2(2.0), gs) > 0.75) duv.y += 0.006*g;
    float fy = fract(uv.y*7.0 + h2(vec2(1.0), gs)*3.0);
    bandEdge = onA*(smoothstep(0.0, 0.004, fy)*0.0 + exp(-fy*uRes.y/(1.5*uPx)))*g;
  }
  vec2 suv = uv + duv;

  // ---- chromatic aberration (radial lens + glitch split)
  // radial lens split, normalised so every aspect ratio peaks at the same strength
  float md = uMd;
  vec2 cd = (suv - 0.5)*uRes/(0.5*length(uRes))*0.7;
  float ca = uCA*(0.35 + 2.2*dot(cd, cd)) + g*0.0035*(1.0 + 2.0*reveal);
  vec2 offc = cd*ca*md/uRes + vec2(g*0.004*(h2(vec2(4.0), gs) - 0.3), 0.0);
  vec3 c = vec3(scn(suv + offc).r, scn(suv).g, scn(suv - offc).b) + uBloomAmt*texture(uBloom, suv).rgb;
  vec3 col = tone(c);

  float pitch = uDot;
  if (uMode == 1){
    // SAVED: printed light on off-white paper; the glitch reveals the night underneath
    float wash = texture(uAtmP, suv).a;
    vec3 paper = uPaper*(1.0 - 0.05*wash) - vec3(0.012, 0.008, 0.0)*vn(px/(2.2*uPx), 3u);
    paper = mix(paper, mix(uPaper, uInk2, 0.42), smoothstep(0.05, 0.95, wash)*0.30);
    vec3 printed = halftone(px + duv*uRes, offc*0.5, pitch, paper, uInk, uInk2, 1.15, true);
    // the figure: solid ink, knocked-out stars, a slipped second plate
    float bodyA = texture(uScene, suv).a;
    float bodyB = texture(uScene, suv - vec2(2.2, -1.6)*uPx/uRes).a;
    printed = mix(printed, mix(paper, uInk2, 0.55), bodyB*(1.0 - bodyA)*0.8);
    printed = mix(printed, uInk, bodyA);
    col = mix(printed, col, reveal);
  } else {
    // dark designs: glitch bands expose the dot-matrix beneath the light
    if (reveal > 0.0){
      vec3 matrix = halftone(px + duv*uRes, vec2(0.0), pitch*0.75, vec3(0.002, 0.004, 0.02), vec3(0.75, 0.88, 1.0), vec3(0.2, 0.4, 1.0), 1.6, false);
      col = mix(col, matrix, reveal);
    }
  }
  col += vec3(0.55, 0.75, 1.0)*bandEdge*0.6;

  // ---- type (with its own chromatic split)
  if (textureLod(uText, suv, 4.0).a > 0.0){
    vec2 to = offc*0.35 + vec2(0.9*uPx/uRes.x, 0.0);
    vec3 ta = vec3(texture(uText, suv + to).a, texture(uText, suv).a, texture(uText, suv - to).a)*uTextOp;
    col = mix(col, uTextCol, ta);
  }

  // ---- 90s display texture: scanlines + aperture grille (subtle)
  float sl = 0.5 + 0.5*cos(px.y*TAU_INV_PITCH);
  col *= 1.0 - (uScan + g*0.12)*sl;

  // ---- vignette
  vec2 vq = (uv - 0.5)*vec2(uRes.x/uRes.y, 1.0);
  float vig = 1.0 - uVig*smoothstep(0.35, 1.25, length(vq));
  col *= vig;

  // ---- grain (clumped film grain, a touch of chroma)
  vec3 sr = toSRGB(col);
  uint fs = uint(int(mod(uFrame, 997.0)))*7919u + 1u;
  vec2 go = vec2(u2f(pcg(fs)), u2f(pcg(fs + 1u)))*512.0;
  vec2 gp = px/(uGrainSize*uPx);
  vec4 g1 = texture(uGrainTex, (gp + go)/512.0);
  vec4 g2 = texture(uGrainTex, (gp*2.1 + go.yx + 17.0)/512.0);
  float n = (g1.r + g2.g*0.6)/1.6 - 0.5;
  vec3 cn = vec3(g1.b, g1.a, g2.b) - 0.5;
  float l = dot(sr, vec3(0.299, 0.587, 0.114));
  float amp = uGrain*(0.55 + 1.6*l*(1.0 - l))*1.7;
  sr += (n*amp + cn*amp*0.45);
  sr += (g2.a - 0.5)/255.0;
  o = vec4(clamp(sr, 0.0, 1.0), 1.0);
}
`.replace('TAU_INV_PITCH', '(6.28318530718/(3.0*uPx))').replace('#version 300 es\nprecision highp float;', '#version 300 es\nprecision highp float;\n#define TAU 6.28318530718');

  // ------------------------------------------------------------- designs ---
  const DESIGNS = {
    1: { key: 'ghost', numeral: 'I', title: 'GHOST', word: 'ambient, ghostly', pose: 1, box: 0.62, smear: 0.32,
         bloom: 0.85, exposure: 1.05, ca: 0.0018, grain: 0.085, grainSize: 1.35, scan: 0.025, vig: 0.38,
         mode: 0, text: [0.93, 0.91, 0.86], textOp: 0.55, dot: 1.0 / 92 },
    2: { key: 'illusion', numeral: 'II', title: 'ILLUSION', word: 'break the illusion', pose: 2, box: 0.62, smear: 0.2,
         bloom: 1.0, exposure: 1.0, ca: 0.0028, grain: 0.07, grainSize: 1.2, scan: 0.03, vig: 0.45,
         mode: 0, text: [0.93, 0.91, 0.86], textOp: 0.5, dot: 1.0 / 92 },
    3: { key: 'wielder', numeral: 'III', title: 'WIELDER', word: 'tech cyber wielder', pose: 3, box: 1.2, smear: 0.2,
         bloom: 0.9, exposure: 1.0, ca: 0.0022, grain: 0.065, grainSize: 1.2, scan: 0.02, vig: 0.4,
         mode: 0, text: [0.93, 0.91, 0.86], textOp: 0.5, dot: 1.0 / 92 },
    4: { key: 'saved', numeral: 'IV', title: 'SAVED', word: 'saved', pose: 4, box: 0.95, smear: 0.85,
         bloom: 0.7, exposure: 1.0, ca: 0.0014, grain: 0.055, grainSize: 1.3, scan: 0.0, vig: 0.12,
         mode: 1, text: [0.08, 0.11, 0.36], textOp: 0.82, dot: 1.0 / 96,
         paper: [0.929, 0.914, 0.878], ink: [0.098, 0.165, 0.600], ink2: [0.24, 0.50, 0.92] },
  };

  // Figure placement for any aspect ratio. Coordinates: px, origin bottom-left.
  function layoutFor(design, W, H, duo) {
    const a = W / H;
    const t = Math.min(1, Math.max(0, (a - 0.45) / (1.6 - 0.45)));
    const lerp = (x, y) => x + (y - x) * t;
    const figs = [];
    const halfW = duo ? W / 2 : W;
    const ah = halfW / H;
    const th = Math.min(1, Math.max(0, (ah - 0.45) / (1.6 - 0.45)));
    const lh = (x, y) => x + (y - x) * th;
    const centers = duo ? [W * 0.25, W * 0.75] : [W * 0.5];
    centers.forEach((cx, i) => {
      let flip = duo && i === 1 ? -1 : 1;
      if (duo && design === 4) flip = -flip;
      if (design === 1) {
        const s = Math.min(H * lh(0.47, 0.64), halfW * 1.55);
        figs.push({ x: cx, y: H * lh(0.415, 0.465), s, r: 0, flip });
      } else if (design === 2) {
        const s = Math.min(H * lh(0.46, 0.68), halfW * 0.93);
        figs.push({ x: cx, y: H * lh(0.445, 0.47), s, r: 0, flip });
      } else if (design === 3) {
        const s = Math.min(H * lh(0.58, 1.0), halfW * 1.45);
        let r = -0.07, x = cx, y = H * lh(0.425, 0.30);
        if (duo) { r = i === 0 ? -0.42 : 0.42; x = i === 0 ? W * 0.30 : W * 0.70; y = H * 0.36; }
        figs.push({ x, y, s, r: duo && i === 1 ? -r : r, flip });
      } else {
        const s = Math.min(halfW * lh(0.86, 0.56), H * 0.88);
        figs.push({ x: cx, y: H * lh(0.47, 0.47), s, r: 0, flip });
      }
    });
    // duo: mirror the second figure toward the seam
    if (duo && design === 3) { figs[1].r = 0.42; figs[0].r = -0.42; }
    return { figs, duo: !!duo };
  }

  // ---------------------------------------------------------------- type ---
  let fontsLoading = null;
  function loadFonts() {
    const F = global.QATSEL_FONTS;
    if (!F || !global.FontFace) return Promise.resolve();
    if (!fontsLoading) {
      fontsLoading = Promise.all(Object.keys(F).map(async (name) => {
        const f = new FontFace(name, `url(${F[name].src})`, { weight: F[name].weight, style: F[name].style });
        await f.load();
        document.fonts.add(f);
      }));
    }
    return fontsLoading;
  }

  function spaced(ctx, text, x, y, track, align) {
    // manual letter-spacing (consistent across engines)
    let w = 0;
    const ws = [];
    for (const ch of text) { const m = ctx.measureText(ch).width; ws.push(m); w += m + track; }
    w -= track;
    let cx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    let i = 0;
    const prev = ctx.textAlign; ctx.textAlign = 'left';
    for (const ch of text) { ctx.fillText(ch, cx, y); cx += ws[i++] + track; }
    ctx.textAlign = prev;
    return w;
  }

  function drawType(ctx, design, W, H, layout, opts) {
    const D = DESIGNS[design];
    const u = (layout.duo ? Math.min(W / 2, H) : Math.min(W, H)) / 1320;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'alphabetic';
    const mono = (s, w = 400) => `${w === 300 ? '' : ''}${s * u}px ${w === 300 ? 'QatselMonoLight' : 'QatselMono'}`;
    const serif = (s) => `italic ${s * u}px QatselSerif`;
    const sans = (s, w = 700) => `${w} ${s * u}px QatselSans`;

    const panels = layout.duo ? [[0, W / 2], [W / 2, W / 2]] : [[0, W]];
    panels.forEach(([x0, pw], pi) => {
      const cx = x0 + pw / 2;
      const isP = pw / H < 0.9;
      // ---- Off-White-style label block
      let lx = cx, ly = H * (isP ? 0.885 : 0.86), align = 'center';
      if (!isP) { lx = x0 + pw - 120 * u; align = 'right'; ly = H * 0.875; }
      ctx.save();
      ctx.translate(lx, ly);
      ctx.font = serif(25);
      const ww = ctx.measureText(D.word).width;
      ctx.font = sans(30);
      const tw = ctx.measureText('QATSEL').width;
      const bx = align === 'center' ? -tw / 2 : -tw - 30 * u - ww;
      ctx.textAlign = 'left';
      ctx.fillText('QATSEL', bx, 0);
      ctx.font = sans(11, 500);
      ctx.fillText('™', bx + tw + 2 * u, -18 * u);
      ctx.font = mono(11);
      spaced(ctx, `${D.numeral}—IV`, bx - 26 * u, -2 * u, 1.5 * u, 'right');
      ctx.save();
      ctx.translate(bx + tw + 30 * u, 6 * u);
      ctx.rotate(-0.09);
      ctx.font = serif(25);
      ctx.fillText(D.word, 0, 0);
      ctx.restore();
      ctx.font = serif(22);
      ctx.textAlign = 'center';
      ctx.fillText('eternal life', bx + tw / 2, 34 * u);
      ctx.restore();

      // ---- quoted title, mono, above the label
      ctx.font = mono(11);
      const qy = ly - 64 * u;
      spaced(ctx, `“${D.title}”`, align === 'center' ? cx : lx - ww - 30 * u - tw / 2, qy, 3.2 * u, 'center');

      // ---- vertical edge lines
      const edge = 46 * u;
      ctx.save();
      ctx.translate(x0 + edge, H * 0.5);
      ctx.rotate(-Math.PI / 2);
      ctx.font = mono(10.5);
      spaced(ctx, 'QUIET AMBIENT TECHNO SOUL OF ETERNAL LIFE', 0, 0, 3.4 * u, 'center');
      ctx.restore();
      ctx.save();
      ctx.translate(x0 + pw - edge, H * 0.5);
      ctx.rotate(Math.PI / 2);
      ctx.font = mono(10.5);
      const right = ['SYS.SOUL//∞  λ452NM  REC ●', 'SIGNAL 00:00:00:01  f/1.0', 'HOPEFUL TO ACHIEVE DREAMS', 'CAPABLE OF ACHIEVING ALL DREAMS'][design - 1];
      spaced(ctx, right, 0, 0, 3.4 * u, 'center');
      ctx.restore();

      // ---- tiny registration marks
      const m = 8 * u;
      const marks = isP ? [[x0 + pw * 0.5, H * 0.955]] : [[x0 + 64 * u, H - 64 * u], [x0 + pw - 64 * u, 64 * u]];
      ctx.lineWidth = Math.max(1, 1.2 * u);
      ctx.strokeStyle = '#fff';
      marks.forEach(([mx, my]) => {
        ctx.beginPath();
        ctx.moveTo(mx - m, my); ctx.lineTo(mx + m, my);
        ctx.moveTo(mx, my - m); ctx.lineTo(mx, my + m);
        ctx.stroke();
      });
      if (layout.duo) {
        ctx.font = mono(10);
        spaced(ctx, pi === 0 ? '01 / 02' : '02 / 02', cx, H * 0.955 + 26 * u, 3 * u, 'center');
      }
    });
  }

  // -------------------------------------------------------------- renderer --
  function makeGL(canvas) {
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, stencil: false, premultipliedAlpha: false, preserveDrawingBuffer: false, powerPreference: 'high-performance' });
    if (!gl) throw new Error('WebGL2 not available');
    const ext = gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float');
    gl.getExtension('OES_texture_float_linear');
    return { gl, floatRT: !!ext };
  }

  function compile(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(sh);
      const lines = src.split('\n').map((l, i) => `${i + 1}: ${l}`).join('\n');
      throw new Error(`Shader compile error:\n${log}\n${lines.slice(0, 200000)}`);
    }
    return sh;
  }
  function program(gl, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VS));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'aPos');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    const loc = {};
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(p, i);
      const name = info.name.replace(/\[0\]$/, '');
      loc[name] = gl.getUniformLocation(p, info.name);
    }
    return { p, loc };
  }

  function target(gl, w, h, float, filter) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    if (float) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter || gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter || gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fb, w, h };
  }

  const lin = (c) => c.map((v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));

  function hashJS(n) {
    let x = (n | 0) * 747796405 + 2891336453;
    x = Math.imul(((x >>> ((x >>> 28) + 4)) ^ x), 277803737);
    x = (x >>> 22) ^ x;
    return (x >>> 0) / 4294967296;
  }

  // One glitch event of age x seconds: sharp attack, stepped (15 Hz) decay, then an aftershock.
  function glitchEvent(x, amp, seed) {
    const parts = [{ t0: 0, dur: 0.72, amp, seed }, { t0: 1.25, dur: 0.18, amp: amp * 0.45, seed: seed + 74 }];
    let g = 0;
    for (const e of parts) {
      const dx = x - e.t0;
      if (dx < 0 || dx > e.dur) continue;
      const u = dx / e.dur;
      const r = hashJS(Math.floor(dx * 15) * 31 + e.seed);
      const env = u < 0.07 ? u / 0.07 : Math.pow(1 - (u - 0.07) / 0.93, 1.4);
      g = Math.max(g, e.amp * env * (0.4 + 0.6 * r));
    }
    return g;
  }
  // Glitch schedule for a seamless loop: one event per loop at phase `at`.
  function glitchAt(t, loop, at, amp) { return glitchEvent(t - at * loop, amp, 17); }

  class Engine {
    constructor(canvas, opts = {}) {
      this.canvas = canvas;
      const { gl, floatRT } = makeGL(canvas);
      // the figure field and HDR light need half-float targets; without them the image would be wrong, so refuse
      if (!floatRT) throw new Error('QATSEL needs WebGL2 half-float render targets');
      this.gl = gl;
      this.float = floatRT;
      this.opts = Object.assign({ design: 1, width: 1320, height: 2868, duo: false, loop: 10, scale: 1, glitchAt: 0.42, glitchAmp: 1, offscreen: false, typeOpacity: 1, strips: 1, grainScale: 1, grainHold: 1 }, opts);
      this.vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      this.progs = {};
      this.bakeSDF = program(gl, BAKE_SDF);
      this.bakeSmear = program(gl, BAKE_SMEAR);
      this.bakeTile = program(gl, BAKE_TILE);
      this.bakeGrainP = program(gl, BAKE_GRAIN);
      this.down = program(gl, BLOOM_DOWN);
      this.up = program(gl, BLOOM_UP);
      this.post = program(gl, POST);
      this.textCanvas = document.createElement('canvas');
      this.textTex = gl.createTexture();
      this.audio = 0;
      this.glitchOverride = null;
    }

    designProgs(d) {
      if (!this.progs[d]) {
        this.progs[d] = {
          atmos: program(this.gl, HEAD + COMMON + ATMOS[d]),
          scene: program(this.gl, HEAD + COMMON + SCENE[d]),
        };
      }
      return this.progs[d];
    }

    configure(o) {
      Object.assign(this.opts, o);
      const gl = this.gl;
      const { width: W, height: H, design } = this.opts;
      const sc = this.opts.scale;
      const w = Math.max(16, Math.round(W * sc)), h = Math.max(16, Math.round(H * sc));
      this.W = w; this.H = h;
      if (!this.opts.offscreen) { this.canvas.width = w; this.canvas.height = h; }
      const D = DESIGNS[design];
      this.D = D;
      this.layout = layoutFor(design, w, h, this.opts.duo);
      this.md = this.opts.duo ? Math.min(w / 2, h) : Math.min(w, h);
      // targets
      const F = this.float;
      const free = (t) => { if (t) { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fb); } };
      [this.atm, this.scene, this.out].forEach(free);
      (this.bloomDown || []).forEach(free); (this.bloomUp || []).forEach(free);
      this.atm = target(gl, Math.ceil(w / 4), Math.ceil(h / 4), F);
      this.scene = target(gl, w, h, F);
      this.bloomDown = []; this.bloomUp = [];
      let bw = w, bh = h;
      for (let i = 0; i < 7; i++) {
        bw = Math.max(1, Math.ceil(bw / 2)); bh = Math.max(1, Math.ceil(bh / 2));
        this.bloomDown.push(target(gl, bw, bh, F));
        if (i < 6) this.bloomUp.push(target(gl, bw, bh, F));
      }
      this.out = this.opts.offscreen ? target(gl, w, h, false, gl.NEAREST) : null;
      this.bake(D);
      this.bakeTiles();
      this.bakeGrain();
      this.drawText();
      this.designProgs(design);
    }

    bake(D) {
      const gl = this.gl;
      const N = 2048;
      const key = `${D.pose}`;
      if (this.bakedKey === key) return;
      if (this.figA) { gl.deleteTexture(this.figA.tex); gl.deleteFramebuffer(this.figA.fb); gl.deleteTexture(this.fig.tex); gl.deleteFramebuffer(this.fig.fb); }
      this.figA = target(gl, N, N, this.float);
      this.fig = target(gl, N, N, this.float);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.figA.fb);
      gl.viewport(0, 0, N, N);
      gl.useProgram(this.bakeSDF.p);
      gl.uniform2f(this.bakeSDF.loc.uBakeRes, N, N);
      gl.uniform1f(this.bakeSDF.loc.uBox, D.box);
      gl.uniform1i(this.bakeSDF.loc.uPose, D.pose);
      this.strips(N, N);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fig.fb);
      gl.useProgram(this.bakeSmear.p);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.figA.tex);
      gl.uniform1i(this.bakeSmear.loc.uSrc, 0);
      gl.uniform2f(this.bakeSmear.loc.uBakeRes, N, N);
      gl.uniform1f(this.bakeSmear.loc.uBox, D.box);
      gl.uniform1f(this.bakeSmear.loc.uLen, D.smear);
      this.strips(N, N);
      this.bakedKey = key;
    }

    bakeTiles() {
      const gl = this.gl, D = this.D;
      const md = this.md, uPx = md / 1320;
      const f0 = this.layout.figs[0];
      const key = `${this.W}x${this.H}:${D.key}:${f0.s.toFixed(1)}`;
      if (this.tileKey === key) return;
      const mk = (cells, pxPerCell, A, B) => {
        const T = Math.min(2048, Math.max(256, Math.round(cells * pxPerCell)));
        const t = target(gl, T, T, this.float);
        gl.bindFramebuffer(gl.FRAMEBUFFER, t.fb);
        gl.viewport(0, 0, T, T);
        gl.useProgram(this.bakeTile.p);
        gl.uniform2f(this.bakeTile.loc.uBakeRes, T, T);
        gl.uniform1f(this.bakeTile.loc.uCells, cells);
        gl.uniform1f(this.bakeTile.loc.uRefPx, uPx * (T / (cells * pxPerCell)));
        gl.uniform4fv(this.bakeTile.loc.uA, A);
        gl.uniform4fv(this.bakeTile.loc.uB, B);
        this.strips(T, T);
        gl.bindTexture(gl.TEXTURE_2D, t.tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        return t;
      };
      const free = (t) => { if (t) { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fb); } };
      free(this.tileS); free(this.tileF);
      // screen tile: A = drifting dust (cell = 5.5% of the short side), B = fine field
      this.tileSCells = 16;
      this.tileS = mk(16, md * 0.055, [0.22, 0.6, 11, 0], [0.10, 0.0, 47, 0]);
      // figure tile: A = body stars (cell = 1/28 figure height), B = petals or sparse stars
      this.tileFCells = 24;
      const petal = D.key === 'illusion';
      this.tileF = mk(24, f0.s / 28, [0.42, 1.0, 101, 0], petal ? [0.16, 1.0, 211, 1] : [0.30, 0.4, 151, 0]);
      this.tileKey = key;
    }

    bakeGrain() {
      if (this.grain) return;
      const gl = this.gl;
      this.grain = target(gl, 512, 512, false);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.grain.fb);
      gl.viewport(0, 0, 512, 512);
      gl.useProgram(this.bakeGrainP.p);
      gl.uniform2f(this.bakeGrainP.loc.uBakeRes, 512, 512);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindTexture(gl.TEXTURE_2D, this.grain.tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }

    strips(w, h) {
      const gl = this.gl;
      const n = this.opts.strips | 0;
      if (n <= 1) { gl.drawArrays(gl.TRIANGLES, 0, 3); return; }
      gl.enable(gl.SCISSOR_TEST);
      const sh = Math.ceil(h / n);
      for (let i = 0; i < n; i++) {
        gl.scissor(0, i * sh, w, sh);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.flush();
      }
      gl.disable(gl.SCISSOR_TEST);
    }

    drawText() {
      const gl = this.gl;
      const c = this.textCanvas;
      c.width = this.W; c.height = this.H;
      const ctx = c.getContext('2d');
      if (this.opts.typeOpacity > 0) drawType(ctx, this.opts.design, this.W, this.H, this.layout, this.opts);
      else ctx.clearRect(0, 0, c.width, c.height);
      gl.bindTexture(gl.TEXTURE_2D, this.textTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    common(pr, t, frame) {
      const gl = this.gl, L = pr.loc, o = this.opts;
      const W = this.W, H = this.H;
      gl.uniform2f(L.uRes, W, H);
      gl.uniform1f(L.uTime, ((t % o.loop) + o.loop) % o.loop);
      gl.uniform1f(L.uLoop, o.loop);
      gl.uniform1f(L.uFrame, frame);
      gl.uniform1f(L.uPx, this.md / 1320);
      gl.uniform1f(L.uMd, this.md);
      const ph = (((t % o.loop) + o.loop) % o.loop) / o.loop;
      gl.uniform1f(L.uBreath, 0.5 + 0.5 * Math.sin(Math.PI * 2 * ph * 2));
      gl.uniform1f(L.uAudio, this.audio || 0);
      const figs = this.layout.figs;
      const fv = new Float32Array(8), fl = new Float32Array(2);
      figs.forEach((f, i) => { fv.set([f.x, f.y, f.s, f.r], i * 4); fl[i] = f.flip; });
      if (L.uFig) gl.uniform4fv(L.uFig, fv);
      if (L.uFlip) gl.uniform1fv(L.uFlip, fl);
      gl.uniform1i(L.uFigN, figs.length);
      gl.uniform1f(L.uFigBox, this.D.box);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.fig.tex);
      gl.uniform1i(L.uFigTex, 1);
      if (L.uNoise) { gl.activeTexture(gl.TEXTURE4); gl.bindTexture(gl.TEXTURE_2D, this.grain.tex); gl.uniform1i(L.uNoise, 4); }
      if (L.uHero) gl.uniform4fv(L.uHero, this.heroes(ph));
      if (L.uTileS) { gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, this.tileS.tex); gl.uniform1i(L.uTileS, 2); gl.uniform1f(L.uTileSCells, this.tileSCells); }
      if (L.uTileF) { gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, this.tileF.tex); gl.uniform1i(L.uTileF, 3); gl.uniform1f(L.uTileFCells, this.tileFCells); }
    }

    // nine bright stars around the figure(s); z packs twinkle (int part, /100) and size (fract)
    heroes(ph) {
      const out = new Float32Array(36);
      const figs = this.layout.figs, f0 = figs[0];
      const u = this.md / 1320;
      for (let k = 0; k < 9; k++) {
        const hx = hashJS(k * 7 + 3) - 0.5, hy = hashJS(k * 13 + 7) - 0.5;
        const f = figs.length > 1 && k > 4 ? figs[1] : f0;
        let x = f.x + hx * 0.62 * f.s, y = f.y + 0.05 * f.s + hy * 0.95 * f.s;
        if (this.D.key === 'wielder' || this.D.key === 'saved') { x = -1e5; y = -1e5; }
        const tw = 0.5 + 0.5 * Math.sin(Math.PI * 2 * (ph * (1 + (k % 3)) + hashJS(k * 17 + 11)));
        const size = (1.1 + 2.2 * hashJS(k * 19 + 13)) / 4;
        out.set([x, y, Math.round(tw * 100) + Math.min(0.999, size), 10 + 34 * hashJS(k * 23 + 17)], k * 4);
      }
      void u;
      return out;
    }

    render(t, frame = 0) {
      const gl = this.gl, o = this.opts, D = this.D;
      const P = this.designProgs(o.design);
      const W = this.W, H = this.H;
      if (this.profile) { gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4)); this._t0 = performance.now(); }
      // atmosphere
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.atm.fb);
      gl.viewport(0, 0, this.atm.w, this.atm.h);
      gl.useProgram(P.atmos.p);
      this.common(P.atmos, t, frame);
      gl.uniform1f(P.atmos.loc.uDown, W / this.atm.w);
      this.strips(this.atm.w, this.atm.h);
      const prof = this.profile ? [] : null;
      const syncPx = new Uint8Array(16);
      const mark = (n) => { if (prof) { if (n === 'post') gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, syncPx); else gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.FLOAT, new Float32Array(4)); prof.push([n, performance.now()]); } };
      mark('atmos');
      // scene
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.scene.fb);
      gl.viewport(0, 0, W, H);
      gl.useProgram(P.scene.p);
      this.common(P.scene, t, frame);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.atm.tex);
      gl.uniform1i(P.scene.loc.uAtm, 0);
      this.strips(W, H);
      mark('scene');
      // bloom
      let src = this.scene;
      gl.useProgram(this.down.p);
      for (let i = 0; i < this.bloomDown.length; i++) {
        const dst = this.bloomDown[i];
        gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb);
        gl.viewport(0, 0, dst.w, dst.h);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, src.tex);
        gl.uniform1i(this.down.loc.uSrc, 0);
        gl.uniform2f(this.down.loc.uSrcTexel, 1 / src.w, 1 / src.h);
        gl.uniform1f(this.down.loc.uPrefilter, i === 0 ? 1 : 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        src = dst;
      }
      gl.useProgram(this.up.p);
      let low = this.bloomDown[this.bloomDown.length - 1];
      for (let i = this.bloomUp.length - 1; i >= 0; i--) {
        const dst = this.bloomUp[i];
        gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb);
        gl.viewport(0, 0, dst.w, dst.h);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, low.tex);
        gl.uniform1i(this.up.loc.uSrc, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.bloomDown[i].tex);
        gl.uniform1i(this.up.loc.uBase, 1);
        gl.uniform2f(this.up.loc.uSrcTexel, 1 / low.w, 1 / low.h);
        gl.uniform1f(this.up.loc.uMixBase, 1.0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        low = dst;
      }
      mark('bloom');
      // post
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.out ? this.out.fb : null);
      gl.viewport(0, 0, W, H);
      const L = this.post.loc;
      gl.useProgram(this.post.p);
      gl.uniform2f(L.uRes, W, H);
      gl.uniform1f(L.uPx, this.md / 1320);
      gl.uniform1f(L.uMd, this.md);
      gl.uniform1f(L.uFrame, Math.floor(frame / Math.max(1, this.opts.grainHold)));
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.scene.tex); gl.uniform1i(L.uScene, 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.bloomUp[0].tex); gl.uniform1i(L.uBloom, 1);
      gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, this.bloomUp[1].tex); gl.uniform1i(L.uBloomWide, 2);
      gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, this.textTex); gl.uniform1i(L.uText, 3);
      gl.activeTexture(gl.TEXTURE4); gl.bindTexture(gl.TEXTURE_2D, this.grain.tex); gl.uniform1i(L.uGrainTex, 4);
      gl.activeTexture(gl.TEXTURE5); gl.bindTexture(gl.TEXTURE_2D, this.atm.tex); gl.uniform1i(L.uAtmP, 5);
      const tl = ((t % o.loop) + o.loop) % o.loop;
      const g = this.glitchOverride != null ? this.glitchOverride : glitchAt(tl, o.loop, o.glitchAt, o.glitchAmp);
      gl.uniform1f(L.uGlitch, g);
      gl.uniform1f(L.uGSeed, this.gseedOverride != null ? this.gseedOverride : Math.floor(tl * 15) + 1 + 97 * o.design);
      gl.uniform1f(L.uBloomAmt, D.bloom / 7);
      gl.uniform1f(L.uExposure, D.exposure);
      gl.uniform1f(L.uCA, D.ca);
      gl.uniform1f(L.uGrain, D.grain * this.opts.grainScale);
      gl.uniform1f(L.uGrainSize, D.grainSize);
      gl.uniform1f(L.uScan, D.scan);
      gl.uniform1f(L.uVig, D.vig);
      gl.uniform1i(L.uMode, this.opts.mode != null ? this.opts.mode : D.mode);
      gl.uniform3fv(L.uInk, lin(D.ink || [1, 1, 1]));
      gl.uniform3fv(L.uInk2, lin(D.ink2 || [1, 1, 1]));
      gl.uniform3fv(L.uPaper, lin(D.paper || [0, 0, 0]));
      gl.uniform3fv(L.uTextCol, lin(D.text));
      gl.uniform1f(L.uTextOp, D.textOp * this.opts.typeOpacity);
      gl.uniform1f(L.uDot, Math.max(6, Math.round(this.md * D.dot)));
      gl.uniform1f(L.uFlipY, this.out ? 1 : 0);
      this.strips(W, H);
      mark('post');
      if (prof) this.lastProfile = prof;
      return g;
    }

    readPixels() {
      const gl = this.gl;
      const buf = new Uint8Array(this.W * this.H * 4);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.out.fb);
      gl.readPixels(0, 0, this.W, this.H, gl.RGBA, gl.UNSIGNED_BYTE, buf);
      return buf;
    }
  }

  global.QATSEL = { Engine, DESIGNS, layoutFor, loadFonts, glitchAt, glitchEvent, hash: hashJS, version: '1.0.0' };
})(typeof window !== 'undefined' ? window : globalThis);
