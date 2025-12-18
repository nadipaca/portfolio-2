import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { portfolioData } from '../constants';
import ArchitectureFlowModal from './ArchitectureFlowModal';

// Visual Card Component (for MCESC)
function VisualCard({ experience, index, isActive }) {
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
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="mb-3">
            <h3 className={`text-xl font-semibold mb-1 ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
              {experience.role}
            </h3>
            <p className="text-gray-600 font-medium">{experience.company}</p>
            <p className="text-sm text-gray-500 mt-1">{experience.period}</p>
          </div>
          <p className="text-gray-700 leading-relaxed">{experience.summary}</p>
        </div>

        {/* Two-column layout */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Features */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4">Key Features</h4>
              <ul className="space-y-4">
                {experience.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + idx * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
                    <span className="text-gray-700 leading-relaxed">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
        </div>
      </motion.div>
    </motion.div>
  );
}

// Architectural Card Component (for Macy's & U.S. Bank)
function ArchitecturalCard({ experience, index, isActive }) {
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
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="mb-3">
            <h3 className={`text-xl font-semibold mb-1 ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
              {experience.role}
            </h3>
            <p className="text-gray-600 font-medium">{experience.company}</p>
            <p className="text-sm text-gray-500 mt-1">{experience.period}</p>
          </div>
          <p className="text-gray-700 leading-relaxed">{experience.summary}</p>
        </div>

        <div className="px-6 pb-6 space-y-8">
          {/* Section 1: The Challenge & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Challenge */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 + 0.1 }}
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
              transition={{ delay: index * 0.15 + 0.15 }}
              className="bg-blue-50 rounded-2xl p-5"
            >
              <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-blue-600" size={20} />
                The Solution
              </h4>
              <p className="text-gray-700 leading-relaxed">{experience.solution}</p>
            </motion.div>
          </div>

          {/* Section 2: System Flow - Pipeline Style */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <h4 className="text-base font-semibold text-gray-900">System Architecture Flow</h4>
              <button
                type="button"
                onClick={() => setFlowOpen(true)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View diagram
              </button>
            </div>

            <button
              type="button"
              onClick={() => setFlowOpen(true)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors py-4 px-4"
              aria-label="Open architecture flow diagram"
            >
              <div className="flex flex-wrap items-center justify-center gap-3">
              {experience.tech_stack_flow.map((tech, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold border"
                    animate={{
                      backgroundColor:
                        idx < flowIndex ? 'rgba(219, 234, 254, 1)' : idx === flowIndex ? 'rgba(37, 99, 235, 1)' : 'rgba(243, 244, 246, 1)',
                      borderColor:
                        idx < flowIndex ? 'rgba(147, 197, 253, 1)' : idx === flowIndex ? 'rgba(37, 99, 235, 1)' : 'rgba(229, 231, 235, 1)',
                      color:
                        idx < flowIndex ? 'rgba(29, 78, 216, 1)' : idx === flowIndex ? 'rgba(255, 255, 255, 1)' : 'rgba(55, 65, 81, 1)',
                      scale: idx === flowIndex ? 1.06 : 1,
                    }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    {tech}
                  </motion.span>
                  {idx < experience.tech_stack_flow.length - 1 && (
                    <motion.span
                      aria-hidden="true"
                      animate={{
                        color:
                          idx < flowIndex ? 'rgba(59, 130, 246, 1)' : idx === flowIndex ? 'rgba(37, 99, 235, 1)' : 'rgba(156, 163, 175, 1)',
                        opacity: idx <= flowIndex ? 1 : 0.35,
                        x: idx === flowIndex ? [0, 4, 0] : 0,
                      }}
                      transition={{
                        duration: idx === flowIndex ? 0.9 : 0.2,
                        ease: 'easeInOut',
                        repeat: idx === flowIndex ? Infinity : 0,
                      }}
                      style={{ display: 'inline-flex' }}
                    >
                      <ArrowRight size={18} />
                    </motion.span>
                  )}
                </div>
              ))}
              </div>
            </button>

            <ArchitectureFlowModal
              open={flowOpen}
              onClose={() => setFlowOpen(false)}
              title={`${experience.role} — ${experience.company}`}
              flow={experience.tech_stack_flow}
            />
          </div>

          {/* Section 3: Impact Metrics - Stat Counters */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">Impact Metrics</h4>
            <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-8 py-4">
              {experience.impact_metrics.map((metric, idx) => (
                <div key={idx} className="flex items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + idx * 0.1 }}
                    className="text-center px-6 md:px-8"
                  >
                    <div className="text-4xl font-bold text-blue-600 mb-1">{metric.value}</div>
                    <div className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                      {metric.label}
                    </div>
                  </motion.div>
                  {idx < experience.impact_metrics.length - 1 && (
                    <div className="hidden md:block w-px h-16 bg-gray-200 mx-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Main Experience Component
export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressPx, setProgressPx] = useState(0);
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Experience</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Interactive case studies showcasing architectural decisions and visual implementations
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
                  <VisualCard experience={exp} index={index} isActive={activeIndex === index} />
                ) : (
                  <ArchitecturalCard experience={exp} index={index} isActive={activeIndex === index} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
