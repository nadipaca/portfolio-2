import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare } from 'lucide-react';
import SectionWrapper from './ui/SectionWrapper';
import SectionHeader from './ui/SectionHeader';
import FormField from './ui/FormField';
import Button from './ui/Button';
import { fadeInUp } from '../utils/animations';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionWrapper id="contact" className="max-w-4xl">
      <SectionHeader
        title="Get In Touch"
        subtitle="Have a question or want to work together? Send me a message!"
      />

      <motion.div
        {...fadeInUp}
        transition={{ delay: 0.2 }}
        className="bg-slate-900/90 rounded-3xl shadow-lg border border-orange-400/20 p-8 md:p-12"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
              <MessageSquare size={16} className="inline mr-2" />
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
            {status.message && (
              <div
                className={`p-4 rounded-lg ${
                  status.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                }`}
              >
                {status.message}
              </div>
            )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2"
          >
            <Send size={18} />
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </motion.div>
    </SectionWrapper>
  );
}

