import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../constants';
import { Github, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react';
import heroImage from '../assets/charishma_portfolio.png';
import resumePdf from '../assets/Charishma N Resume.pdf';

export default function Hero() {
  const [spot, setSpot] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);
  // No subliner or email copy CTA in hero per latest preferences

  return (
    <section id="home" className="relative scroll-mt-24">
      <div
        className="relative min-h-[60vh] diagonal-gradient overflow-hidden pt-24 pb-14 sm:pt-28 sm:pb-16"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => setSpot({ x, y }));
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(650px circle at ${spot.x}px ${spot.y}px, rgba(234,88,12,0.18), transparent 55%),
                         radial-gradient(700px circle at 20% 30%, rgba(244,63,94,0.10), transparent 50%),
                         radial-gradient(700px circle at 80% 80%, rgba(234,88,12,0.10), transparent 55%)`,
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
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold leading-tight"
              style={{
                fontFamily:
                  'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
              }}
            >
              Full-Stack Engineer building real-time, cloud-native products.
            </motion.h1>
            {/* Tech chips */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {['React', 'Node.js', 'Spring Boot', 'AWS', 'Microservices', 'AI'].map((chip) => (
                <span key={chip} className="px-3 py-1.5 text-xs rounded-full border border-white/10 bg-white/5 text-slate-200">
                  {chip}
                </span>
              ))}
            </motion.div>

            {/* Proof metrics as pills */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-5 flex flex-wrap items-center gap-3"
            >
              {[
                '99.99% uptime',
                '+40% faster deploys',
                '−35% DB latency',
                '2,000+ WAU',
              ].map((m) => (
                <span key={m} className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-emerald-200 text-sm">
                  {m}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <a
                href={resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-500 transition-colors"
              >
                View Resume
              </a>
              <a
                href={resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 hover:text-emerald-200 text-sm underline underline-offset-4"
              >
                Download as PDF
              </a>
              <a
                href="#projects"
                className="px-4 py-2 rounded-md bg-orange-600/20 border border-orange-600/40 text-orange-200 hover:bg-orange-600/30 transition-colors"
              >
                View Projects
              </a>
            </motion.div>

            {/* Featured project cards removed from hero to reduce clutter */}
          </motion.div>

          {/* Right: Static image (replaces orbit animation) */}
          <div className="flex items-start justify-center md:justify-end relative z-0 mt-8 md:mt-0">
            <div className="relative flex flex-col items-center">
              {/* Accent rings behind photo */}
              <div className="absolute -top-6 -left-10 w-10 h-10 text-orange-400/40">
                <ChevronLeft size={40} />
              </div>
              <div className="absolute -top-6 -right-10 w-10 h-10 text-orange-400/40">
                <ChevronRight size={40} />
              </div>
              <div className="absolute inset-0 -z-10 flex items-center justify-center">
                <div className="w-[260px] h-[260px] rounded-full border-4 border-orange-500/30" />
                <div className="absolute w-[200px] h-[200px] rounded-full border-2 border-orange-400/20" />
                <div className="absolute w-[300px] h-[300px] rounded-full bg-orange-500/10 blur-3xl" />
              </div>
              <img
                src={heroImage}
                alt="Charishma Nadipalli portrait"
                className="w-[220px] h-[220px] xl:w-[260px] xl:h-[260px] rounded-full border border-white/10 shadow-lg shadow-orange-500/10 object-cover"
              />
              <div className="mt-3 text-center">
                <div className="text-white font-semibold">Charishma Nadipalli</div>
                <div className="text-slate-300 text-sm">Full-Stack Engineer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech chip strip banner like reference */}
      <div className="chip-strip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap justify-center gap-4 text-slate-300">
            {['React', 'Node.js', 'Spring Boot', 'AWS', 'Microservices', 'AI'].map((chip) => (
              <span key={chip} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

