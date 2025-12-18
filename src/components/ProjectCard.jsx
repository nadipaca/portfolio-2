import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

export default function ProjectCard({ project, onClick }) {
  const categoryColors = {
    'AI/ML': 'bg-purple-100 text-purple-800 border-purple-200',
    'Mobile': 'bg-blue-100 text-blue-800 border-blue-200',
    'Cloud Architecture': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  };

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.015 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl p-6 border border-slate-200/80 cursor-pointer h-full flex flex-col relative overflow-hidden"
      onClick={() => onClick && onClick(project)}
    >
      {/* subtle corner glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between mb-4">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full border ${
            categoryColors[project.category] || 'bg-gray-100 text-gray-800 border-gray-200'
          }`}
        >
          {project.category}
        </span>
      </div>

      <h3 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">{project.title}</h3>
      <p className="text-slate-600 text-sm mb-4 flex-grow">{project.summary}</p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.slice(0, 3).map((tech, idx) => (
          <span
            key={idx}
            className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded"
          >
            {tech}
          </span>
        ))}
        {project.tech.length > 3 && (
          <span className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded">
            +{project.tech.length - 3}
          </span>
        )}
      </div>

      {/* Results */}
      <div className="space-y-1 mb-4">
        {project.results.slice(0, 1).map((result, idx) => (
          <p key={idx} className="text-xs text-indigo-600 font-medium">
            ✓ {result}
          </p>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Github size={16} />
          <span>Code</span>
        </a>
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ExternalLink size={16} />
          <span>Demo</span>
        </a>
      </div>
    </motion.div>
  );
}

