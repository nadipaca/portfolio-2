import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { SiOracle } from 'react-icons/si';
import { FaMicrosoft } from 'react-icons/fa';
import { portfolioData } from '../constants';

function normalize(s) {
  return String(s || '').trim();
}

function formatIssuedExpires(issued, expires) {
  const i = normalize(issued);
  const e = normalize(expires);
  if (i && e) return `Issued ${i} · Expires ${e}`;
  if (i) return `Issued ${i}`;
  if (e) return `Expires ${e}`;
  return '';
}

function CertificationCard({ cert, index }) {
  const title = normalize(cert?.title);
  const issuer = normalize(cert?.issuer);
  const issued = normalize(cert?.issued);
  const expires = normalize(cert?.expires);
  const credentialId = normalize(cert?.credentialId);
  const credentialUrl = normalize(cert?.credentialUrl);
  const issuerLogo = normalize(cert?.issuerLogo);
  const issuerLogoAlt = issuer ? `${issuer} logo` : 'Issuer logo';

  const IssuerIcon = (() => {
    const i = issuer.toLowerCase();
    if (i.includes('oracle')) return SiOracle;
    if (i.includes('microsoft')) return FaMicrosoft;
    return null;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: Math.min(index, 10) * 0.05 }}
    >
      <div className="rounded-2xl border border-orange-400/20 shadow-sm hover:shadow-xl transition-shadow bg-slate-900/90 hover:border-orange-400/40 overflow-hidden">
        <div className="p-5 flex gap-4 sm:gap-5">
          {/* Issuer Logo (LinkedIn-style) */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-xl border border-orange-400/20 bg-slate-800 overflow-hidden flex items-center justify-center">
            {IssuerIcon ? (
              <IssuerIcon
                aria-label={issuerLogoAlt}
                title={issuerLogoAlt}
                className={issuer.toLowerCase().includes('oracle') ? 'text-red-500' : 'text-slate-800'}
                size={32}
              />
            ) : issuerLogo ? (
              <img
                src={issuerLogo}
                alt={issuerLogoAlt}
                loading="lazy"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="text-slate-500 text-xs font-bold">{issuer ? issuer.slice(0, 2).toUpperCase() : '—'}</div>
            )}
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight">
              {title || 'Certification'}
            </h3>
            <div className="text-sm text-slate-300 font-medium mt-0.5">{issuer || 'Issuer'}</div>

            {formatIssuedExpires(issued, expires) ? (
              <div className="text-sm text-slate-400 mt-1">{formatIssuedExpires(issued, expires)}</div>
            ) : null}

            {credentialId ? (
              <div className="text-sm text-slate-400 mt-1">
                <span className="font-semibold">Credential ID</span>{' '}
                <span className="font-mono text-xs">{credentialId}</span>
              </div>
            ) : null}

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              {credentialUrl ? (
                <a
                  href={credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-400 text-white font-semibold hover:bg-orange-300 transition-colors"
                >
                  <ExternalLink size={16} />
                  Show credential
                </a>
              ) : (
                <span className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 font-semibold border border-orange-400/20">
                  <ExternalLink size={16} />
                  Add credential URL
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Certifications() {
  const certs = useMemo(() => (Array.isArray(portfolioData?.certifications) ? portfolioData.certifications : []), []);

  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 section-glow pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Certifications</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Proof is one click away — verify credentials instantly.
          </p>
        </motion.div>

        {certs.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map((c, i) => (
              <CertificationCard key={c.id || `${c.title}-${i}`} cert={c} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl p-6 md:p-8 border border-white/10 bg-white/5 text-center text-slate-300">
            <div className="text-lg font-bold text-white mb-2">Add your certifications</div>
            <div className="text-sm">
              Put images in <span className="font-mono">public/certifications/</span> and add items to{' '}
              <span className="font-mono">portfolioData.certifications</span> in <span className="font-mono">src/constants.js</span>.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


