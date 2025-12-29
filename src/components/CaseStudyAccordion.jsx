import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronUp } from 'lucide-react';
import ArchitectureDiagram from './ArchitectureDiagram';
import ListItem from './ui/ListItem';
import MetricsCard from './ui/MetricsCard';
import Button from './ui/Button';

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
                  <ListItem key={idx} variant="bullet">
                    {item}
                  </ListItem>
                ))}
              </ul>
            </div>

            {/* My Role */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4">My Role</h4>
              <ul className="space-y-2">
                {caseStudy.myRole.map((item, idx) => (
                  <ListItem key={idx} variant="bullet">
                    {item}
                  </ListItem>
                ))}
              </ul>
            </div>

            {/* Architecture */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4">Architecture</h4>
              <p className="text-slate-300 mb-4 leading-relaxed">
                {caseStudy.architecture.description}
              </p>

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
                  <ListItem key={idx} variant="check">
                    {decision}
                  </ListItem>
                ))}
              </ul>
            </div>

            {/* Results */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4">Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {caseStudy.results.map((result, idx) => (
                  <MetricsCard
                    key={idx}
                    value={result.value}
                    label={result.label}
                    variant="default"
                  />
                ))}
              </div>
            </div>

            {/* What I'd Improve Next */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4">What I'd Improve Next</h4>
              <ul className="space-y-2">
                {caseStudy.improvements.map((improvement, idx) => (
                  <ListItem key={idx} variant="arrow">
                    {improvement}
                  </ListItem>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div className="pt-6 border-t border-white/10">
              <h4 className="text-xl font-bold text-white mb-4">Links</h4>
              <div className="flex flex-wrap gap-4">
                {caseStudy.links.repo && (
                  <Button
                    as="a"
                    href={caseStudy.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                    className="bg-orange-400/10 hover:bg-orange-400/20 text-orange-400 border-orange-400/30"
                  >
                    <Github size={18} />
                    <span>View Repository</span>
                  </Button>
                )}
                
                {caseStudy.links.demo && caseStudy.links.demo !== '#' && (
                  <Button
                    as="a"
                    href={caseStudy.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                    className="bg-orange-400/10 hover:bg-orange-400/20 text-orange-400 border-orange-400/30"
                  >
                    <ExternalLink size={18} />
                    <span>View Demo</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

