import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../constants';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Hero() {
  const [spot, setSpot] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);

  return (
    <section id="home" className="relative scroll-mt-24">
      {/* Dark Top Section (60%) */}
      <div
        className="relative min-h-[60vh] bg-slate-900 grid-pattern overflow-hidden py-14 sm:py-16 lg:py-0"
        onMouseMove={(e) => {
          // subtle mouse-reactive glow (throttled)
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => setSpot({ x, y }));
        }}
      >
        {/* Mesh glow overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(650px circle at ${spot.x}px ${spot.y}px, rgba(59,130,246,0.18), transparent 55%),
                         radial-gradient(700px circle at 20% 30%, rgba(99,102,241,0.12), transparent 50%),
                         radial-gradient(700px circle at 80% 80%, rgba(20,184,166,0.10), transparent 55%)`,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[60vh] flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white w-full text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-6xl font-extrabold leading-[1.05]"
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              }}
            >
              {portfolioData.profile.name.split(' ')[0]}
              <br />
              {portfolioData.profile.name.split(' ').slice(1).join(' ')}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="mt-4 flex items-center justify-center lg:justify-start gap-3 text-slate-300"
            >
              <span className="text-slate-400">{'>'}</span>
              <span className="text-teal-300 font-semibold">{portfolioData.profile.role}</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-6 text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              {portfolioData.profile.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-300"
            >
              <a
                href={`mailto:${portfolioData.profile.socials.email}`}
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail size={16} />
                <span>Email</span>
              </a>
              <a
                href={portfolioData.profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <Linkedin size={16} />
                <span>LinkedIn</span>
              </a>
              <a
                href={portfolioData.profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <Github size={16} />
                <span>GitHub</span>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-8 flex justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/20 border border-indigo-500/50 rounded-full text-indigo-200 shadow-lg shadow-indigo-500/10">
                {portfolioData.profile.availability}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

