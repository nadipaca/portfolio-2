import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { z } from 'zod';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Resend (only if API key is available)
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('⚠️  RESEND_API_KEY not set. Contact form emails will not be sent.');
}

// Zod schema for contact form validation
const contactSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email().max(120),
  message: z.string().min(10).max(2000),
  company: z.string().max(120).optional(),
  website: z.string().optional(), // Honeypot field
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const json = req.body;
    
    // Validate with Zod
    const data = contactSchema.parse(json);

    // Honeypot: if filled, it's a bot - silently return success
    if (data.website && data.website.trim().length > 0) {
      return res.status(200).json({ ok: true });
    }

    // Check if Resend is configured
    if (!resend || !process.env.RESEND_API_KEY) {
      console.error('Resend API key missing. Please set RESEND_API_KEY in .env file');
      // In development, log the submission instead of failing
      console.log('Contact form submission (email not sent):', {
        name: data.name,
        email: data.email,
        company: data.company,
        message: data.message
      });
      return res.status(200).json({ 
        ok: true,
        message: 'Message received (email service not configured - check server logs)' 
      });
    }

    const to = process.env.CONTACT_TO_EMAIL || process.env.EMAIL_USER || 'nadipaca@mail.uc.edu';
    const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>';

    // Send email via Resend
    await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Portfolio Contact: ${data.name}${data.company ? ` (${data.company})` : ''}`,
      text:
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        (data.company ? `Company: ${data.company}\n` : '') +
        `\nMessage:\n${data.message}\n`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #fb923c;">New Contact Form Submission</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">${data.message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
            This message was sent from your portfolio contact form.
          </p>
        </div>
      `,
    });

    console.log(`Contact form submission received from ${data.name} (${data.email})`);

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        ok: false,
        error: 'Invalid form data. Please check your inputs.' 
      });
    }
    
    return res.status(400).json({ 
      ok: false,
      error: 'Failed to send message' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

