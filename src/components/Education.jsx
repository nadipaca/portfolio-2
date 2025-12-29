import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { portfolioData } from '../constants';
import SectionWrapper from './ui/SectionWrapper';
import SectionHeader from './ui/SectionHeader';
import TechChip from './ui/TechChip';
import { fadeInUp } from '../utils/animations';

export default function Education() {
  const edu = portfolioData.education;
  if (!edu) return null;

  return (
    <SectionWrapper id="education" className="py-10">
      <SectionHeader
        title="Education"
        subtitle="Academic background and coursework"
      />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-900/90 rounded-3xl shadow-lg border border-orange-400/20 p-8 md:p-12"
        >
          <div className="flex items-start gap-6">
            <div className="h-16 w-16 rounded-2xl bg-orange-400/10 border border-orange-400/30 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="text-orange-400" size={28} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold tracking-widest text-orange-400 uppercase mb-2">
                {edu.label || 'Education'}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {edu.degree}
              </h3>
              <p className="text-lg text-slate-300 font-medium mb-4">
                {edu.school}
                {edu.location ? `, ${edu.location}` : ''}
              </p>

              {edu.meta && (
                <p className="text-base text-slate-400 mb-6">
                  {edu.meta}
                </p>
              )}

              {Array.isArray(edu.coursework) && edu.coursework.length > 0 && (
                <div className="mt-6">
                  <div className="text-lg font-semibold text-white mb-4">
                    Relevant Coursework
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {edu.coursework.map((c) => (
                      <TechChip key={c} tech={c} variant="primary" className="px-4 py-2 text-sm font-medium" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
    </SectionWrapper>
  );
}
