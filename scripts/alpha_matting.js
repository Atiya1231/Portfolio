import fs from 'fs';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const origJpgPath = 'C:/Users/atiya/.gemini/antigravity-ide/brain/01ba6387-b603-4a3b-8f51-8c2711357093/.user_uploaded/media_1790962483561.jpg';
const origJpg = jpeg.decode(fs.readFileSync(origJpgPath), { useTArray: true });
const W = origJpg.width;
const H = origJpg.height;

console.log(`Starting Advanced Alpha Matting on ${W}x${H}...`);

// 1. Classify pixels into Trimap: 0 = Definite Background, 1 = Definite Foreground, 2 = Unknown Transition
const trimap = new Uint8Array(W * H);
const isExteriorBg = new Uint8Array(W * H);

// Flood fill from outer image borders (top, left, right)
// Seeds: pixels with lum <= 4 on the perimeter
const queue = [];
for (let x = 0; x < W; x++) {
  const pIdx = x * 4;
  const lum = Math.max(origJpg.data[pIdx], origJpg.data[pIdx + 1], origJpg.data[pIdx + 2]);
  if (lum <= 4) {
    isExteriorBg[x] = 1;
    queue.push(x, 0);
  }
}
for (let y = 0; y < H; y++) {
  const lIdx = (y * W) * 4;
  const lumL = Math.max(origJpg.data[lIdx], origJpg.data[lIdx + 1], origJpg.data[lIdx + 2]);
  if (lumL <= 4) {
    isExteriorBg[y * W] = 1;
    queue.push(0, y);
  }
  const rIdx = (y * W + (W - 1)) * 4;
  const lumR = Math.max(origJpg.data[rIdx], origJpg.data[rIdx + 1], origJpg.data[rIdx + 2]);
  if (lumR <= 4) {
    isExteriorBg[y * W + (W - 1)] = 1;
    queue.push(W - 1, y);
  }
}

let head = 0;
while (head < queue.length) {
  const cx = queue[head++];
  const cy = queue[head++];

  const neighbors = [
    [cx + 1, cy],
    [cx - 1, cy],
    [cx, cy + 1],
    [cx, cy - 1]
  ];

  for (let i = 0; i < 4; i++) {
    const [nx, ny] = neighbors[i];
    if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
      const nIdx = ny * W + nx;
      if (isExteriorBg[nIdx] === 0) {
        const pIdx = nIdx * 4;
        const lum = Math.max(origJpg.data[pIdx], origJpg.data[pIdx + 1], origJpg.data[pIdx + 2]);
        if (lum <= 4) {
          isExteriorBg[nIdx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }
}

// Compute distance from exterior background for all pixels
const distFromBg = new Int32Array(W * H).fill(999);
const qDist = [];

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = y * W + x;
    if (isExteriorBg[idx] === 1) {
      distFromBg[idx] = 0;
      qDist.push(x, y);
    }
  }
}

head = 0;
while (head < qDist.length) {
  const cx = qDist[head++];
  const cy = qDist[head++];
  const cDist = distFromBg[cy * W + cx];

  const neighbors = [
    [cx + 1, cy],
    [cx - 1, cy],
    [cx, cy + 1],
    [cx, cy - 1]
  ];

  for (let i = 0; i < 4; i++) {
    const [nx, ny] = neighbors[i];
    if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
      const nIdx = ny * W + nx;
      if (distFromBg[nIdx] > cDist + 1) {
        distFromBg[nIdx] = cDist + 1;
        qDist.push(nx, ny);
      }
    }
  }
}

// Trimap Assignment:
// - Definite Background (0): isExteriorBg === 1 and lum <= 3
// - Definite Foreground (1): distFromBg >= 6 and lum >= 15
// - Transition / Unknown (2): everywhere between
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = y * W + x;
    const pIdx = idx * 4;
    const r = origJpg.data[pIdx];
    const g = origJpg.data[pIdx + 1];
    const b = origJpg.data[pIdx + 2];
    const lum = Math.max(r, g, b);

    if (isExteriorBg[idx] === 1 && lum <= 3) {
      trimap[idx] = 0; // Definite Background
    } else if (distFromBg[idx] >= 6 && lum >= 15) {
      trimap[idx] = 1; // Definite Foreground
    } else {
      trimap[idx] = 2; // Transition / Unknown
    }
  }
}

// 2. Alpha Matting & Color Decontamination (Un-premultiplying black background)
const outPng = new PNG({ width: W, height: H });

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = y * W + x;
    const pIdx = idx * 4;
    const r = origJpg.data[pIdx];
    const g = origJpg.data[pIdx + 1];
    const b = origJpg.data[pIdx + 2];
    const lum = Math.max(r, g, b);

    if (trimap[idx] === 0) {
      // Background -> 100% transparent
      outPng.data[pIdx] = 0;
      outPng.data[pIdx + 1] = 0;
      outPng.data[pIdx + 2] = 0;
      outPng.data[pIdx + 3] = 0;
    } else if (trimap[idx] === 1) {
      // Solid Foreground -> 100% opaque, 100% original color
      outPng.data[pIdx] = r;
      outPng.data[pIdx + 1] = g;
      outPng.data[pIdx + 2] = b;
      outPng.data[pIdx + 3] = 255;
    } else {
      // Transition Zone: Hair strands / soft edges
      // Find local foreground color from nearby definite foreground pixels
      let sumR = 0, sumG = 0, sumB = 0, sumWeight = 0;
      const rad = 6;

      for (let dy = -rad; dy <= rad; dy++) {
        for (let dx = -rad; dx <= rad; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
            const nIdx = ny * W + nx;
            if (trimap[nIdx] === 1) {
              const npIdx = nIdx * 4;
              const d2 = dx * dx + dy * dy + 1;
              const weight = 1 / d2;
              sumR += origJpg.data[npIdx] * weight;
              sumG += origJpg.data[npIdx + 1] * weight;
              sumB += origJpg.data[npIdx + 2] * weight;
              sumWeight += weight;
            }
          }
        }
      }

      let fgR = 120, fgG = 40, fgB = 60; // fallback hair rim tone
      if (sumWeight > 0) {
        fgR = sumR / sumWeight;
        fgG = sumG / sumWeight;
        fgB = sumB / sumWeight;
      }

      const fgLum = Math.max(fgR, fgG, fgB, 20);

      // Estimate alpha: ratio of observed luminance to estimated foreground luminance
      // With projection: alpha = (C . F) / (F . F)
      const dotCF = r * fgR + g * fgG + b * fgB;
      const dotFF = fgR * fgR + fgG * fgG + fgB * fgB;
      let alpha = dotFF > 0 ? dotCF / dotFF : lum / fgLum;

      // Also ensure luminance thresholding
      if (lum <= 3 && isExteriorBg[idx] === 1) {
        alpha = 0;
      }

      alpha = Math.max(0, Math.min(1, alpha));

      if (alpha <= 0.03) {
        // Transparent
        outPng.data[pIdx] = 0;
        outPng.data[pIdx + 1] = 0;
        outPng.data[pIdx + 2] = 0;
        outPng.data[pIdx + 3] = 0;
      } else {
        // Decontaminate: un-multiply black background from color!
        // F_unmultiplied = clamp(C / alpha)
        const unmultR = Math.min(255, Math.max(0, Math.round(r / Math.max(0.2, alpha))));
        const unmultG = Math.min(255, Math.max(0, Math.round(g / Math.max(0.2, alpha))));
        const unmultB = Math.min(255, Math.max(0, Math.round(b / Math.max(0.2, alpha))));

        // Blend with local foreground chromaticity for thin flyaway strands to completely eliminate black halo
        const blendFactor = Math.min(1, alpha * 1.5);
        const finalR = Math.round(unmultR * blendFactor + fgR * (1 - blendFactor));
        const finalG = Math.round(unmultG * blendFactor + fgG * (1 - blendFactor));
        const finalB = Math.round(unmultB * blendFactor + fgB * (1 - blendFactor));

        outPng.data[pIdx] = Math.min(255, Math.max(0, finalR));
        outPng.data[pIdx + 1] = Math.min(255, Math.max(0, finalG));
        outPng.data[pIdx + 2] = Math.min(255, Math.max(0, finalB));
        outPng.data[pIdx + 3] = Math.round(alpha * 255);
      }
    }
  }
}

// 3. Save Cutout Asset to all target locations
const pngBuffer = PNG.sync.write(outPng);
fs.writeFileSync('./src/assets/atiya-normal.png', pngBuffer);
fs.writeFileSync('./src/assets/atiya-cutout.png', pngBuffer);
fs.writeFileSync('./src/assets/atiya-base.png', pngBuffer);
fs.writeFileSync('./src/assets/atiya-portrait.png', pngBuffer);
console.log('Saved corrected transparent cutout!');

// 4. Quality Test: Composite over #EADADA (234, 218, 218), #BE5CA9 (190, 92, 169), and #4D3A4D (77, 58, 77)
function testComposite(bgR, bgG, bgB, filename) {
  const compPng = new PNG({ width: W, height: H });
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      const r = outPng.data[idx];
      const g = outPng.data[idx + 1];
      const b = outPng.data[idx + 2];
      const a = outPng.data[idx + 3] / 255;

      compPng.data[idx] = Math.round(r * a + bgR * (1 - a));
      compPng.data[idx + 1] = Math.round(g * a + bgG * (1 - a));
      compPng.data[idx + 2] = Math.round(b * a + bgB * (1 - a));
      compPng.data[idx + 3] = 255;
    }
  }
  fs.writeFileSync(`./scratch/${filename}`, PNG.sync.write(compPng));
  console.log(`Saved quality test composite: scratch/${filename}`);
}

if (!fs.existsSync('./scratch')) fs.mkdirSync('./scratch', { recursive: true });
testComposite(234, 218, 218, 'test_eadada_light.png');
testComposite(190, 92, 169, 'test_be5ca9_magenta.png');
testComposite(77, 58, 77, 'test_4d3a4d_darkplum.png');
