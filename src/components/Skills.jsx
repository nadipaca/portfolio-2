import { motion } from 'framer-motion';
import { portfolioData } from '../constants';
import { useNavigate } from 'react-router-dom';
import SectionWrapper from './ui/SectionWrapper';
import SectionHeader from './ui/SectionHeader';
import TechChip from './ui/TechChip';
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
  
  // Databases
  SiMongodb,
  SiRedis,
  SiPostgresql,
  SiFirebase,
  
  // AI/ML
  SiLangchain,
  SiOpenai,
  SiHuggingface,
  SiPytorch,
  SiTensorflow,
} from 'react-icons/si';
import { FaJava, FaCode, FaCloud, FaDatabase, FaRobot } from 'react-icons/fa';
import { Sparkles, ArrowRight } from 'lucide-react';

// Category icons
const categoryIcons = {
  frontend: FaCode,
  backend: FaCode,
  cloud: FaCloud,
  ai_ml: FaRobot,
  database: FaDatabase,
};

// Category labels
const categoryLabels = {
  frontend: 'Frontend',
  backend: 'Backend',
  cloud: 'Cloud & DevOps',
  ai_ml: 'AI & Machine Learning',
  database: 'Databases',
};

// Skill icon mapping
const SKILL_CONFIG = {
  'react': { icon: SiReact, color: 'text-cyan-400' },
  'next.js': { icon: SiNextdotjs, color: 'text-slate-900 dark:text-white' },
  'typescript': { icon: SiTypescript, color: 'text-blue-600' },
  'tailwind css': { icon: SiTailwindcss, color: 'text-sky-500' },
  'node.js': { icon: SiNodedotjs, color: 'text-green-600' },
  'spring boot': { icon: SiSpringboot, color: 'text-green-500' },
  'java': { icon: FaJava, color: 'text-orange-400' },
  'python': { icon: SiPython, color: 'text-yellow-500' },
  'fastapi': { icon: SiFastapi, color: 'text-teal-600' },
  'kafka': { icon: SiApachekafka, color: 'text-slate-800 dark:text-white' },
  'mongodb': { icon: SiMongodb, color: 'text-green-500' },
  'redis': { icon: SiRedis, color: 'text-red-500' },
  'postgresql': { icon: SiPostgresql, color: 'text-blue-400' },
  'firebase': { icon: SiFirebase, color: 'text-orange-400' },
  'dynamodb': { icon: SiAwslambda, color: 'text-blue-500' },
  'docker': { icon: SiDocker, color: 'text-sky-600' },
  'kubernetes': { icon: SiKubernetes, color: 'text-blue-600' },
  'terraform': { icon: SiTerraform, color: 'text-purple-600' },
  'aws lambda': { icon: SiAwslambda, color: 'text-amber-500' },
  'ci/cd': { icon: SiGithubactions, color: 'text-blue-500' },
  'eventbridge': { icon: SiAwslambda, color: 'text-amber-500' },
  'langchain': { icon: SiLangchain, color: 'text-emerald-600' },
  'openai': { icon: SiOpenai, color: 'text-teal-600' },
  'hugging face': { icon: SiHuggingface, color: 'text-yellow-400' },
  'rag pipelines': { icon: SiLangchain, color: 'text-emerald-600' },
  'genai agents': { icon: SiOpenai, color: 'text-teal-600' },
  'vector dbs': { icon: SiMongodb, color: 'text-green-500' },
};

function normalizeSkillLabel(label) {
  return String(label || '')
    .replace(/\(.*?\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function SkillIcon({ label }) {
  const normalized = normalizeSkillLabel(label);
  const config = SKILL_CONFIG[normalized] || 
                 Object.entries(SKILL_CONFIG).find(([key]) => normalized.startsWith(key))?.[1];

  if (!config) {
    return <Sparkles size={14} className="text-slate-400" aria-hidden="true" />;
  }

  const IconComponent = config.icon;
  return <IconComponent size={14} className={config.color} aria-hidden="true" />;
}

export default function Skills() {
  const navigate = useNavigate();

  const handleProjectClick = (slug, e) => {
    e.preventDefault();
    if (slug && slug !== '#') {
      if (slug.startsWith('#')) {
        // Scroll to section by ID (remove the #)
        const sectionId = slug.substring(1);
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to case study
        navigate(`/case-study/${slug}`);
      }
    }
  };

  return (
    <SectionWrapper id="skills">
      <SectionHeader
        title="Skills & Technologies"
        subtitle="What I use most — and where you can see it in my work."
      />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(portfolioData.skills).map(([category, skillData], categoryIndex) => {
            const CategoryIcon = categoryIcons[category] || Sparkles;
            const primarySkills = skillData.primary || [];
            const secondarySkills = skillData.secondary || [];
            const usedIn = skillData.usedIn || [];

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-orange-400/20 bg-slate-800/50 p-4 shadow-sm hover:shadow-xl hover:border-orange-400/40 transition-all duration-300"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <CategoryIcon className="text-orange-400" size={20} />
                    <h3 className="text-xl font-bold text-white">
                      {categoryLabels[category] || category.toUpperCase()}
                    </h3>
                  </div>
                </div>

                {/* Primary Skills Row */}
                {primarySkills.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-medium text-slate-400 mb-2">Primary:</div>
                    <div className="flex flex-wrap gap-2">
                      {primarySkills.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/80 rounded-lg text-sm font-semibold text-white border border-orange-400/30"
                        >
                          <SkillIcon label={skill} />
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Secondary Skills Row */}
                {secondarySkills.length > 0 && (
                  <div className="mb-6">
                    <div className="text-xs font-medium text-slate-500 mb-2">Secondary:</div>
                    <div className="flex flex-wrap gap-2">
                      {secondarySkills.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-transparent rounded-lg text-sm font-medium text-slate-400 border border-slate-600/50"
                        >
                          <SkillIcon label={skill} />
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Used In Line */}
                {usedIn.length > 0 && (
                  <div className="pt-4 border-t border-slate-700/50">
                    <div className="text-xs font-medium text-slate-500 mb-2">Used in:</div>
                    <div className="flex flex-wrap items-center gap-1.5 text-sm">
                      {usedIn.map((project, idx) => (
                        <span key={idx} className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleProjectClick(project.slug, e)}
                            className="text-slate-300 hover:text-orange-400 underline decoration-orange-400/50 hover:decoration-orange-400 transition-all duration-200 group/link relative inline-flex items-center gap-1"
                            title={project.tooltip}
                          >
                            {project.name}
                            <ArrowRight 
                              size={12} 
                              className="opacity-0 group-hover/link:opacity-100 transition-opacity" 
                            />
                          </button>
                          {idx < usedIn.length - 1 && (
                            <span className="text-slate-600">•</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
    </SectionWrapper>
  );
}
