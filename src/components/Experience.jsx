import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { portfolioData } from '../constants';
import ArchitectureFlowModal from './ArchitectureFlowModal';

// Visual Card Component (for MCESC)
function VisualCard({ experience, index, isActive, expanded, onToggle }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % experience.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + experience.gallery.length) % experience.gallery.length);
  };

  // Auto-play carousel (advance every 4 seconds, pauses on hover)
  useEffect(() => {
    if (!expanded || experience.gallery.length <= 1 || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % experience.gallery.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [expanded, experience.gallery.length, isPaused]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative ml-6 md:ml-10"
    >
      {/* Card */}
      <motion.div
        className="bg-slate-900/95 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border-2 border-white/10 group/card"
        animate={{
          borderColor: isActive ? '#fb923c' : 'rgba(255, 255, 255, 0.12)',
          boxShadow: isActive
            ? '0 20px 25px -5px rgba(234, 88, 12, 0.18), 0 10px 10px -5px rgba(234, 88, 12, 0.12)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.25)',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Always-visible headline (click to expand) */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="w-full text-left p-6 pb-5 relative group/button"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className={`text-xl font-semibold mb-1 ${isActive ? 'text-orange-400' : 'text-white'}`}>
                {experience.role}
              </h3>
              <p className="text-slate-300 font-medium">{experience.company}</p>
              <p className="text-sm text-slate-400 mt-1">{experience.period}</p>
            </div>
            <div className="relative flex items-center">
              {/* Hover text - only show when collapsed */}
              {!expanded && (
                <span className="absolute right-12 mr-2 px-2 py-1 bg-slate-800 text-white text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover/button:opacity-100 transition-opacity duration-200 pointer-events-none z-10 border border-white/10">
                  See more details
                </span>
              )}
              <span
                className={`mt-1 inline-flex items-center justify-center h-9 w-9 rounded-full border transition-all ${
                  expanded 
                    ? 'border-orange-400/30 bg-orange-400/10 text-orange-400' 
                    : 'border-white/10 bg-slate-800 text-slate-300 group-hover/button:border-orange-400/30 group-hover/button:bg-orange-400/10 group-hover/button:text-orange-400'
                }`}
                aria-hidden="true"
              >
                <ChevronDown className={`transition-transform ${expanded ? 'rotate-180' : ''}`} size={18} />
              </span>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed mt-3 font-handwriting text-lg tracking-wide">
            {experience.summary}
          </p>

          {Array.isArray(experience.features) && experience.features.length > 0 && (
            <div className="mt-4">
              <div className="text-base mb-2 font-semibold text-slate-400">Highlights</div>
              <ul className="space-y-2">
                {experience.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="text-emerald-400 mt-0.5 flex-shrink-0" size={16} />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </button>

        {/* Details (expanded) */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="px-6 pb-6 overflow-hidden"
            >
              {/* Full-width Carousel at Top */}
              <div className="mb-6">
                {/* Image Carousel */}
                <div 
                  className="relative"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <div className="relative bg-slate-800 rounded-xl overflow-hidden aspect-video shadow-lg">
                    {/* Image Display */}
                    {experience.gallery[currentImageIndex]?.src ? (
                      <img
                        src={experience.gallery[currentImageIndex].src}
                        alt={experience.gallery[currentImageIndex].caption || `Gallery image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                        <div className="text-center p-8">
                          <div className="w-16 h-16 bg-gray-400 rounded-lg mx-auto mb-3 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-600 text-sm font-medium mb-1">Image Placeholder</p>
                          <p className="text-gray-400 text-xs">{experience.gallery[currentImageIndex]?.src || 'Add image path'}</p>
                        </div>
                      </div>
                    )}

                    {/* Glassmorphism Navigation Buttons */}
                    {experience.gallery.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-900/60 backdrop-blur-md hover:bg-slate-900/70 rounded-full p-2.5 shadow-lg border border-white/10 transition-all z-10"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="text-white" size={20} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900/60 backdrop-blur-md hover:bg-slate-900/70 rounded-full p-2.5 shadow-lg border border-white/10 transition-all z-10"
                          aria-label="Next image"
                        >
                          <ChevronRight className="text-white" size={20} />
                        </button>
                      </>
                    )}

                    {/* Image Indicators */}
                    {experience.gallery.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {experience.gallery.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`h-2 rounded-full transition-all ${
                              idx === currentImageIndex ? 'w-8 bg-orange-400' : 'w-2 bg-slate-600'
                            }`}
                            aria-label={`Go to image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Caption and Metrics */}
                  <div className="mt-3">
                    <p className="text-sm text-slate-400 text-center font-medium mb-2">
                      {experience.gallery[currentImageIndex]?.caption}
                    </p>
                    {/* Metrics */}
                    {experience.gallery[currentImageIndex]?.metrics && (
                      <div className="flex flex-wrap justify-center gap-3 mt-3">
                        {experience.gallery[currentImageIndex].metrics.map((metric, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-1.5 bg-orange-400/10 border border-orange-400/30 rounded-lg"
                          >
                            <div className="text-xs font-semibold text-orange-300">{metric.label}</div>
                            <div className="text-sm font-bold text-orange-400">{metric.value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features Section Below Carousel */}
                {Array.isArray(experience.features) && experience.features.length > 0 && (
                  <div className="mt-6">
                    <div className="text-lg font-semibold text-white mb-4">Key Features</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {experience.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                          <CheckCircle2 className="text-emerald-400 mt-0.5 flex-shrink-0" size={18} />
                          <span className="leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// Architectural Card Component (for Macy's & U.S. Bank)
function ArchitecturalCard({ experience, index, isActive, expanded, onToggle }) {
  const [flowIndex, setFlowIndex] = useState(0);
  const [flowOpen, setFlowOpen] = useState(false);

  useEffect(() => {
    const steps = experience?.tech_stack_flow?.length || 0;
    if (!isActive || steps <= 1) {
      setFlowIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setFlowIndex((prev) => (prev >= steps - 1 ? 0 : prev + 1));
    }, 900);

    return () => window.clearInterval(interval);
  }, [experience?.tech_stack_flow?.length, isActive]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative ml-6 md:ml-10"
    >
      {/* Card */}
      <motion.div
        className="bg-slate-900/95 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border-2 border-white/10 group/card"
        animate={{
          borderColor: isActive ? '#fb923c' : 'rgba(255, 255, 255, 0.12)',
          boxShadow: isActive
            ? '0 20px 25px -5px rgba(234, 88, 12, 0.18), 0 10px 10px -5px rgba(234, 88, 12, 0.12)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.25)',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Always-visible headline (click to expand) */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="w-full text-left p-6 pb-5 relative group/button"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className={`text-xl font-semibold mb-1 ${isActive ? 'text-orange-400' : 'text-white'}`}>
                {experience.role}
              </h3>
              <p className="text-slate-300 font-medium">{experience.company}</p>
              <p className="text-sm text-slate-400 mt-1">{experience.period}</p>
            </div>
            <div className="relative flex items-center">
              {/* Hover text - only show when collapsed */}
              {!expanded && (
                <span className="absolute right-12 mr-2 px-2 py-1 bg-slate-800 text-white text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover/button:opacity-100 transition-opacity duration-200 pointer-events-none z-10 border border-white/10">
                  See more details
                </span>
              )}
              <span
                className={`mt-1 inline-flex items-center justify-center h-9 w-9 rounded-full border transition-all ${
                  expanded 
                    ? 'border-orange-400/30 bg-orange-400/10 text-orange-400' 
                    : 'border-white/10 bg-slate-800 text-slate-300 group-hover/button:border-orange-400/30 group-hover/button:bg-orange-400/10 group-hover/button:text-orange-400'
                }`}
                aria-hidden="true"
              >
                <ChevronDown className={`transition-transform ${expanded ? 'rotate-180' : ''}`} size={18} />
              </span>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed mt-3 font-handwriting text-lg tracking-wide">
            {experience.summary}
          </p>

          {Array.isArray(experience.impact_metrics) && experience.impact_metrics.length > 0 && (
            <div className="mt-4">
              <div className="text-base mb-2 font-semibold text-slate-400">Top Impact</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {experience.impact_metrics.slice(0, 3).map((m) => (
                  <div
                    key={m.label}
                    className="rounded-2xl text-center border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <div className="text-sm font-bold text-orange-400">{m.value}</div>
                    <div className="text-[11px] font-semibold tracking-wide text-slate-300 uppercase">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(experience.tech_stack_flow) && experience.tech_stack_flow.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="text-base mb-2 font-semibold text-slate-400">
                  System Architecture Flow
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFlowOpen(true);
                  }}
                  className="text-xs font-semibold text-orange-400 hover:text-orange-300"
                >
                  View diagram
                </button>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFlowOpen(true);
                }}
                className="w-full rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-3 py-3"
                aria-label="Open architecture flow diagram"
              >
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {experience.tech_stack_flow.map((tech, idx) => {
                    const isDone = idx < flowIndex;
                    const isCurrent = idx === flowIndex;

                    const chipClass = isDone
                      ? 'bg-orange-400/10 border-orange-400/30 text-orange-300'
                      : isCurrent
                        ? 'bg-orange-400 border-orange-400 text-white'
                        : 'bg-white/5 border-white/10 text-slate-300';

                    const arrowClass = isDone || isCurrent ? 'text-orange-400' : 'text-slate-400';

                    return (
                      <div key={`${tech}-${idx}`} className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${chipClass}`}
                        >
                          {tech}
                        </span>
                        {idx < experience.tech_stack_flow.length - 1 && (
                          <span className={`inline-flex ${arrowClass}`} aria-hidden="true">
                            <ArrowRight size={16} />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </button>
            </div>
          )}
        </button>

        <ArchitectureFlowModal
          open={flowOpen}
          onClose={() => setFlowOpen(false)}
          title={`${experience.role} — ${experience.company}`}
          flow={experience.tech_stack_flow}
        />

        {/* Details (expanded) */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="px-6 pb-6 overflow-hidden"
            >
              <div className="space-y-8 pt-2">
                {/* Section 1: The Challenge & Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Challenge */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.05 }}
                    className="bg-white/5 rounded-2xl p-5"
                  >
                    <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                      <AlertTriangle className="text-orange-400" size={20} />
                      The Challenge
                    </h4>
                    <p className="text-slate-300 leading-relaxed">{experience.problem}</p>
                  </motion.div>

                  {/* Solution */}
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                    className="bg-orange-400/10 border border-orange-400/20 rounded-2xl p-5"
                  >
                    <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                      <CheckCircle className="text-orange-400" size={20} />
                      The Solution
                    </h4>
                    <p className="text-slate-300 leading-relaxed">{experience.solution}</p>
                  </motion.div>
                </div>

               

                {/* Section 4: Tech Stack */}
                {Array.isArray(experience.tech_stack_flow) && experience.tech_stack_flow.length > 0 && (
                  <div>
                    <h4 className="text-base font-semibold text-white mb-3">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {experience.tech_stack_flow.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-400/10 text-orange-300 border border-orange-400/30"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// Main Experience Component
export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressPx, setProgressPx] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const timelineRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const computeActive = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;
      let closestTargetCenterY = null;

      cardRefs.current.forEach((cardRef, index) => {
        if (!cardRef) return;
        const rect = cardRef.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const distance = Math.abs(centerY - viewportCenter);

        // Only consider cards that are at least partially visible
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
            // Fill line to the top area of the active card (header-ish)
            closestTargetCenterY = rect.top + Math.min(40, rect.height * 0.25);
          }
        }
      });

      setActiveIndex((prev) => (prev === closestIndex ? prev : closestIndex));

      if (timelineRef.current && typeof closestTargetCenterY === 'number') {
        const timelineRect = timelineRef.current.getBoundingClientRect();
        const y = closestTargetCenterY - timelineRect.top;
        const clamped = Math.max(0, Math.min(y, timelineRect.height));
        setProgressPx((prev) => (Math.abs(prev - clamped) < 1 ? prev : clamped));
      }
    };

    computeActive();

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          computeActive();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', computeActive);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', computeActive);
    };
  }, []);

  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Professional Experience</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Headline first. Deep-dive when you want (challenge → solution → architecture).
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative" ref={timelineRef}>
          {/* Background Timeline Line */}
          <div className="absolute left-2 md:left-4 top-0 bottom-0 w-0.5 bg-slate-700"></div>

          {/* Animated Orange Fill Line */}
          <motion.div
            className="absolute left-2 md:left-4 top-0 w-0.5 bg-orange-400"
            initial={{ height: 0 }}
            animate={{ height: progressPx }}
            transition={{ type: 'spring', stiffness: 260, damping: 35 }}
          />

          {/* Cards */}
          <div className="space-y-12">
            {portfolioData.experience.map((exp, index) => (
              <div
                key={exp.id}
                ref={(el) => {
                  if (el) cardRefs.current[index] = el;
                }}
              >
                {exp.type === 'visual' ? (
                  <VisualCard
                    experience={exp}
                    index={index}
                    isActive={activeIndex === index}
                    expanded={expandedId === exp.id}
                    onToggle={() => setExpandedId((prev) => (prev === exp.id ? null : exp.id))}
                  />
                ) : (
                  <ArchitecturalCard
                    experience={exp}
                    index={index}
                    isActive={activeIndex === index}
                    expanded={expandedId === exp.id}
                    onToggle={() => setExpandedId((prev) => (prev === exp.id ? null : exp.id))}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
