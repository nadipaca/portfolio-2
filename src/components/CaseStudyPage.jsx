import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { getCaseStudyBySlug } from '../data/caseStudies';
import ArchitectureDiagram from './ArchitectureDiagram';
import MobileDeviceFrame from './MobileDeviceFrame';
import Navbar from './Navbar';
import CaseStudyTOC from './CaseStudyTOC';

export default function CaseStudyPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const caseStudy = getCaseStudyBySlug(slug);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [slug]);

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Case Study Not Found</h1>
          <Link
            to="/#projects"
            className="px-4 py-2 bg-orange-400 hover:bg-orange-300 text-white rounded-lg transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar onOpenChat={() => {}} />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-12">
            {/* Table of Contents - Desktop only */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <CaseStudyTOC />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Projects</span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-orange-900/20 text-orange-300 border-orange-400/30">
                {caseStudy.category}
              </span>
              {caseStudy.readTime && (
                <span className="text-sm text-slate-400">{caseStudy.readTime}</span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              {caseStudy.title}
            </h1>
            <p className="text-xl text-slate-300 mb-6">
              {caseStudy.oneLiner}
            </p>

            {/* Role */}
            <p className="text-slate-400 mb-6">
              <span className="text-slate-500">Role: </span>
              <span className="text-white font-medium">{caseStudy.role}</span>
            </p>
          </motion.div>

          {/* Video / Architecture Preview */}
          {caseStudy.videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              {caseStudy.category === 'Mobile' ? (
                // Mobile Device Frame (Figma-style)
                <MobileDeviceFrame videoUrl={caseStudy.videoUrl} />
              ) : (
                // Regular Video (Non-Mobile)
                <div className="relative w-full aspect-video bg-slate-800 rounded-lg overflow-hidden border border-white/10">
                  <video
                    src={caseStudy.videoUrl}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    muted
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* Problem */}
          <motion.section
            id="problem"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 scroll-mt-24"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Problem</h2>
            <ul className="space-y-3">
              {caseStudy.problem.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <span className="text-orange-400 mt-1">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* My Role */}
          <motion.section
            id="my-role"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12 scroll-mt-24"
          >
            <h2 className="text-2xl font-bold text-white mb-4">My Role</h2>
            <ul className="space-y-3">
              {caseStudy.myRole.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <span className="text-orange-400 mt-1">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Architecture */}
          <motion.section
            id="architecture"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12 scroll-mt-24"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Architecture</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              {caseStudy.architecture.description}
            </p>

            {/* Architecture Diagram */}
            {caseStudy.architectureDiagram && (
              <div className="mt-8">
                <ArchitectureDiagram
                  nodes={caseStudy.architectureDiagram.nodes}
                  connections={caseStudy.architectureDiagram.connections}
                  title={caseStudy.architectureDiagram.title}
                />
              </div>
            )}
          </motion.section>

          {/* Key Decisions */}
          <motion.section
            id="key-decisions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12 scroll-mt-24"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Key Decisions</h2>
            <ul className="space-y-4">
              {caseStudy.keyDecisions.map((decision, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <span className="text-orange-400 mt-1 font-bold text-lg">✓</span>
                  <span className="leading-relaxed">{decision}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Results */}
          <motion.section
            id="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12 scroll-mt-24"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {caseStudy.results.map((result, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/50 rounded-lg p-6 border border-orange-400/20"
                >
                  <div className="text-3xl font-bold text-orange-400 mb-2">
                    {result.value}
                  </div>
                  <div className="text-sm text-slate-300">{result.label}</div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* What I'd Improve Next */}
          <motion.section
            id="improvements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-12 scroll-mt-24"
          >
            <h2 className="text-2xl font-bold text-white mb-4">What I'd Improve Next</h2>
            <ul className="space-y-3">
              {caseStudy.improvements.map((improvement, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <span className="text-slate-500 mt-1">→</span>
                  <span className="leading-relaxed">{improvement}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Links */}
          <motion.section
            id="links"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-8 border-t border-white/10 scroll-mt-24"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Links</h2>
            <div className="flex flex-wrap gap-4">
              {caseStudy.links.repo && (
                <a
                  href={caseStudy.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-400/10 hover:bg-orange-400/20 text-orange-400 rounded-lg border border-orange-400/30 transition-colors"
                >
                  <Github size={20} />
                  <span>View Repository</span>
                </a>
              )}
              
              {caseStudy.links.demo && caseStudy.links.demo !== '#' && (
                <a
                  href={caseStudy.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-400/10 hover:bg-orange-400/20 text-orange-400 rounded-lg border border-orange-400/30 transition-colors"
                >
                  <ExternalLink size={20} />
                  <span>View Demo</span>
                </a>
              )}
            </div>
          </motion.section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

