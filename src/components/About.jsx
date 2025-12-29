import { motion } from 'framer-motion';
import { portfolioData } from '../constants';
import softwareIcon from '../assets/icons/software.png';
import appDevelopmentIcon from '../assets/icons/app-development.png';
import serverIcon from '../assets/icons/server.png';

export default function About() {
  const services = [
    {
      icon: softwareIcon,
      title: 'Web Development',
      tech: 'React, NodeJS, Springboot, FastAPI, Open AI'
    },
    {
      icon: appDevelopmentIcon,
      title: 'App Development',
      tech: 'React Native/FireStore/ Expo'
    },
    {
      icon: serverIcon,
      title: 'Web Hosting',
      tech: 'AWS, Docker, Kubernetes, Splunk, Kafka, Micorservice'
    }
  ];

  const metrics = [
    { value: '+40 %', label: 'Faster deployments' },
    { value: '99 %', label: 'Uptime supported' },
    { value: '-35 %', label: 'LCP reduced' },
  ];

  return (
    <section id="about" className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
        >
          {/* Left: Services rail with vertical line and dots */}
          <div className="relative">
            <div className="absolute left-4 top-5 bottom-8 w-0.5 bg-orange-400" aria-hidden="true" />
            <ul className="space-y-8 pl-10">
              {services.map((service, index) => {
                return (
                  <li key={index} className="relative">
                    {/* Dot on the timeline */}
                    <div className="absolute -left-7 top-2.5 h-3 w-3 bg-orange-400 rounded-full" aria-hidden="true" />
                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-10 w-10 items-center justify-center flex-shrink-0">
                        <img src={service.icon} alt={service.title} className="w-8 h-8 object-contain" style={{ filter: 'brightness(0) invert(1)' }} loading="lazy" decoding="async" />
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
              I’m a Full-Stack Engineer with 5+ years of experience building production-ready web and mobile systems using React/TypeScript, Node.js, and Java/Spring Boot. I build cloud-native services on AWS, focus on performance and reliability, and ship end-to-end features from UI to APIs and deployment. MS in Information Technology (Dec 2025), University of Cincinnati (GPA 4.0). Seeking SDE roles in frontend, backend, or full-stack engineering. </p>
            <div className="grid grid-cols-3 gap-4 justify-items-start">
              {metrics.map((m, index) => {
                const [value, suffix] = m.value.split(' ');
                return (
                  <div key={index} className="">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {value}
                      {suffix && <span className="text-orange-400"> {suffix}</span>}
                    </div>
                    <div className="text-slate-300 text-sm">{m.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
