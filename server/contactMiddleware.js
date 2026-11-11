import { handleContactSubmission } from './contactHandler.js';

/**
 * Connect/Express middleware for Vite dev & preview server
 * Listens on /api/contact
 */
export async function contactApiMiddleware(req, res, next) {
  // Only handle POST requests
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
    return;
  }

  let bodyData = '';
  req.on('data', (chunk) => {
    bodyData += chunk;
    // Guard against oversized payloads (> 500KB)
    if (bodyData.length > 512000) {
      res.statusCode = 413;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'Payload Too Large' }));
      req.destroy();
    }
  });

  req.on('end', async () => {
    try {
      const parsedBody = bodyData ? JSON.parse(bodyData) : {};
      const result = await handleContactSubmission(parsedBody);
      res.statusCode = result.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result.json));
    } catch (parseError) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'Malformed JSON payload.' }));
    }
  });
}

