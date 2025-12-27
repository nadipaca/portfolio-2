import { motion } from 'framer-motion';
import { Monitor, Smartphone, Cloud } from 'lucide-react';
import { portfolioData } from '../constants';

export default function About() {
  const services = [
    {
      icon: Monitor,
      title: 'Web Development',
      tech: 'React, NodeJS, Springboot, FastAPI, Open AI'
    },
    {
      icon: Smartphone,
      title: 'App Development',
      tech: 'React Native/FireStore/ Expo'
    },
    {
      icon: Cloud,
      title: 'Web Hosting',
      tech: 'AWS, Docker, Kubernetes, Splunk, Kafka, Micorservice'
    }
  ];

  const metrics = [
    { value: '120 +', label: 'Completed Projects' },
    { value: '95 %', label: 'Client satisfaction' },
    { value: '10 +', label: 'Years of experience' }
  ];

  return (
    <section id="about" className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 section-glow pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
        >
          {/* Left: Services rail with vertical line and dots */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-orange-600" aria-hidden="true" />
            <ul className="space-y-8 pl-10">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <li key={index} className="relative">
                    <span 
                      className="absolute left-4 top-3 inline-block w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_0_4px_rgba(234,88,12,0.15)]" 
                      aria-hidden="true"
                      style={{ transform: 'translateX(-50%)' }}
                    />
                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-orange-400">
                        <IconComponent size={20} />
                      </span>
                      <div>
                        <div className="text-white font-semibold text-lg mb-1">{service.title}</div>
                        <div className="text-slate-300 text-sm">({service.tech})</div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: About me, summary and metrics */}
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">About me</h2>
            <p className="text-white leading-relaxed text-lg mb-8">
              I started my software journey from photography. Through that, I learned to love the process of creating from scratch. Since then, this has led me to software development as it fulfills my love for learning and building things.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {metrics.map((m, index) => {
                const [value, suffix] = m.value.split(' ');
                return (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {value}
                      {suffix && <span className="text-orange-500"> {suffix}</span>}
                    </div>
                    <div className="text-slate-300 text-sm">{m.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
