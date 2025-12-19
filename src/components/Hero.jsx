import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { portfolioData } from '../constants';
import { Database, Github, Linkedin, Mail } from 'lucide-react';
import { SiAmazonwebservices, SiPython, SiReact, SiSpringboot } from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

function TechRadar() {
  const reduceMotion = useReducedMotion();
  const orbitDuration = 30; // seconds per full rotation

  const orbitRotate = useMotionValue(0);
  const counterRotate = useTransform(orbitRotate, (v) => -v);

  const orbitAnimRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(null);

  const nodes = [
    { key: 'java', label: 'Java', Icon: FaJava, color: 'text-orange-300', x: 0, y: -150 },
    { key: 'spring', label: 'Spring Boot', Icon: SiSpringboot, color: 'text-green-300', x: 130, y: -75 },
    { key: 'aws', label: 'AWS', Icon: SiAmazonwebservices, color: 'text-amber-200', x: 130, y: 80 },
    { key: 'db', label: 'Database', Icon: Database, color: 'text-sky-200', x: 0, y: 150 },
    { key: 'react', label: 'React', Icon: SiReact, color: 'text-cyan-200', x: -130, y: 80 },
    { key: 'python', label: 'Python', Icon: SiPython, color: 'text-yellow-200', x: -130, y: -75 },
  ];

  useEffect(() => {
    if (reduceMotion || paused) {
      orbitAnimRef.current?.stop?.();
      orbitAnimRef.current = null;
      return;
    }

    const from = orbitRotate.get();
    // Keep rotation continuous from current angle; periodicity makes looping seamless.
    orbitAnimRef.current = animate(orbitRotate, from + 360, {
      duration: orbitDuration,
      ease: 'linear',
      repeat: Infinity,
    });

    return () => {
      orbitAnimRef.current?.stop?.();
      orbitAnimRef.current = null;
    };
  }, [orbitRotate, orbitDuration, paused, reduceMotion]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.25, duration: 0.8 }}
      className="relative w-[340px] h-[340px] xl:w-[380px] xl:h-[380px]"
      aria-hidden="true"
    >
      {/* ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-blue-500/10 rounded-full blur-[60px]" />
        <div className="absolute -bottom-12 -left-10 w-64 h-64 bg-teal-500/10 rounded-full blur-[60px]" />
        <div className="absolute inset-8 border border-white/5 rounded-full" />
        <div className="absolute inset-24 border border-white/5 rounded-full" />
      </div>

      {/* orbiting layer */}
      <motion.div className="absolute inset-0" style={{ rotate: orbitRotate }}>
        {/* connector lines (animated data flow) */}
        <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 380 380">
          <defs>
            <linearGradient id="radarLine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(59,130,246,0.10)" />
              <stop offset="50%" stopColor="rgba(59,130,246,0.40)" />
              <stop offset="100%" stopColor="rgba(20,184,166,0.10)" />
            </linearGradient>
            <mask id="mask-center">
              <circle cx="190" cy="190" r="64" fill="black" />
              <rect x="0" y="0" width="380" height="380" fill="white" />
            </mask>
          </defs>

          {/* Circular orbit path */}
          <circle
            cx="190"
            cy="190"
            r="148"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="4 6"
          />

          {/* Spokes with active data flow */}
          {nodes.map((n) => (
            <motion.line
              key={n.key}
              x1="190"
              y1="190"
              x2={190 + n.x}
              y2={190 + n.y}
              stroke="url(#radarLine)"
              strokeWidth="2"
              strokeDasharray="8 6"
              mask="url(#mask-center)"
              animate={reduceMotion ? {} : { strokeDashoffset: [0, -28] }}
              transition={reduceMotion ? {} : { duration: 1.6, repeat: Infinity, ease: 'linear' }}
              opacity="0.95"
            />
          ))}
        </svg>

        {/* Tech nodes (counter-rotated + hover) */}
        {nodes.map((n, idx) => (
          <div
            key={n.key}
            className="absolute left-1/2 top-1/2 pointer-events-auto group"
            style={{ transform: `translate(-50%, -50%) translate(${n.x}px, ${n.y}px)` }}
            onMouseEnter={() => {
              setPaused(true);
              setHovered(n.key);
            }}
            onMouseLeave={() => {
              setHovered(null);
              setPaused(false);
            }}
          >
            <motion.div style={{ rotate: counterRotate }} className="relative">
              <motion.div
                // Stop bobbing on hover so targeting feels stable
                animate={
                  reduceMotion || hovered === n.key
                    ? { y: 0 }
                    : { y: [0, -8, 0] }
                }
                transition={
                  reduceMotion || hovered === n.key
                    ? { duration: 0.2 }
                    : { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.25 }
                }
              >
                {/* Slightly larger hit-area (helps hover while orbiting) */}
                <div className="-m-2 p-2 cursor-pointer">
                  <motion.div
                    whileHover={{ scale: 1.18, boxShadow: '0 0 20px rgba(59,130,246,0.35)' }}
                    className={`relative w-14 h-14 rounded-2xl border backdrop-blur-xl flex items-center justify-center shadow-lg overflow-hidden transition-colors ${
                      hovered === n.key
                        ? 'border-blue-400/50 bg-slate-900/80'
                        : 'border-sky-300/25 bg-gradient-to-br from-sky-400/20 via-blue-500/10 to-indigo-500/10'
                    }`}
                  >
                    <div className="absolute inset-0 bg-sky-400/10" />
                    <div className="absolute -inset-6 bg-cyan-400/10 blur-2xl" />
                    <n.Icon className={`${n.color} relative transition-all duration-300 group-hover:brightness-125`} size={28} />
                  </motion.div>
                </div>
              </motion.div>

              {/* Hover label */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                <span className="text-[10px] text-slate-200 font-mono bg-black/40 px-2 py-0.5 rounded border border-white/10">
                  {n.label}
                </span>
              </div>
            </motion.div>
          </div>
        ))}
      </motion.div>

      {/* Core (static center, pulse speeds up on hover) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  boxShadow: [
                    '0 0 0 0px rgba(59,130,246,0.0)',
                    '0 0 0 22px rgba(59,130,246,0.10)',
                    '0 0 0 0px rgba(59,130,246,0.0)',
                  ],
                }
          }
          transition={reduceMotion ? {} : { duration: paused ? 1.5 : 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-32 h-32 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-md flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-teal-500/20" />
          <div className="relative text-center z-10">
            <div className="text-[10px] tracking-[0.2em] text-blue-300/80 font-bold uppercase mb-1">CORE AI</div>
            <div className="text-base font-black text-white tracking-tight drop-shadow-lg">Microservices</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

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

          {/* Tech Radar (single instance, stacks on mobile, side-by-side on tablet+) */}
          <div className="flex items-center justify-center relative z-0 mt-8 md:mt-0">
            <div className="scale-90 xl:scale-100 transform-gpu">
              <TechRadar />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

