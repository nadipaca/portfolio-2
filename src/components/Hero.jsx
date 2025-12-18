import { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectModal from './ProjectModal';
import { portfolioData } from '../constants';
import { Github, Linkedin, Mail, GraduationCap } from 'lucide-react';

export default function Hero() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <>
      <section className="relative">
        {/* Dark Top Section (60%) */}
        <div className="relative min-h-[60vh] bg-slate-900 grid-pattern overflow-hidden py-14 sm:py-16 lg:py-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[60vh] flex items-center">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left: Intro */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-white"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                  className="text-2xl sm:text-3xl md:text-6xl lg:text-6xl font-extrabold leading-[1.05]"
                  style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
                >
                  {portfolioData.profile.name.split(' ')[0]}
                  <br />
                  {portfolioData.profile.name.split(' ').slice(1).join(' ')}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  className="mt-4 flex items-center gap-3 text-slate-300"
                >
                  <span className="text-slate-400">{'>'}</span>
                  <span className="text-teal-300 font-semibold">
                    {portfolioData.profile.role}
                  </span>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="mt-6 text-slate-300 leading-relaxed max-w-xl"
                >
                  {portfolioData.profile.bio}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.6 }}
                  className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-300"
                >
                  <a
                    href={`mailto:${portfolioData.profile.socials.email}`}
                    className="inline-flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Mail size={16} />
                    <span>Email</span>
                  </a>
                  <a
                    href={portfolioData.profile.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Linkedin size={16} />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={portfolioData.profile.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Github size={16} />
                    <span>GitHub</span>
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.6 }}
                  className="mt-8"
                >
                  <span className="inline-block px-4 py-2 bg-indigo-600/20 border border-indigo-500/50 rounded-full text-indigo-200">
                    {portfolioData.profile.availability}
                  </span>
                </motion.div>
              </motion.div>

              {/* Right: Education */}
              <motion.aside
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-white/90"
              >
                <div className="w-full max-w-xl lg:ml-auto bg-slate-900/40 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-slate-400 uppercase">
                    <GraduationCap size={16} className="text-slate-400" />
                    {portfolioData.education?.label || 'Education'}
                  </div>

                  <h3 className="mt-3 text-lg md:text-xl font-semibold text-white">
                    {portfolioData.education?.degree}
                  </h3>

                  <p className="mt-1 text-teal-300 font-medium">
                    {portfolioData.education?.school}, {portfolioData.education?.location}
                  </p>

                  {portfolioData.education?.meta && (
                    <p className="mt-3 text-sm text-slate-300">
                      {portfolioData.education.meta}
                    </p>
                  )}

                  {portfolioData.education?.coursework?.length ? (
                    <div className="mt-4 text-sm">
                      <span className="font-semibold text-slate-200">Coursework:</span>{' '}
                      <span className="text-slate-300">
                        {portfolioData.education.coursework.join(', ')}
                      </span>
                    </div>
                  ) : null}
                </div>
              </motion.aside>
            </div>
          </div>
        </div>
      </section>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

