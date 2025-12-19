import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../constants';
import { Github, Linkedin, Mail } from 'lucide-react';
import ArchitectureHero from './ArchitectureHero';

export default function Hero() {
  const [spot, setSpot] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);

  return (
    <section id="home" className="relative scroll-mt-24">
      {/* Dark Top Section (60%) */}
      <div
        className="relative min-h-[60vh] bg-slate-900 grid-pattern overflow-hidden pt-24 pb-14 sm:pt-28 sm:pb-16"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[60vh] grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white w-full text-center md:text-left z-10"
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05]"
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
              className="mt-4 flex items-center justify-center md:justify-start gap-3 text-slate-300"
            >
              <span className="text-slate-400">{'>'}</span>
              <span className="text-teal-300 font-semibold">{portfolioData.profile.role}</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-6 text-slate-300 leading-relaxed max-w-xl mx-auto md:mx-0"
            >
              {portfolioData.profile.bio}
            </motion.p>

            {/* Engineering philosophy (bullet box) */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.6 }}
              className="mt-6 max-w-xl mx-auto md:mx-0"
            >
              <div className="rounded-2xl border border-white/10 bg-slate-950/30 backdrop-blur-sm p-4">
                <div className="text-xs font-bold tracking-[0.18em] uppercase text-slate-200/80 font-mono">
                  Engineering Philosophy
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  <li className="flex gap-2">
                    <span className="text-teal-300">•</span>
                    <span>Design for reliability first (latency, retries, backpressure).</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal-300">•</span>
                    <span>Keep boundaries crisp: services, events, and contracts.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal-300">•</span>
                    <span>Measure everything: logs, metrics, traces, and cost.</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* CTA buttons (keeps existing links intact) */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.6 }}
              className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3"
            >
              <a
                href="#projects"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
              >
                View Projects
              </a>
              <a
                href={`mailto:${portfolioData.profile.socials.email}`}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 font-semibold hover:bg-white/10 transition-colors"
              >
                Contact
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-slate-300"
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
              className="mt-8 flex justify-center md:justify-start"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/20 border border-indigo-500/50 rounded-full text-indigo-200 shadow-lg shadow-indigo-500/10">
                {portfolioData.profile.availability}
              </span>
            </motion.div>
          </motion.div>

          {/* Right-side: Live System Architecture (hidden on small screens) */}
          <div className="hidden md:flex items-center justify-center relative z-0 mt-8 md:mt-0">
            <div className="scale-[0.86] lg:scale-100 origin-center transform-gpu">
              <ArchitectureHero />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

