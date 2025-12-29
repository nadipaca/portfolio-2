import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare, Linkedin, Copy, Check } from 'lucide-react';
import SectionWrapper from './ui/SectionWrapper';
import SectionHeader from './ui/SectionHeader';
import FormField from './ui/FormField';
import Button from './ui/Button';
import { fadeInUp } from '../utils/animations';
import { portfolioData } from '../constants';
import { apiFetch } from '../utils/api';

export default function Contact() {
  const email = portfolioData.profile.socials.email;
  const linkedinUrl = portfolioData.profile.socials.linkedin;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    website: '' // Honeypot field
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'
  const [emailCopied, setEmailCopied] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await apiFetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        setStatus('sent');
        setFormData({ name: '', email: '', company: '', message: '', website: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  // Create mailto link with pre-filled subject and body
  const subject = encodeURIComponent('Portfolio Inquiry — Full-Stack Role');
  const body = encodeURIComponent(
    `Hi Charishma,\n\nI saw your portfolio and would like to connect about...\n\nThanks,\n`
  );
  const mailto = `mailto:${email}?subject=${subject}&body=${body}`;

  return (
    <SectionWrapper id="contact">
      <SectionHeader
        title="Get In Touch"
        subtitle="Have a question or want to work together? Let's connect!"
      />

      <div className="max-w-4xl mx-auto">
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/90 rounded-3xl shadow-lg border border-orange-400/20 p-8 md:p-12"
        >
          {/* Action Buttons - Shown First */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                as="a"
                href={mailto}
                variant="primary"
                size="lg"
                className="flex items-center gap-2"
              >
                <Mail size={18} />
                Email me
              </Button>
              
              <Button
                as="a"
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
                className="flex items-center gap-2"
              >
                <Linkedin size={18} />
                LinkedIn
              </Button>
              
              <Button
                onClick={handleCopyEmail}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                {emailCopied ? (
                  <>
                    <Check size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy email
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Optional Contact Form */}
          <div className="border-t border-white/10 pt-8">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">
              Or send a message
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field (hidden) */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Name"
                  icon={<User size={16} />}
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />

                <FormField
                  label="Email"
                  icon={<Mail size={16} />}
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                />
              </div>

              <FormField
                label="Company (optional)"
                icon={<User size={16} />}
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company"
              />

              <div>
                <label htmlFor="message" className="flex items-center text-sm font-medium text-slate-300 mb-2">
                  <MessageSquare size={16} className="mr-2" />
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>

              {/* Status Message */}
              {status === 'sent' && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
                  Sent! I'll reply soon.
                </div>
              )}
              
              {status === 'error' && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                  Something went wrong. Please email me directly.
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2"
              >
                <Send size={18} />
                {status === 'sending' ? 'Sending...' : 'Send message'}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

