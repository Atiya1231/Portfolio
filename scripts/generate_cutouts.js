import fs from 'fs';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

function processImageCutout(inputJpgPath, outputPngPath) {
  console.log(`Processing: ${inputJpgPath} -> ${outputPngPath}`);
  const rawJpg = fs.readFileSync(inputJpgPath);
  const decoded = jpeg.decode(rawJpg, { useTArray: true });
  const { width, height, data } = decoded;

  const png = new PNG({ width, height });
  
  // Identify boundary background via flood fill from borders where brightness is low (black studio background)
  const isBackground = new Uint8Array(width * height);
  const queue = [];

  const getIdx = (x, y) => y * width + x;
  const getLuma = (x, y) => {
    const idx = (y * width + x) * 4;
    return 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
  };

  // Seed with outer border pixels that are dark background
  for (let x = 0; x < width; x++) {
    if (getLuma(x, 0) < 35) {
      isBackground[getIdx(x, 0)] = 1;
      queue.push([x, 0]);
    }
    if (getLuma(x, height - 1) < 35) {
      isBackground[getIdx(x, height - 1)] = 1;
      queue.push([x, height - 1]);
    }
  }

  for (let y = 0; y < height; y++) {
    if (getLuma(0, y) < 35) {
      isBackground[getIdx(0, y)] = 1;
      queue.push([0, y]);
    }
    if (getLuma(width - 1, y) < 35) {
      isBackground[getIdx(width - 1, y)] = 1;
      queue.push([width - 1, y]);
    }
  }

  // BFS Flood Fill outer dark background
  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++];
    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1],
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = getIdx(nx, ny);
        if (!isBackground[nIdx]) {
          const luma = getLuma(nx, ny);
          // Dark studio background threshold
          if (luma < 30) {
            isBackground[nIdx] = 1;
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  // Calculate distance / feathering from background to foreground
  // Copy pixels to PNG with soft alpha edge
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pIdx = getIdx(x, y);
      const dIdx = pIdx * 4;

      const r = data[dIdx];
      const g = data[dIdx + 1];
      const b = data[dIdx + 2];
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;

      if (isBackground[pIdx]) {
        // Near edge feathering
        let alpha = 0;
        if (luma > 8) {
          alpha = Math.min(255, Math.round(((luma - 8) / 22) * 180));
        }
        png.data[dIdx] = r;
        png.data[dIdx + 1] = g;
        png.data[dIdx + 2] = b;
        png.data[dIdx + 3] = alpha;
      } else {
        png.data[dIdx] = r;
        png.data[dIdx + 1] = g;
        png.data[dIdx + 2] = b;
        png.data[dIdx + 3] = 255;
      }
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync(outputPngPath, buffer);
  console.log(`Saved cutout to ${outputPngPath} (${buffer.length} bytes)`);
}

const p1 = 'C:/Users/atiya/.gemini/antigravity-ide/brain/01ba6387-b603-4a3b-8f51-8c2711357093/.user_uploaded/media_1790959831903.jpg';
const p2 = 'C:/Users/atiya/.gemini/antigravity-ide/brain/01ba6387-b603-4a3b-8f51-8c2711357093/.user_uploaded/media_1790959840000.jpg';

processImageCutout(p1, 'c:/Users/atiya/OneDrive/Desktop/Atiya_portfolia/src/assets/atiya-base.png');
processImageCutout(p2, 'c:/Users/atiya/OneDrive/Desktop/Atiya_portfolia/src/assets/atiya-futuristic.png');
