/**
 * Helper to escape HTML characters in email templates
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Core validation and Resend email sending handler
 * Can be reused across Vite dev middleware and Vercel serverless function
 */
export async function handleContactSubmission(body) {
  const { name, email, subject, message } = body || {};

  // 1. Validation & Sanitization
  if (!name || typeof name !== 'string' || !name.trim()) {
    return {
      status: 400,
      json: { success: false, error: 'Full Name is required.' }
    };
  }

  const trimmedName = name.trim().slice(0, 100);

  if (!email || typeof email !== 'string' || !email.trim()) {
    return {
      status: 400,
      json: { success: false, error: 'Email Address is required.' }
    };
  }

  const trimmedEmail = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 254) {
    return {
      status: 400,
      json: { success: false, error: 'Please enter a valid email address.' }
    };
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return {
      status: 400,
      json: { success: false, error: 'Message cannot be empty.' }
    };
  }

  const trimmedMessage = message.trim().slice(0, 5000);
  const trimmedSubject = typeof subject === 'string' && subject.trim()
    ? subject.trim().slice(0, 200)
    : `Portfolio Inquiry from ${trimmedName}`;

  // 2. Check Resend API Key
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !apiKey.trim() || apiKey.trim() === 'your_resend_api_key_here') {
    return {
      status: 503,
      json: {
        success: false,
        error: 'Resend API key is not configured. Please add your RESEND_API_KEY to your .env file.',
        code: 'MISSING_API_KEY'
      }
    };
  }

  // 3. Send email via Resend
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey.trim());

    const recipient = process.env.CONTACT_RECIPIENT_EMAIL || 'atiyajas2812@gmail.com';
    const sender = process.env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #4D3A4D; margin-top: 0; border-bottom: 2px solid #BE5CA9; padding-bottom: 12px; font-size: 22px;">New Message from Portfolio</h2>
        <p style="margin: 10px 0; font-size: 15px; color: #333333;"><strong>From:</strong> ${escapeHtml(trimmedName)}</p>
        <p style="margin: 10px 0; font-size: 15px; color: #333333;"><strong>Email:</strong> <a href="mailto:${escapeHtml(trimmedEmail)}" style="color: #BE5CA9; text-decoration: none;">${escapeHtml(trimmedEmail)}</a></p>
        <p style="margin: 10px 0; font-size: 15px; color: #333333;"><strong>Subject:</strong> ${escapeHtml(trimmedSubject)}</p>
        <hr style="border: none; border-top: 1px solid #f0e6ee; margin: 20px 0;" />
        <h3 style="color: #4D3A4D; margin-bottom: 8px; font-size: 16px;">Message:</h3>
        <div style="background-color: #fdf6fa; padding: 18px; border-radius: 8px; border-left: 4px solid #BE5CA9; white-space: pre-wrap; color: #4D3A4D; font-size: 15px; line-height: 1.6;">${escapeHtml(trimmedMessage)}</div>
        <hr style="border: none; border-top: 1px solid #f0e6ee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888888; margin: 0;">Sent directly from Atiya Ali's Developer Portfolio Contact Form.</p>
      </div>
    `;

    const textContent = `New message from ${trimmedName} (${trimmedEmail}):\nSubject: ${trimmedSubject}\n\n${trimmedMessage}`;

    const { data, error } = await resend.emails.send({
      from: sender,
      to: [recipient],
      replyTo: trimmedEmail,
      subject: `[Portfolio] ${trimmedSubject}`,
      html: htmlContent,
      text: textContent
    });

    if (error) {
      console.error('[Resend API Error]:', error);
      return {
        status: 502,
        json: {
          success: false,
          error: error.message || 'Resend failed to deliver the email. Please verify your domain and API key.'
        }
      };
    }

    return {
      status: 200,
      json: {
        success: true,
        message: 'Message delivered successfully to inbox!',
        id: data?.id
      }
    };
  } catch (err) {
    console.error('[Contact Handler Error]:', err);
    return {
      status: 500,
      json: {
        success: false,
        error: err.message || 'An unexpected error occurred while delivering your email.'
      }
    };
  }
}

