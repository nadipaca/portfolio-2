import { memo } from 'react';
import { motion } from 'framer-motion';
import CaseStudyCard from './CaseStudyCard';
import { caseStudies } from '../data/caseStudies';

function Projects() {
  // Memoize filtered case studies to prevent re-filtering on re-renders
  const featuredCaseStudies = caseStudies.filter(
    cs => ['playground-app', 'healthcare-agent', 'novamart'].includes(cs.id)
  );

  return (
    <section id="projects" className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Case Studies
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
          Architecture, decisions, and measurable outcomes.
          </p>

          <div className="mt-6 flex justify-center">
            <a
              href="#all-projects"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-orange-400 text-white font-semibold hover:bg-orange-300 transition-colors shadow-sm"
            >
              See all projects
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCaseStudies.map((caseStudy, index) => (
            <motion.div
              key={caseStudy.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CaseStudyCard caseStudy={caseStudy} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Projects);
