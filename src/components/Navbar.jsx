import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Menu, MessageCircle, X } from 'lucide-react';
import { portfolioData } from '../constants';

export default function Navbar({ onOpenChat }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-white/10'
          : 'bg-slate-900/30 backdrop-blur-md border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#" className="text-white font-extrabold text-xl tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-teal-200 bg-clip-text text-transparent">
                CN
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-slate-300 hover:text-white transition-colors font-medium relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-blue-400 after:transition-all hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => onOpenChat?.()}
              className="ml-1 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-white/10 text-slate-100 hover:bg-white/15 transition-colors"
            >
              <MessageCircle size={16} />
              <span className="text-sm font-semibold">Chat with me</span>
            </button>
            <div className="flex items-center space-x-4 ml-4">
              <a
                href={portfolioData.profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href={portfolioData.profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={`mailto:${portfolioData.profile.socials.email}`}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 space-y-4"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-slate-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat?.();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-slate-100 hover:bg-white/15 transition-colors"
            >
              <MessageCircle size={16} />
              <span className="text-sm font-semibold">Chat with me</span>
            </button>
            <div className="flex items-center space-x-4 pt-4">
              <a
                href={portfolioData.profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href={portfolioData.profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={`mailto:${portfolioData.profile.socials.email}`}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

