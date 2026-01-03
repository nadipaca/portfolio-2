import { Resend } from 'resend';

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body.length) {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  // Some runtimes may not populate req.body; fall back to reading the stream.
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const { name, email, message, company, website } = await readJsonBody(req);

    // Honeypot: if filled, it's a bot - silently return success
    if (website && String(website).trim().length > 0) {
      return res.status(200).json({ ok: true });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email))) {
      return res.status(400).json({ ok: false, error: 'Invalid email address' });
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ ok: false, error: 'Missing RESEND_API_KEY' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const to =
      process.env.CONTACT_TO_EMAIL ||
      process.env.CONTACT_EMAIL ||
      process.env.EMAIL_USER ||
      'nadipaca@mail.uc.edu';

    // Use a verified sender from your domain in production
    const from = process.env.CONTACT_FROM_EMAIL || 'contact@charishmanadipalli.site';

      const result = await resend.emails.send({
      from,
      to,
      reply_to: String(email),
      subject: `Portfolio Contact: ${String(name)}${company ? ` (${company})` : ''}`,
      text:
        `Name: ${String(name)}\n` +
        `Email: ${String(email)}\n` +
        (company ? `Company: ${String(company)}\n` : '') +
        `\nMessage:\n${String(message)}\n`,
      headers: { 'X-Contact-Source': 'portfolio-site' },
    });

    if (result && result.error) {
      console.error('Resend send error:', result.error);
      return res.status(502).json({ ok: false, error: 'Email send failed' });
    }

    console.log('Resend email queued:', result?.id, 'from:', from, 'to:', to);
    return res.status(200).json({ ok: true, id: result?.id || null });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ ok: false, error: 'Failed to send message. Please try again later.' });
  }
}

