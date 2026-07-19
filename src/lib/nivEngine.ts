// Self-contained port of the Noctis IV procedural generation engine
// (noctis-iv-js-components / niv_engine.js), used to derive per-star
// body counts (planets + moons) deterministically from Paris coordinates.

const STAR_CLASSES = 12;
const PLANET_TYPES = 10;
const MAXBODIES = 80;

const DEG = Math.PI / 180;
const QT_M_PI = (4 * Math.PI) / 3;

const CLASS_PLANETS = [12, 18, 8, 15, 20, 3, 0, 1, 7, 20, 2, 5];
const CLASS_RAY = [
  5000, 15000, 300, 20000, 15000, 1000, 3000, 2000, 4000, 1500, 30000, 250
];
const CLASS_RAYVAR = [
  2000, 10000, 200, 15000, 5000, 1000, 3000, 500, 5000, 10000, 1000, 10
];
const CLASS_RGB = [
  63, 58, 40, 30, 50, 63, 63, 63, 63, 63, 30, 20, 63, 55, 32, 32, 16, 10, 32,
  28, 24, 10, 20, 63, 63, 32, 16, 48, 32, 63, 40, 10, 10, 0, 63, 63
];
const PLANET_POSSIBLEMOONS = [1, 1, 2, 3, 2, 2, 18, 2, 3, 20, 20];
const PLANET_ORB_SCALING = 5.0;
const AVG_PLANET_SIZING = 2.4;
const MOON_ORB_SCALING = 12.8;
const AVG_MOON_SIZING = 1.8;
const AVG_PLANET_RAY = [
  0.007, 0.003, 0.01, 0.011, 0.01, 0.008, 0.064, 0.009, 0.012, 0.125, 5.0
];

let _Seed = 1;
let _randCount = 0;

function c_srand(seed: number): void {
  _randCount = 0;
  let s = Math.trunc(seed);
  while (s < 0 || s > 65535) {
    if (s < 0) s += 65536;
    else s -= 65536;
  }
  _Seed = s;
}

function c_rand(): number {
  let result = Math.imul(_Seed, 0x15a) & 0xffff;

  if (_randCount !== 0) {
    result = (Math.imul(_randCount, 0x4e35) + result) & 0xffff;
  }

  let result2 = Math.imul(_Seed, 0x4e35);
  result2 = (result2 + (result << 16)) | 0;
  result2 = (result2 + 1) | 0;

  _randCount = (result2 >> 16) & 0xffff;
  _Seed = result2 & 0xffff;

  return _randCount & 0x7fff;
}

function c_random(num: number): number {
  const RAND_MAX = 32767;
  return Math.trunc((c_rand() * num) / (RAND_MAX + 1));
}

function zrandom(range: number): number {
  return c_random(range) - c_random(range);
}

interface StarInfo {
  class: number;
  ray: number;
  spin: number;
  r: number;
  g: number;
  b: number;
}

function extractTargetInfo(x: number, y: number, z: number): StarInfo {
  const val = (((((x / 100000) * y) / 100000) * z) / 100000);
  c_srand(val);

  const cls = c_random(STAR_CLASSES);
  const ray = (CLASS_RAY[cls] + c_random(CLASS_RAYVAR[cls])) * 0.001;
  const r = CLASS_RGB[3 * cls + 0];
  const g = CLASS_RGB[3 * cls + 1];
  const b = CLASS_RGB[3 * cls + 2];

  let spin = 0;
  if (cls === 11) spin = c_random(30) + 1;
  if (cls === 7) spin = c_random(12) + 1;
  if (cls === 2) spin = c_random(4) + 1;

  return { class: cls, ray, spin, r, g, b };
}

export interface SystemInfo {
  starClass: number;
  ray: number;
  nop: number;
  nob: number;
}

export function getSystemInfo(x: number, y: number, z: number): SystemInfo {
  x = Math.trunc(x);
  y = Math.trunc(y);
  z = Math.trunc(z);

  const starInfo = extractTargetInfo(x, y, z);
  const cls = starInfo.class;
  const ray = starInfo.ray;

  function wrap32(v: number): number {
    while (v < -2147483648 || v > 2147483647) {
      if (v < 0) v += 0x100000000;
      else v -= 0x100000000;
    }
    return v;
  }

  let op = x % 10000;
  op = wrap32(op * y);
  op = op % 10000;
  op = wrap32(op * z);
  op = op % 10000;

  c_srand(op);

  const nop = c_random(CLASS_PLANETS[cls] + 1);

  const pType = new Array(MAXBODIES).fill(0);

  for (let n = 0; n < nop; n++) {
    let t;

    if (cls !== 8) {
      pType[n] = c_random(PLANET_TYPES);
    } else {
      if (c_random(2)) {
        pType[n] = 10;
      } else {
        pType[n] = c_random(PLANET_TYPES);
      }
    }

    if (cls === 2 || cls === 7 || cls === 15) {
      // no special handling needed for counts
    }
  }

  if (cls === 0) {
    if (c_random(4) === 2) pType[2] = 3;
    if (c_random(4) === 2) pType[3] = 3;
    if (c_random(4) === 2) pType[4] = 3;
  }

  for (let n = 0; n < nop; n++) {
    switch (cls) {
      case 2:
        while (pType[n] === 3) pType[n] = c_random(10);
        break;
      case 5:
        while (pType[n] === 6 || pType[n] === 9) pType[n] = c_random(10);
        break;
      case 7:
        pType[n] = 9;
        break;
      case 9:
        while (pType[n] !== 0 && pType[n] !== 6 && pType[n] !== 9)
          pType[n] = c_random(10);
        break;
      case 11:
        while (pType[n] !== 1 && pType[n] !== 7) pType[n] = c_random(10);
        break;
    }
  }

  for (let n = 0; n < nop; n++) {
    switch (pType[n]) {
      case 0:
        if (c_random(8)) pType[n]++;
        break;
      case 3:
        if (n < 2 || n > 6 || (cls && c_random(4))) {
          if (c_random(2)) pType[n]++;
          else pType[n]--;
        }
        break;
      case 7:
        if (n < 7) {
          if (c_random(2)) pType[n] -= 1;
          else pType[n] -= 2;
        }
        break;
    }
  }

  let nob = nop;

  const noMoons = cls === 2 || cls === 7 || cls === 15;

  if (!noMoons) {
    for (let n = 0; n < nop; n++) {
      const s = pType[n];
      let t;

      if (n < 2) {
        t = 0;
        if (s === 10) t = c_random(3);
      } else {
        t = c_random(PLANET_POSSIBLEMOONS[s] + 1);
      }

      if (nob + t > MAXBODIES) t = MAXBODIES - nob;

      for (let c = 0; c < t; c++) {
        const q = nob + c;
        let r = pType[q] = c_random(PLANET_TYPES);

        if (r === 9 && s !== 10) r = 2;
        if (r === 6 && s < 9) r = 5;
        if (n > 7 && c_random(c)) r = 7;
        if (n > 9 && c_random(c)) r = 7;
        if (r === 2 || r === 3 || r === 4 || r === 8) {
          if (s !== 6 && s < 9) r = 1;
        }
        if (r === 3 && s < 9) {
          if (n > 7) r = 7;
          if (cls && c_random(4)) r = 5;
          if (cls === 2 || cls === 7 || cls === 11) r = 8;
        }
        if (r === 7 && n <= 5) r = 1;
        if ((cls === 2 || cls === 5 || cls === 7 || cls === 11) && c_random(n))
          r = 7;

        pType[q] = r;
      }

      nob += t;
    }
  }

  return {
    starClass: cls,
    ray,
    nop,
    nob
  };
}
