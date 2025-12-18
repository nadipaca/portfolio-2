import { motion } from 'framer-motion';
import { portfolioData } from '../constants';

const skillCategoryLabels = {
  backend: 'Backend',
  cloud: 'Cloud & DevOps',
  frontend: 'Frontend',
  ai_ml: 'AI/ML',
};

const skillCategoryColors = {
  backend: 'bg-blue-50 border-blue-200 text-blue-900',
  cloud: 'bg-indigo-50 border-indigo-200 text-indigo-900',
  frontend: 'bg-purple-50 border-purple-200 text-purple-900',
  ai_ml: 'bg-pink-50 border-pink-200 text-pink-900',
};

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 section-glow pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Skills & Technologies
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            A comprehensive toolkit for building modern, scalable applications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(portfolioData.skills).map(([category, skills], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              whileHover={{ y: -6 }}
              className={`rounded-2xl border-2 p-6 shadow-sm hover:shadow-lg transition-shadow ${skillCategoryColors[category] || 'bg-gray-50 border-gray-200'}`}
            >
              <h3 className="text-xl font-bold mb-4">
                {skillCategoryLabels[category] || category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skillIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                    className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-sm font-semibold shadow-sm border border-white/60"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

