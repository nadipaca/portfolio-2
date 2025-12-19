import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, Linkedin, Mail, Menu, MessageCircle, X } from 'lucide-react';
import { portfolioData } from '../constants';

export default function Navbar({ onOpenChat }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // FIX 1: Ensure we catch the scroll even if body has overflow quirks
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
    { label: 'Certifications', href: '#certifications' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      // FIX 2: Z-Index 50 ensures it stays above the Hero section
      // Logic: If Scrolled OR Menu Open -> Dark background. Else -> Transparent
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? 'bg-slate-900/95 backdrop-blur-xl shadow-lg border-b border-white/10'
          : 'bg-transparent backdrop-blur-none border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 1. LOGO */}
          <div className="flex-shrink-0 cursor-pointer">
            <a href="#" className="text-white font-extrabold text-xl tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-teal-200 bg-clip-text text-transparent">
                CN
              </span>
            </a>
          </div>

          {/* 2. DESKTOP MENU (Visible ONLY on 768px+) */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="h-6 w-px bg-white/10 mx-2" />

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <a href={portfolioData.profile.socials.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors"><Github size={18} /></a>
                <a href={portfolioData.profile.socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={18} /></a>
                <a href={`mailto:${portfolioData.profile.socials.email}`} className="text-slate-400 hover:text-white transition-colors"><Mail size={18} /></a>
              </div>
              <button
                onClick={() => onOpenChat?.()}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-100 hover:bg-blue-600/20 transition-all"
              >
                <MessageCircle size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Chat</span>
              </button>
            </div>
          </div>

          {/* 3. MOBILE MENU TOGGLE (Visible on < 768px) */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-200 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. MOBILE DROPDOWN */}
      {/* FIX 3: This is now OUTSIDE the 'max-w-7xl' div, but inside the 'nav'. 
          Result: The background will stretch full screen width. */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-slate-900 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-lg font-medium text-slate-300 hover:text-white hover:translate-x-2 transition-transform"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              <div className="pt-6 mt-6 border-t border-white/10 flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenChat?.();
                  }}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Chat with AI
                </button>
                <div className="flex justify-center gap-8 text-slate-400">
                  <a href={portfolioData.profile.socials.github} target="_blank" rel="noreferrer"><Github size={24} /></a>
                  <a href={portfolioData.profile.socials.linkedin} target="_blank" rel="noreferrer"><Linkedin size={24} /></a>
                  <a href={`mailto:${portfolioData.profile.socials.email}`}><Mail size={24} /></a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}