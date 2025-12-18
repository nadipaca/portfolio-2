import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink } from 'lucide-react';

export default function ProjectModal({ project, isOpen, onClose }) {
  if (!project) return null;

  const categoryColors = {
    'AI/ML': 'bg-purple-100 text-purple-800',
    'Mobile': 'bg-blue-100 text-blue-800',
    'Cloud Architecture': 'bg-indigo-100 text-indigo-800',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-y-auto"
          >
            <div className="bg-white rounded-lg shadow-2xl max-w-5xl mx-auto my-8">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-lg flex items-start justify-between z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        categoryColors[project.category] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {project.category}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">{project.title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors ml-4"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6 space-y-8">
                {/* Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Overview</h3>
                  <p className="text-slate-600">{project.summary}</p>
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* STAR-L Framework */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">Project Details</h3>

                  {/* Situation */}
                  {project.situation && (
                    <div>
                      <h4 className="text-md font-semibold text-indigo-600 mb-2">
                        Situation
                      </h4>
                      <p className="text-slate-600">{project.situation}</p>
                    </div>
                  )}

                  {/* Task */}
                  {project.task && (
                    <div>
                      <h4 className="text-md font-semibold text-indigo-600 mb-2">Task</h4>
                      <p className="text-slate-600">{project.task}</p>
                    </div>
                  )}

                  {/* Action */}
                  {project.action && (
                    <div>
                      <h4 className="text-md font-semibold text-indigo-600 mb-2">Action</h4>
                      <p className="text-slate-600">{project.action}</p>
                    </div>
                  )}

                  {/* Result */}
                  <div>
                    <h4 className="text-md font-semibold text-indigo-600 mb-2">Results</h4>
                    <ul className="space-y-2">
                      {project.results.map((result, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-600">
                          <span className="text-indigo-600 mt-1">✓</span>
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Learning */}
                  {project.learning && (
                    <div>
                      <h4 className="text-md font-semibold text-indigo-600 mb-2">Learning</h4>
                      <p className="text-slate-600">{project.learning}</p>
                    </div>
                  )}
                </div>

                {/* Architecture Diagram Placeholder */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 bg-slate-50">
                  <div className="text-center text-slate-500">
                    <p className="font-semibold mb-2">System Architecture Diagram</p>
                    <p className="text-sm">Image placeholder - Upload architecture diagram here</p>
                  </div>
                </div>

                {/* Video Demo Placeholder */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 bg-slate-50">
                  <div className="text-center text-slate-500">
                    <p className="font-semibold mb-2">Video Demo</p>
                    <p className="text-sm">Video placeholder - Embed demo video here</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Github size={18} />
                    <span>View Code</span>
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <ExternalLink size={18} />
                    <span>Live Demo</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

