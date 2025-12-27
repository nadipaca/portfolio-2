import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { portfolioData } from '../constants';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setProjectQueryParam = (projectId) => {
    const url = new URL(window.location.href);
    if (projectId) url.searchParams.set('project', projectId);
    else url.searchParams.delete('project');
    window.history.pushState({}, '', url.toString());
  };

  const openProject = (project) => {
    if (!project) return;
    setSelectedProject(project);
    setIsModalOpen(true);
    setProjectQueryParam(project.id);
  };

  const closeProject = () => {
    setProjectQueryParam(null);
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  // Deep linking: /?project=<id>
  useEffect(() => {
    const syncFromUrl = () => {
      const url = new URL(window.location.href);
      const projectId = url.searchParams.get('project');
      if (!projectId) {
        setIsModalOpen(false);
        setSelectedProject(null);
        return;
      }
      const p = portfolioData.projects.find((x) => x.id === projectId);
      if (!p) return;

      // Ensure user sees the projects section when landing via deep link
      if (url.hash !== '#projects') {
        url.hash = '#projects';
        window.history.replaceState({}, '', url.toString());
      }

      setSelectedProject(p);
      setIsModalOpen(true);
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  return (
    <>
      <section id="projects" className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 section-glow pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Featured Projects
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Engineering solutions that deliver measurable impact
            </p>

            <div className="mt-6 flex justify-center">
              <a
                href="#all-projects"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors shadow-sm"
              >
                See all projects
              </a>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioData.projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProjectCard project={project} onClick={openProject} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeProject}
      />
    </>
  );
}

