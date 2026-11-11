import http from 'http';
import fs from 'fs';
import path from 'path';

const inputImagePath = 'C:/Users/atiya/.gemini/antigravity-ide/brain/2bf3b08f-628e-4d4d-a9d7-8de1e49156f1/.user_uploaded/media_1791482109236.jpg';

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 
      'Content-Type': 'text/html',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    });
    res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>Portrait Cutout Generator</title>
  <script type="module">
    import imglyRemoveBackground from 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.7/+esm';
    
    window.onload = async () => {
      const status = document.getElementById('status');
      try {
        status.innerText = 'Loading input image...';
        const imgBlob = await fetch('/input-image.jpg').then(r => r.blob());
        
        status.innerText = 'Processing portrait with imgly AI...';
        const resultBlob = await imglyRemoveBackground(imgBlob, {
          progress: (key, current, total) => {
            status.innerText = \`Progress [\${key}]: \${Math.round((current / total) * 100)}%\`;
          }
        });
        
        status.innerText = 'Uploading transparent cutout...';
        const formData = new FormData();
        formData.append('file', resultBlob, 'cutout.png');
        
        const resp = await fetch('/save-cutout', {
          method: 'POST',
          body: resultBlob,
          headers: { 'Content-Type': 'image/png' }
        });
        
        const text = await resp.text();
        status.innerText = 'FINISHED: ' + text;
        document.body.style.background = '#BE5CA9';
        const img = document.createElement('img');
        img.src = URL.createObjectURL(resultBlob);
        img.style.maxHeight = '80vh';
        document.body.appendChild(img);
      } catch (err) {
        status.innerText = 'ERROR: ' + err.message;
        console.error(err);
      }
    };
  </script>
</head>
<body style="background:#EADADA; font-family:sans-serif; text-align:center; padding:2rem;">
  <h1 id="status">Initializing...</h1>
</body>
</html>
    `);
  } else if (req.url === '/input-image.jpg') {
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    fs.createReadStream(inputImagePath).pipe(res);
  } else if (req.url === '/save-cutout' && req.method === 'POST') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      fs.writeFileSync('./src/assets/atiya-normal.png', buffer);
      fs.writeFileSync('./src/assets/atiya-cutout.png', buffer);
      fs.writeFileSync('./src/assets/atiya-base.png', buffer);
      fs.writeFileSync('./src/assets/atiya-portrait.png', buffer);
      fs.writeFileSync('./public/images/Base_image.png', buffer);
      console.log('Successfully saved cutout! Size:', buffer.length);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Cutout saved successfully');
      setTimeout(() => process.exit(0), 1000);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(5189, () => {
  console.log('Cutout server listening on http://localhost:5189');
});
