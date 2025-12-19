import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { portfolioData } from '../constants';

export default function Education() {
  const edu = portfolioData.education;
  if (!edu) return null;

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 section-glow pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200"
        >
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="text-blue-700" size={20} />
            </div>

            <div className="min-w-0">
              <div className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                {edu.label || 'Education'}
              </div>
              <h3 className="mt-2 text-xl md:text-2xl font-semibold text-slate-900">
                {edu.degree}
              </h3>
              <p className="mt-1 text-slate-700 font-medium">
                {edu.school}
                {edu.location ? `, ${edu.location}` : ''}
              </p>

              {edu.meta && (
                <p className="mt-3 text-sm text-slate-600">
                  {edu.meta}
                </p>
              )}

              {Array.isArray(edu.coursework) && edu.coursework.length > 0 && (
                <div className="mt-5">
                  <div className="text-sm font-semibold text-slate-900 mb-2">
                    Coursework
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {edu.coursework.map((c) => (
                      <span
                        key={c}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
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


