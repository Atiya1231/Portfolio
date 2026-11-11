import fs from 'fs';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const origJpgPath = 'C:/Users/atiya/.gemini/antigravity-ide/brain/01ba6387-b603-4a3b-8f51-8c2711357093/.user_uploaded/media_1790962483561.jpg';
const origJpg = jpeg.decode(fs.readFileSync(origJpgPath), { useTArray: true });
const W = origJpg.width;
const H = origJpg.height;

console.log(`Processing ${W}x${H}...`);

// Step 1: Accurate exterior background flood fill
// Exterior background starts from image perimeter (y=0, x=0, x=W-1) where pixel is black/near-black (lum <= 5)
const isExterior = new Uint8Array(W * H);
const queue = [];

for (let x = 0; x < W; x++) {
  const idx = x * 4;
  const lum = Math.max(origJpg.data[idx], origJpg.data[idx + 1], origJpg.data[idx + 2]);
  if (lum <= 5) {
    isExterior[x] = 1;
    queue.push(x, 0);
  }
}

for (let y = 0; y < H; y++) {
  const lIdx = (y * W) * 4;
  const lumL = Math.max(origJpg.data[lIdx], origJpg.data[lIdx + 1], origJpg.data[lIdx + 2]);
  if (lumL <= 5) {
    isExterior[y * W] = 1;
    queue.push(0, y);
  }

  const rIdx = (y * W + (W - 1)) * 4;
  const lumR = Math.max(origJpg.data[rIdx], origJpg.data[rIdx + 1], origJpg.data[rIdx + 2]);
  if (lumR <= 5) {
    isExterior[y * W + (W - 1)] = 1;
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
      if (isExterior[nIdx] === 0) {
        const pIdx = nIdx * 4;
        const lum = Math.max(origJpg.data[pIdx], origJpg.data[pIdx + 1], origJpg.data[pIdx + 2]);
        // Only propagate through background noise (lum <= 5)
        if (lum <= 5) {
          isExterior[nIdx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }
}

// Step 2: Everything that was NOT reached by exterior flood fill is 100% the person!
// (All interior hair, face, hand, arm, dress, and dark hair shadow regions!)
// Now find the outer boundary pixels of the person (the 1-3 pixel rim adjacent to exterior background)

const outPng = new PNG({ width: W, height: H });

// Find distance to exterior background for edge smoothing
const isEdge = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = y * W + x;
    if (isExterior[idx] === 0) {
      // Check if adjacent to exterior
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
            if (isExterior[ny * W + nx] === 1) {
              isEdge[idx] = 1;
              break;
            }
          }
        }
        if (isEdge[idx] === 1) break;
      }
    }
  }
}

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = y * W + x;
    const pIdx = idx * 4;
    const r = origJpg.data[pIdx];
    const g = origJpg.data[pIdx + 1];
    const b = origJpg.data[pIdx + 2];
    const lum = Math.max(r, g, b);

    if (isExterior[idx] === 1) {
      // Exterior background -> fully transparent
      outPng.data[pIdx] = 0;
      outPng.data[pIdx + 1] = 0;
      outPng.data[pIdx + 2] = 0;
      outPng.data[pIdx + 3] = 0;
    } else if (isEdge[idx] === 0) {
      // Core Solid Person (Hair, Face, Arm, Hand, Dress, Chest) -> 100% Opaque & 100% Original Color!
      outPng.data[pIdx] = r;
      outPng.data[pIdx + 1] = g;
      outPng.data[pIdx + 2] = b;
      outPng.data[pIdx + 3] = 255;
    } else {
      // Outer Boundary Rim: Smooth subpixel alpha & Color De-fringing
      // Find nearest solid foreground color in 5x5 window
      let sumR = 0, sumG = 0, sumB = 0, sumW = 0;
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
            const nIdx = ny * W + nx;
            if (isExterior[nIdx] === 0 && isEdge[nIdx] === 0) {
              const npIdx = nIdx * 4;
              const weight = 1 / (dx * dx + dy * dy + 1);
              sumR += origJpg.data[npIdx] * weight;
              sumG += origJpg.data[npIdx + 1] * weight;
              sumB += origJpg.data[npIdx + 2] * weight;
              sumW += weight;
            }
          }
        }
      }

      let fgR = r, fgG = g, fgB = b;
      if (sumW > 0) {
        fgR = sumR / sumW;
        fgG = sumG / sumW;
        fgB = sumB / sumW;
      }
      const fgLum = Math.max(fgR, fgG, fgB, 20);

      // Estimate true alpha
      let alpha = Math.min(1, Math.max(0.1, lum / fgLum));
      if (lum <= 5) alpha = (lum / 5) * 0.4;

      // Color de-contamination (un-premultiply black)
      const unmultR = Math.min(255, Math.max(0, Math.round(r / Math.max(0.25, alpha))));
      const unmultG = Math.min(255, Math.max(0, Math.round(g / Math.max(0.25, alpha))));
      const unmultB = Math.min(255, Math.max(0, Math.round(b / Math.max(0.25, alpha))));

      // Blend with solid foreground chromaticity so edge strands have natural warm/pink hair color without black fringe
      const blend = Math.min(1, alpha * 1.4);
      const cleanR = Math.round(unmultR * blend + fgR * (1 - blend));
      const cleanG = Math.round(unmultG * blend + fgG * (1 - blend));
      const cleanB = Math.round(unmultB * blend + fgB * (1 - blend));

      outPng.data[pIdx] = Math.min(255, Math.max(0, cleanR));
      outPng.data[pIdx + 1] = Math.min(255, Math.max(0, cleanG));
      outPng.data[pIdx + 2] = Math.min(255, Math.max(0, cleanB));
      outPng.data[pIdx + 3] = Math.round(Math.min(255, alpha * 255));
    }
  }
}

// Save Cutout Asset
const pngBuffer = PNG.sync.write(outPng);
fs.writeFileSync('./src/assets/atiya-normal.png', pngBuffer);
fs.writeFileSync('./src/assets/atiya-cutout.png', pngBuffer);
fs.writeFileSync('./src/assets/atiya-base.png', pngBuffer);
fs.writeFileSync('./src/assets/atiya-portrait.png', pngBuffer);
console.log('Saved corrected transparent cutout!');

// Generate quality test composites over #EADADA, #BE5CA9, and #4D3A4D
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
}

testComposite(234, 218, 218, 'test_eadada_light.png');
testComposite(190, 92, 169, 'test_be5ca9_magenta.png');
testComposite(77, 58, 77, 'test_4d3a4d_darkplum.png');
console.log('Saved test composites!');
