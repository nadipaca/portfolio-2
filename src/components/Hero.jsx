import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroImage from '../assets/charishma_portfolio.png';
import resumePdf from '../assets/Charishma N Resume.pdf';

export default function Hero() {
  const [spot, setSpot] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);

  return (
    <section id="home" className="relative scroll-mt-24">
      <div
        className="relative min-h-[70vh] diagonal-gradient overflow-hidden pt-24 pb-14 sm:pt-28 sm:pb-16"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[70vh] grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Section */}
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
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold leading-tight text-white"
              style={{
                fontFamily:
                  'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
              }}
            >
              Software developer building real-time cloud-native products.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="#projects"
                className="px-6 py-3 rounded-md bg-orange-600 text-white hover:bg-orange-500 transition-colors font-semibold"
              >
                View Projects
              </a>
              <a
                href={resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-md bg-transparent border-2 border-orange-600 text-white hover:bg-orange-600/10 transition-colors font-semibold"
              >
                View Resume
              </a>
            </motion.div>
          </motion.div>

          {/* Right Section */}
          <div className="flex items-center justify-center md:justify-end relative z-0 mt-8 md:mt-0">
            <div className="relative w-full max-w-md">
              {/* Big left arrow on top left */}
              <div className="absolute -top-8 -left-8 md:-top-12 md:-left-12 z-20">
                <ChevronLeft size={80} className="text-orange-500" strokeWidth={1.5} />
              </div>
              
              {/* Orange circle around image */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full border-4 border-orange-500" />
                <img
                  src={heroImage}
                  alt="Charishma Nadipalli portrait"
                  className="relative w-[240px] h-[240px] md:w-[280px] md:h-[280px] rounded-full border-2 border-white/10 shadow-lg shadow-orange-500/20 object-cover z-10"
                />
              </div>

              {/* Closing tag on bottom right */}
              <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 z-20">
                <ChevronRight size={60} className="text-orange-500" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech stack banner */}
      <div className="chip-strip bg-slate-950/50 border-t border-white/5 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-white">
            {['HTML5', 'CSS', 'Javascript', 'Node.js', 'React', 'Git', 'Github'].map((chip) => (
              <span key={chip} className="px-4 py-2 text-sm font-medium text-white">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

