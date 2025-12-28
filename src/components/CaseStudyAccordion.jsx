import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronUp } from 'lucide-react';
import ArchitectureDiagram from './ArchitectureDiagram';

export default function CaseStudyAccordion({ caseStudy, isExpanded, onClose }) {
  if (!caseStudy) return null;

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="bg-slate-900/95 rounded-2xl border border-orange-400/20 p-6 md:p-8 mt-6">
            {/* Close button */}
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
              <ChevronUp size={20} />
              <span className="text-sm">Collapse</span>
            </button>

            {/* One-liner */}
            <div className="mb-8">
              <p className="text-lg text-white font-medium leading-relaxed">
                {caseStudy.oneLiner}
              </p>
            </div>

            {/* Problem */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4">Problem</h4>
              <ul className="space-y-2">
                {caseStudy.problem.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* My Role */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4">My Role</h4>
              <ul className="space-y-2">
                {caseStudy.myRole.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Architecture */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4">Architecture</h4>
              <p className="text-slate-300 mb-4 leading-relaxed">
                {caseStudy.architecture.description}
              </p>
              
              {/* Architecture Components */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {caseStudy.architecture.components.map((component, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 bg-slate-800/50 rounded-lg border border-white/10 text-sm text-slate-300"
                  >
                    {component}
                  </div>
                ))}
              </div>

              {/* Architecture Diagram */}
              {caseStudy.architectureDiagram && (
                <div className="mt-6">
                  <ArchitectureDiagram
                    nodes={caseStudy.architectureDiagram.nodes}
                    connections={caseStudy.architectureDiagram.connections}
                    title={caseStudy.architectureDiagram.title}
                  />
                </div>
              )}
            </div>

            {/* Key Decisions */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4">Key Decisions</h4>
              <ul className="space-y-3">
                {caseStudy.keyDecisions.map((decision, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300">
                    <span className="text-orange-400 mt-1 font-bold">✓</span>
                    <span>{decision}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Results */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4">Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {caseStudy.results.map((result, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/50 rounded-lg p-4 border border-orange-400/20"
                  >
                    <div className="text-2xl font-bold text-orange-400 mb-1">
                      {result.value}
                    </div>
                    <div className="text-sm text-slate-300">{result.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* What I'd Improve Next */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4">What I'd Improve Next</h4>
              <ul className="space-y-2">
                {caseStudy.improvements.map((improvement, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300">
                    <span className="text-slate-500 mt-1">→</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div className="pt-6 border-t border-white/10">
              <h4 className="text-xl font-bold text-white mb-4">Links</h4>
              <div className="flex flex-wrap gap-4">
                {caseStudy.links.repo && (
                  <a
                    href={caseStudy.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-400/10 hover:bg-orange-400/20 text-orange-400 rounded-lg border border-orange-400/30 transition-colors"
                  >
                    <Github size={18} />
                    <span>View Repository</span>
                  </a>
                )}
                
                {caseStudy.links.demo && caseStudy.links.demo !== '#' && (
                  <a
                    href={caseStudy.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-400/10 hover:bg-orange-400/20 text-orange-400 rounded-lg border border-orange-400/30 transition-colors"
                  >
                    <ExternalLink size={18} />
                    <span>View Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

