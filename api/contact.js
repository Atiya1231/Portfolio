import { handleContactSubmission } from '../server/contactHandler.js';

/**
 * Standard Vercel Serverless Function Handler
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const result = await handleContactSubmission(req.body);
  return res.status(result.status).json(result.json);
}

