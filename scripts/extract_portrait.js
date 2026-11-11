import fs from 'fs';
import { pipeline, env } from '@xenova/transformers';
import { PNG } from 'pngjs';
import jpeg from 'jpeg-js';

// Skip downloading weights if already cached
env.allowLocalModels = false;

async function run() {
  console.log('Loading segmentation model...');
  const segmenter = await pipeline('image-segmentation', 'Xenova/bria-rmbg-1.4');

  const inputPath = 'C:/Users/atiya/.gemini/antigravity-ide/brain/2bf3b08f-628e-4d4d-a9d7-8de1e49156f1/.user_uploaded/media_1791482109236.jpg';
  console.log('Processing portrait image:', inputPath);

  const output = await segmenter(inputPath);
  console.log('Segmentation completed! Output keys:', Object.keys(output));

  // output is a RawImage with mask
  const mask = output;
  console.log(`Mask dimensions: ${mask.width}x${mask.height}, channels: ${mask.channels}`);

  // Now let's apply the mask to the original image pixels
  const origBuffer = fs.readFileSync(inputPath);
  const origJpg = jpeg.decode(origBuffer, { useTArray: true });
  const W = origJpg.width;
  const H = origJpg.height;

  // Let's create high resolution cutout PNG
  const outPng = new PNG({ width: W, height: H });

  // If mask is resized or same size
  // Let's resize or sample mask
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const pIdx = (y * W + x) * 4;
      
      // Calculate mask coordinates
      const mx = Math.floor((x / W) * mask.width);
      const my = Math.floor((y / H) * mask.height);
      const mIdx = (my * mask.width + mx) * mask.channels;
      
      // mask value (0 to 255)
      const alpha = mask.data[mIdx];

      outPng.data[pIdx] = origJpg.data[pIdx];         // R (exact original)
      outPng.data[pIdx + 1] = origJpg.data[pIdx + 1]; // G (exact original)
      outPng.data[pIdx + 2] = origJpg.data[pIdx + 2]; // B (exact original)
      outPng.data[pIdx + 3] = alpha;                   // Alpha
    }
  }

  const outBuffer = PNG.sync.write(outPng);
  fs.writeFileSync('./src/assets/atiya-cutout.png', outBuffer);
  fs.writeFileSync('./src/assets/atiya-normal.png', outBuffer);
  fs.writeFileSync('./src/assets/atiya-portrait.png', outBuffer);
  fs.writeFileSync('./public/images/Base_image.png', outBuffer);
  console.log('Cutout saved successfully!');
}

run().catch(err => {
  console.error('Error running segmentation:', err);
});
