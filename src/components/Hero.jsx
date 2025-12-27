import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../constants';
import { Github, Linkedin, Mail, Copy } from 'lucide-react';
import heroImage from '../assets/charishma_portfolio.png';
import resumePdf from '../assets/Charishma N Resume.pdf';

export default function Hero() {
  const [spot, setSpot] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(portfolioData.profile.socials.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <section id="home" className="relative scroll-mt-24">
      <div
        className="relative min-h-[60vh] bg-slate-900 grid-pattern overflow-hidden pt-24 pb-14 sm:pt-28 sm:pb-16"
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
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05]"
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              }}
            >
              Full-Stack Engineer (5 years) building real-time, cloud-native products.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-4 text-slate-300 max-w-2xl"
            >
              React/React Native • TypeScript • Node.js • Spring Boot • AWS/Firebase • Microservices • OAuth/JWT
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-3 text-slate-200 font-medium"
            >
              99.99% uptime • Deployments +40% faster • DB latency −35% • 2,000+ WAU
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <a
                href={resumePdf}
                download
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
              >
                Download Resume
              </a>
              <a
                href={resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-500 transition-colors"
              >
                Open Resume
              </a>
              <a
                href="#projects"
                className="px-4 py-2 rounded-md bg-slate-100/10 border border-white/10 text-white hover:bg-slate-100/20 transition-colors"
              >
                View Projects
              </a>
              <div className="flex items-center gap-4 ml-2 text-slate-300">
                <a
                  href={portfolioData.profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Github size={16} />
                  <span>GitHub</span>
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
                  href={`mailto:${portfolioData.profile.socials.email}`}
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail size={16} />
                  <span>Email</span>
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors"
                  aria-label="Copy email"
                >
                  <Copy size={14} />
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* PlayGround App */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="text-white font-semibold">PlayGround App</div>
                  <div className="text-slate-300 text-sm">RN + Firebase</div>
                  <div className="text-teal-300 text-sm mt-1">2,000+ WAU</div>
                  <div className="flex gap-3 mt-3 text-sm">
                    <a
                      href="https://res.cloudinary.com/dlmpwxayb/video/upload/v1766210847/Playground-App_cbwrgg.mp4"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-300 hover:text-indigo-200"
                    >
                      Demo
                    </a>
                    <a href="#projects" className="text-slate-300 hover:text-white">
                      Case Study
                    </a>
                  </div>
                </div>
                {/* MCESC / Macy’s */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="text-white font-semibold">MCESC / Macy’s</div>
                  <div className="text-slate-300 text-sm">Microservices on AWS</div>
                  <div className="text-teal-300 text-sm mt-1">99.99% uptime • 40% faster deploys</div>
                  <div className="flex gap-3 mt-3 text-sm">
                    <a href="#projects" className="text-slate-300 hover:text-white">
                      Case Study
                    </a>
                  </div>
                </div>
                {/* Code Review Agent */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="text-white font-semibold">Code Review Agent</div>
                  <div className="text-slate-300 text-sm">FastAPI + OpenAI + GH Actions</div>
                  <div className="text-teal-300 text-sm mt-1">40% faster reviews</div>
                  <div className="flex gap-3 mt-3 text-sm">
                    <a
                      href="https://github.com/nadipaca/ai-code-review-assistant"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-white"
                    >
                      Repo
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Static image (replaces orbit animation) */}
          <div className="flex items-center justify-center relative z-0 mt-8 md:mt-0">
            <img
              src={heroImage}
              alt="Charishma portfolio hero"
              className="w-[340px] h-auto xl:w-[420px] rounded-2xl border border-white/10 shadow-lg shadow-blue-500/10"
            />
          </div>
        </div>
      </div>

      {/* Impact Highlights strip */}
      <div className="bg-slate-800/60 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-teal-200 text-sm">
              99.99% uptime
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-teal-200 text-sm">
              Deploy speed +40%
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-teal-200 text-sm">
              DB latency −35%
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-teal-200 text-sm">
              WAU 2,000+
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

