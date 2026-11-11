import fs from 'fs';
import { PNG } from 'pngjs';

const baseCutout = PNG.sync.read(fs.readFileSync('./src/assets/atiya-normal.png'));
const W = baseCutout.width;
const H = baseCutout.height;

const futPng = new PNG({ width: W, height: H });

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (y * W + x) * 4;
    const r = baseCutout.data[idx];
    const g = baseCutout.data[idx + 1];
    const b = baseCutout.data[idx + 2];
    const a = baseCutout.data[idx + 3];

    if (a === 0) {
      futPng.data[idx] = 0;
      futPng.data[idx + 1] = 0;
      futPng.data[idx + 2] = 0;
      futPng.data[idx + 3] = 0;
      continue;
    }

    // Preserve exact facial brightness & features while applying high-end editorial futuristic tint/bloom:
    // Magenta orchid rim lighting (#BE5CA9 -> 190, 92, 169) and soft rose highlight (#D59CC5)
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Slight contrast and soft chromatic accent
    const normX = x / W;
    const normY = y / H;
    
    // Subtle magenta rim light towards left and right edges of silhouette
    const rimFactor = Math.pow(Math.abs(normX - 0.5) * 2, 2) * 0.45;
    
    // Apply sophisticated editorial futuristic lighting
    let nr = r * 0.88 + 190 * 0.12 + (rimFactor * 40);
    let ng = g * 0.82 + 92 * 0.18;
    let nb = b * 0.85 + 169 * 0.18 + (rimFactor * 65);

    // If it's the dark blazer / dark clothing, add deep plum-magenta tone
    if (lum < 80) {
      nr = Math.min(255, nr + 20);
      ng = Math.min(255, ng + 5);
      nb = Math.min(255, nb + 30);
    } else if (lum > 180) {
      // White top / bright skin highlights: soft pearlescent rose glow
      nr = Math.min(255, nr + 15);
      ng = Math.min(255, ng + 8);
      nb = Math.min(255, nb + 18);
    }

    futPng.data[idx] = Math.min(255, Math.max(0, Math.round(nr)));
    futPng.data[idx + 1] = Math.min(255, Math.max(0, Math.round(ng)));
    futPng.data[idx + 2] = Math.min(255, Math.max(0, Math.round(nb)));
    futPng.data[idx + 3] = a;
  }
}

const futBuffer = PNG.sync.write(futPng);
fs.writeFileSync('./src/assets/atiya-futuristic.png', futBuffer);
fs.writeFileSync('./public/images/Reveal_image.png', futBuffer);
console.log('Saved 1:1 aligned futuristic reveal image!');
