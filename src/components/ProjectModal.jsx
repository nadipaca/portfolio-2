import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink } from 'lucide-react';
import ArchitectureDiagram from './ArchitectureDiagram';

export default function ProjectModal({ project, isOpen, onClose }) {
  if (!project) return null;

  const categoryColors = {
    'AI/ML': 'bg-purple-100 text-purple-800',
    'Mobile': 'bg-blue-100 text-blue-800',
    'Cloud Architecture': 'bg-indigo-100 text-indigo-800',
  };

  // Check if demo URL is a video file
  const isVideoUrl = (url) => {
    if (!url || url === '#') return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const isVideo = isVideoUrl(project.demo);

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

          {/* Modal (Desktop) / Bottom Sheet (Mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-8"
          >
            <div className="w-full md:max-w-5xl bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[88vh] md:max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-white border-b border-slate-200 px-5 md:px-6 py-4 flex items-start justify-between z-10">
                <div className="flex-1">
                  {/* drag handle (mobile) */}
                  <div className="md:hidden flex justify-center -mt-1 mb-3">
                    <div className="h-1 w-10 rounded-full bg-slate-200" />
                  </div>
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
                  className="text-slate-400 hover:text-slate-600 transition-colors ml-4 p-2 rounded-lg hover:bg-slate-100"
                  aria-label="Close project"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 md:px-6 py-6 space-y-8">
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

                {/* Architecture Diagram */}
                {project.architectureDiagram ? (
                  <ArchitectureDiagram
                    nodes={project.architectureDiagram.nodes}
                    connections={project.architectureDiagram.connections}
                    title={project.architectureDiagram.title || "System Architecture"}
                  />
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 bg-slate-50">
                    <div className="text-center text-slate-500">
                      <p className="font-semibold mb-2">System Architecture Diagram</p>
                      <p className="text-sm">Architecture diagram coming soon</p>
                    </div>
                  </div>
                )}

                {/* Video Demo */}
                {isVideo ? (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Video Demo</h3>
                    {project.category === 'Mobile' ? (
                      // Mobile Device Frame (Figma-style) - Compact Version
                      <div className="flex justify-center items-start">
                        <div className="relative w-full" style={{ maxWidth: '280px' }}>
                          {/* Phone Frame with Shadow */}
                          <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-[2rem] p-2 md:p-2.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 md:w-28 md:h-5 bg-slate-900 rounded-b-xl z-10"></div>
                            
                            {/* Screen Container - More compact aspect ratio */}
                            <div className="bg-black rounded-[1.75rem] overflow-hidden relative" style={{ aspectRatio: '9/19' }}>
                              {/* Status Bar */}
                              <div className="absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/40 to-transparent z-10 flex items-center justify-between px-3 md:px-4 text-white text-[9px] md:text-[10px] font-medium">
                                <span>9:41</span>
                                <div className="flex items-center gap-0.5 md:gap-1">
                                  <div className="w-2.5 h-1 md:w-3 md:h-1.5 border border-white/80 rounded-sm"></div>
                                  <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                                </div>
                              </div>
                              
                              {/* Video Container */}
                              <div className="w-full h-full flex items-center justify-center bg-black">
                                <video
                                  controls
                                  className="w-full h-full object-cover"
                                  playsInline
                                >
                                  <source src={project.demo} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                              
                              {/* Home Indicator (iOS style) */}
                              <div className="absolute bottom-1 md:bottom-1.5 left-1/2 -translate-x-1/2 w-24 md:w-28 h-0.5 bg-white/40 rounded-full backdrop-blur-sm"></div>
                            </div>
                            
                            {/* Side Buttons (optional decorative elements) */}
                            <div className="absolute right-0 top-16 h-10 w-0.5 bg-slate-700/50 rounded-l"></div>
                            <div className="absolute right-0 top-28 h-6 w-0.5 bg-slate-700/50 rounded-l"></div>
                            <div className="absolute right-0 top-36 h-6 w-0.5 bg-slate-700/50 rounded-l"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Regular Video (Non-Mobile)
                      <div className="rounded-lg overflow-hidden shadow-lg bg-slate-900">
                        <video
                          controls
                          className="w-full h-auto"
                          style={{ maxHeight: '600px' }}
                        >
                          <source src={project.demo} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 bg-slate-50">
                    <div className="text-center text-slate-500">
                      <p className="font-semibold mb-2">Video Demo</p>
                      <p className="text-sm">Video placeholder - Embed demo video here</p>
                    </div>
                  </div>
                )}

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
                  {!isVideo && project.demo && project.demo !== '#' && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <ExternalLink size={18} />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

