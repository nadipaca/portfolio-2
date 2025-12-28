import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { portfolioData } from '../constants';

export default function Education() {
  const edu = portfolioData.education;
  if (!edu) return null;

  return (
    <section id="education" className="py-10 bg-slate-900 relative overflow-hidden">
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
            Education
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Academic background and coursework
          </p>
        </motion.div>

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
                      <span
                        key={c}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-slate-200 border border-white/10 hover:border-orange-400/30 transition-colors"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
