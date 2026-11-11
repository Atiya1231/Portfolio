import fs from 'fs';
import path from 'path';

async function run() {
  console.log('Testing @imgly/background-removal-node...');
  try {
    const { removeBackground } = await import('@imgly/background-removal-node');
    const inputPath = 'C:/Users/atiya/.gemini/antigravity-ide/brain/2bf3b08f-628e-4d4d-a9d7-8de1e49156f1/.user_uploaded/media_1791482109236.jpg';
    
    // Read image as blob or buffer
    const imgBuffer = fs.readFileSync(inputPath);
    const blob = new Blob([imgBuffer], { type: 'image/jpeg' });

    console.log('Removing background with imgly...');
    const resultBlob = await removeBackground(blob, {
      output: {
        format: 'image/png',
        quality: 1.0
      },
      progress: (key, current, total) => {
        console.log(`Progress [${key}]: ${current}/${total}`);
      }
    });

    const arrayBuffer = await resultBlob.arrayBuffer();
    const resultBuffer = Buffer.from(arrayBuffer);

    // Save to all target locations
    fs.writeFileSync('./src/assets/atiya-normal.png', resultBuffer);
    fs.writeFileSync('./src/assets/atiya-cutout.png', resultBuffer);
    fs.writeFileSync('./src/assets/atiya-base.png', resultBuffer);
    fs.writeFileSync('./src/assets/atiya-portrait.png', resultBuffer);
    fs.writeFileSync('./public/images/Base_image.png', resultBuffer);

    console.log(`SUCCESS! Saved portrait cutout (${resultBuffer.length} bytes) to src/assets and public/images`);
  } catch (err) {
    console.error('Error in @imgly/background-removal-node:', err);
  }
}

run();
