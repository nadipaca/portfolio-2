import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { portfolioData } from '../constants';
import ArchitectureFlowModal from './ArchitectureFlowModal';

// Visual Card Component (for MCESC)
function VisualCard({ experience, index, isActive, expanded, onToggle }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % experience.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + experience.gallery.length) % experience.gallery.length);
  };

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
        className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border-2"
        animate={{
          borderColor: isActive ? '#3b82f6' : 'rgba(226, 232, 240, 1)', // blue-500 vs slate-200
          boxShadow: isActive
            ? '0 20px 25px -5px rgba(59, 130, 246, 0.15), 0 10px 10px -5px rgba(59, 130, 246, 0.08)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Always-visible headline (click to expand) */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="w-full text-left p-6 pb-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className={`text-xl font-semibold mb-1 ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                {experience.role}
              </h3>
              <p className="text-gray-600 font-medium">{experience.company}</p>
              <p className="text-sm text-gray-500 mt-1">{experience.period}</p>
            </div>
            <span
              className={`mt-1 inline-flex items-center justify-center h-9 w-9 rounded-full border transition-colors ${
                expanded ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500'
              }`}
              aria-hidden="true"
            >
              <ChevronDown className={`transition-transform ${expanded ? 'rotate-180' : ''}`} size={18} />
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed mt-3 font-handwriting text-lg tracking-wide">
            {experience.summary}
          </p>

          {Array.isArray(experience.features) && experience.features.length > 0 && (
            <div className="mt-4">
              <div className="text-base mb-2 font-semibold text-gray-500">Highlights</div>
              <ul className="space-y-2">
                {experience.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 text-xs text-gray-500">Click to {expanded ? 'collapse' : 'expand'} details</div>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">

                {/* Right Column: Image Carousel */}
                <div className="relative">
                  <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-video shadow-lg">
                    {/* Image Display */}
                    {experience.gallery[currentImageIndex]?.src &&
                    experience.gallery[currentImageIndex].src.startsWith('/images/') ? (
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
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md hover:bg-white/90 rounded-full p-2.5 shadow-lg transition-all z-10"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="text-gray-700" size={20} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md hover:bg-white/90 rounded-full p-2.5 shadow-lg transition-all z-10"
                          aria-label="Next image"
                        >
                          <ChevronRight className="text-gray-700" size={20} />
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
                              idx === currentImageIndex ? 'w-8 bg-blue-600' : 'w-2 bg-white/70'
                            }`}
                            aria-label={`Go to image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Caption */}
                  <p className="mt-3 text-sm text-gray-600 text-center font-medium">
                    {experience.gallery[currentImageIndex]?.caption}
                  </p>
                </div>
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
        className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border-2"
        animate={{
          borderColor: isActive ? '#3b82f6' : 'rgba(226, 232, 240, 1)',
          boxShadow: isActive
            ? '0 20px 25px -5px rgba(59, 130, 246, 0.15), 0 10px 10px -5px rgba(59, 130, 246, 0.08)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Always-visible headline (click to expand) */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="w-full text-left p-6 pb-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className={`text-xl font-semibold mb-1 ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                {experience.role}
              </h3>
              <p className="text-gray-600 font-medium">{experience.company}</p>
              <p className="text-sm text-gray-500 mt-1">{experience.period}</p>
            </div>
            <span
              className={`mt-1 inline-flex items-center justify-center h-9 w-9 rounded-full border transition-colors ${
                expanded ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500'
              }`}
              aria-hidden="true"
            >
              <ChevronDown className={`transition-transform ${expanded ? 'rotate-180' : ''}`} size={18} />
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed mt-3 font-handwriting text-lg tracking-wide">
            {experience.summary}
          </p>

          {Array.isArray(experience.impact_metrics) && experience.impact_metrics.length > 0 && (
            <div className="mt-4">
              <div className="text-base mb-2 font-semibold text-gray-500">Top Impact</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {experience.impact_metrics.slice(0, 3).map((m) => (
                  <div
                    key={m.label}
                    className="rounded-2xl text-center border border-slate-200 bg-slate-50/60 px-3 py-2"
                  >
                    <div className="text-sm font-bold text-blue-700">{m.value}</div>
                    <div className="text-[11px] font-semibold tracking-wide text-slate-600 uppercase">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(experience.tech_stack_flow) && experience.tech_stack_flow.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="text-base mb-2 font-semibold text-gray-500">
                  System Architecture Flow
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFlowOpen(true);
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
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
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors px-3 py-3"
                aria-label="Open architecture flow diagram"
              >
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {experience.tech_stack_flow.map((tech, idx) => {
                    const isDone = idx < flowIndex;
                    const isCurrent = idx === flowIndex;

                    const chipClass = isDone
                      ? 'bg-blue-50 border-blue-200 text-blue-800'
                      : isCurrent
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-slate-100 border-slate-200 text-slate-700';

                    const arrowClass = isDone || isCurrent ? 'text-blue-600' : 'text-slate-400';

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

          <div className="mt-4 text-xs text-gray-500">Click to {expanded ? 'collapse' : 'expand'} details</div>
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
                    className="bg-orange-50 rounded-2xl p-5"
                  >
                    <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="text-orange-600" size={20} />
                      The Challenge
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{experience.problem}</p>
                  </motion.div>

                  {/* Solution */}
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                    className="bg-blue-50 rounded-2xl p-5"
                  >
                    <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="text-blue-600" size={20} />
                      The Solution
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{experience.solution}</p>
                  </motion.div>
                </div>

               

                {/* Section 4: Tech Stack */}
                {Array.isArray(experience.tech_stack_flow) && experience.tech_stack_flow.length > 0 && (
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-3">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {experience.tech_stack_flow.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200"
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

      setActiveIndex(closestIndex);

      if (timelineRef.current && typeof closestTargetCenterY === 'number') {
        const timelineRect = timelineRef.current.getBoundingClientRect();
        const y = closestTargetCenterY - timelineRect.top;
        const clamped = Math.max(0, Math.min(y, timelineRect.height));
        setProgressPx(clamped);
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
    <section id="experience" className="py-20 bg-gray-50/50 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Professional Experience</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Headline first. Deep-dive when you want (challenge → solution → architecture).
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative" ref={timelineRef}>
          {/* Background Timeline Line */}
          <div className="absolute left-2 md:left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Animated Blue Fill Line */}
          <motion.div
            className="absolute left-2 md:left-4 top-0 w-0.5 bg-blue-500"
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
