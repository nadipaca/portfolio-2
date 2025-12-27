import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

export default function ProjectCard({ project, onClick }) {
  const categoryColors = {
    'AI/ML': 'bg-orange-900/20 text-orange-300 border-orange-500/30',
    'Mobile': 'bg-orange-900/20 text-orange-300 border-orange-500/30',
    'Cloud Architecture': 'bg-orange-900/20 text-orange-300 border-orange-500/30',
  };

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.015 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="bg-slate-900/90 rounded-2xl shadow-lg hover:shadow-xl p-6 border border-orange-500/20 cursor-pointer h-full flex flex-col relative overflow-hidden text-slate-200 hover:border-orange-500/40 transition-colors"
      onClick={() => onClick && onClick(project)}
    >
      {/* subtle corner glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between mb-4">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full border ${
            categoryColors[project.category] || 'bg-slate-800 text-slate-300 border-white/10'
          }`}
        >
          {project.category}
        </span>
      </div>

      <h3 className="text-xl font-extrabold text-white mb-2 tracking-tight">{project.title}</h3>
      <p className="text-slate-300 text-sm mb-4 flex-grow">{project.summary}</p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.slice(0, 3).map((tech, idx) => (
          <span
            key={idx}
            className="px-2 py-1 text-xs bg-white/5 text-slate-200 rounded border border-white/10"
          >
            {tech}
          </span>
        ))}
        {project.tech.length > 3 && (
          <span className="px-2 py-1 text-xs bg-white/5 text-slate-200 rounded border border-white/10">
            +{project.tech.length - 3}
          </span>
        )}
      </div>

      {/* Results */}
      <div className="space-y-1 mb-4">
        {project.results.slice(0, 1).map((result, idx) => (
          <p key={idx} className="text-xs text-orange-300 font-medium">
            ✓ {result}
          </p>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-sm text-slate-300 hover:text-white transition-colors"
        >
          <Github size={16} />
          <span>Code</span>
        </a>
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-sm text-slate-300 hover:text-white transition-colors"
        >
          <ExternalLink size={16} />
          <span>Demo</span>
        </a>
      </div>
    </motion.div>
  );
}

