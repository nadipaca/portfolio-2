// Contact form API endpoint
// This endpoint handles contact form submissions and sends emails

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // TODO: Replace with your email sending service
    // Options:
    // 1. SendGrid: https://sendgrid.com
    // 2. Resend: https://resend.com
    // 3. Nodemailer with SMTP
    // 4. AWS SES
    // 5. Mailgun
    
    // Example with Resend (uncomment and configure):
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'your-email@example.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });
    */

    // For now, log the submission (replace with actual email sending)
    console.log('Contact form submission:', { name, email, message });

    // If you want to use a service like Resend, uncomment the code above
    // and add your API key to environment variables

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      error: 'Failed to send message. Please try again later.' 
    });
  }
}

