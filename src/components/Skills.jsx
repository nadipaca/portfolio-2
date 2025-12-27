import { motion } from 'framer-motion';
import { portfolioData } from '../constants';
import {
  // Frontend
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  
  // Backend
  SiNodedotjs,
  SiSpringboot,
  SiPython,
  SiFastapi,
  SiApachekafka,
  
  // DevOps
  SiDocker,
  SiKubernetes,
  SiTerraform,
  SiAwslambda,
  SiGithubactions,
  
  // Databases (NEW)
  SiMongodb,
  SiRedis,
  SiPostgresql,
  SiFirebase,
  
  // AI/ML (NEW)
  SiLangchain,
  SiOpenai,
  SiHuggingface,
  SiPytorch,
  SiTensorflow,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { Sparkles } from 'lucide-react';

// --- 1. CONFIGURATION MAP (Cleaner than long if/else chains) ---
const SKILL_CONFIG = {
  // Frontend
  'react': { icon: SiReact, color: 'text-cyan-400' },
  'next.js': { icon: SiNextdotjs, color: 'text-slate-900 dark:text-white' }, // Handle dark mode
  'typescript': { icon: SiTypescript, color: 'text-blue-600' },
  'tailwind css': { icon: SiTailwindcss, color: 'text-sky-500' },
  
  // Backend
  'node.js': { icon: SiNodedotjs, color: 'text-green-600' },
  'spring boot': { icon: SiSpringboot, color: 'text-green-500' },
  'java': { icon: FaJava, color: 'text-orange-600' },
  'python': { icon: SiPython, color: 'text-yellow-500' },
  'fastapi': { icon: SiFastapi, color: 'text-teal-600' },
  'kafka': { icon: SiApachekafka, color: 'text-slate-800 dark:text-white' },
  
  // Databases
  'mongodb': { icon: SiMongodb, color: 'text-green-500' },
  'redis': { icon: SiRedis, color: 'text-red-600' },
  'postgresql': { icon: SiPostgresql, color: 'text-blue-400' },
  'firebase': { icon: SiFirebase, color: 'text-orange-400' },

  // DevOps
  'docker': { icon: SiDocker, color: 'text-sky-600' },
  'kubernetes': { icon: SiKubernetes, color: 'text-blue-600' },
  'terraform': { icon: SiTerraform, color: 'text-purple-600' },
  'aws': { icon: SiAwslambda, color: 'text-amber-500' },
  'ci/cd': { icon: SiGithubactions, color: 'text-blue-500' },
  
  // AI/ML
  'langchain': { icon: SiLangchain, color: 'text-emerald-600' },
  'openai': { icon: SiOpenai, color: 'text-teal-600' },
  'huggingface': { icon: SiHuggingface, color: 'text-yellow-400' },
  'pytorch': { icon: SiPytorch, color: 'text-orange-500' },
  'tensorflow': { icon: SiTensorflow, color: 'text-orange-400' },
};

function normalizeSkillLabel(label) {
  return String(label || '')
    .replace(/\(.*?\)/g, '') // remove parenthetical hints like (8+)
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function SkillIcon({ label }) {
  const normalized = normalizeSkillLabel(label);
  
  // Check exact match first, then startsWith for edge cases like "AWS EC2"
  const config = SKILL_CONFIG[normalized] || 
                 Object.entries(SKILL_CONFIG).find(([key]) => normalized.startsWith(key))?.[1];

  if (!config) {
    return <Sparkles size={16} className="text-slate-400" aria-hidden="true" />;
  }

  const IconComponent = config.icon;

  return <IconComponent size={16} className={config.color} aria-hidden="true" />;
}

const skillCategoryLabels = {
  backend: 'Backend',
  cloud: 'Cloud & DevOps',
  frontend: 'Frontend',
  database: 'Databases', // Added this
  ai_ml: 'AI & Machine Learning',
};

const skillCategoryColors = {
  backend: 'bg-blue-50 border-blue-200 text-blue-900',
  cloud: 'bg-indigo-50 border-indigo-200 text-indigo-900',
  frontend: 'bg-purple-50 border-purple-200 text-purple-900',
  database: 'bg-emerald-50 border-emerald-200 text-emerald-900', // Added this
  ai_ml: 'bg-rose-50 border-rose-200 text-rose-900',
};

export default function Skills() {
  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 section-glow pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Skills & Technologies
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            The modern stack I use to build scalable, intelligent applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(portfolioData.skills).map(([category, skills], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              whileHover={{ y: -5 }}
              className="rounded-2xl border-2 border-orange-500/20 bg-slate-900/90 p-6 shadow-sm hover:shadow-xl hover:border-orange-500/40 transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                 {/* Optional: Add a category icon here if you want */}
                {skillCategoryLabels[category] || category.toUpperCase()}
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skillIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg text-sm font-semibold shadow-sm border border-orange-500/20 hover:border-orange-500/40 text-white transition-colors"
                  >
                    <SkillIcon label={skill} />
                    <span>{skill}</span>
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