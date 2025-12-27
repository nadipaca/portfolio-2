import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 section-glow pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">About me</h2>
            <p className="text-slate-300 leading-relaxed">
              I build secure, scalable microservices and real-time applications across AWS using Spring Boot and Node.js.
              Practices include OAuth2/JWT, observability, CI/CD, and cloud-native design.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Uptime', value: '99.99%' },
              { label: 'Deploy speed', value: '+40%' },
              { label: 'DB latency', value: '\u221235%' },
              { label: 'WAU', value: '2,000+' },
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-3xl font-bold text-orange-400">{m.value}</div>
                <div className="text-slate-300 text-sm mt-1">{m.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
