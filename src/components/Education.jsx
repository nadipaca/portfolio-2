import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { portfolioData } from '../constants';

export default function Education() {
  const edu = portfolioData.education;
  if (!edu) return null;

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 section-glow pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-6 md:p-8 shadow-sm border border-white/10 bg-white/5"
        >
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="text-orange-400" size={20} />
            </div>

            <div className="min-w-0">
              <div className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                {edu.label || 'Education'}
              </div>
              <h3 className="mt-2 text-xl md:text-2xl font-semibold text-white">
                {edu.degree}
              </h3>
              <p className="mt-1 text-slate-300 font-medium">
                {edu.school}
                {edu.location ? `, ${edu.location}` : ''}
              </p>

              {edu.meta && (
                <p className="mt-3 text-sm text-slate-400">
                  {edu.meta}
                </p>
              )}

              {Array.isArray(edu.coursework) && edu.coursework.length > 0 && (
                <div className="mt-5">
                  <div className="text-sm font-semibold text-white mb-2">
                    Coursework
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {edu.coursework.map((c) => (
                      <span
                        key={c}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 text-slate-300 border border-white/10"
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


