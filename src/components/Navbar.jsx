// ...existing code...
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Menu, MessageCircle, X } from 'lucide-react';
import { portfolioData } from '../constants';

export default function Navbar({ onOpenChat }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contacts', href: '#footer' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl shadow-lg border-b border-orange-400/20 transition-all">
      <div className="px-8 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#" className="text-white font-extrabold text-xl tracking-tight">
              <span className="bg-gradient-to-r from-white via-orange-300 to-orange-400 bg-clip-text text-transparent">Charishma Nadipalli</span>
            </a>
          </div>

          {/* Desktop/Tablet Navigation (visible ≥ sm, avoids Tailwind `hidden`) */}
          <div className="nav-desktop items-center gap-6">
            {/* Links */}
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-slate-300 hover:text-white transition-colors font-medium relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-orange-400 after:transition-all hover:after:w-full"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Extras (Chat + socials) */}
            <div className="nav-desktop items-center gap-3 lg:gap-4">
              <button
                type="button"
                onClick={() => onOpenChat?.()}
                className="ml-1 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-white/10 text-slate-100 hover:bg-white/15 transition-colors"
              >
                <MessageCircle size={16} />
                <span className="hide-below-lg text-sm font-semibold">Chat with me</span>
              </button>
              <div className="flex items-center space-x-3 lg:space-x-4 ml-1">
                <a href={portfolioData.profile.socials.github} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">
                  <Github size={20} />
                </a>
                <a href={portfolioData.profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href={`mailto:${portfolioData.profile.socials.email}`} className="text-slate-300 hover:text-white transition-colors">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button (visible < sm) */}
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            className="sm:hidden text-white p-2 rounded-md hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu (slide-down, < sm) */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden py-4 space-y-4"
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
              <span className="text-sm font-semibold">Chat</span>
            </button>
            <div className="flex items-center space-x-4 pt-4">
              <a href={portfolioData.profile.socials.github} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href={portfolioData.profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href={`mailto:${portfolioData.profile.socials.email}`} className="text-slate-300 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}