import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { Link as LinkIcon, Check } from 'lucide-react';
import { SectionContext } from './SectionWrapper';

/**
 * Reusable section header component with consistent styling and animations
 * @param {string} title - Main heading text
 * @param {string} subtitle - Optional subtitle/description
 * @param {React.ReactNode} children - Optional additional content (e.g., buttons)
 * @param {object} animationProps - Optional custom animation props
 */
export default function SectionHeader({ 
  title, 
  subtitle, 
  children,
  animationProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  },
}) {

  const { id: anchorId } = useContext(SectionContext) || {};
  const [copied, setCopied] = useState(false);

  const handleAnchorClick = async () => {
    if (!anchorId) return;
    const url = new URL(window.location.href);
    url.hash = anchorId;

    // Update URL without reload and scroll into view
    window.history.replaceState(null, '', url.toString());
    document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // no-op
    }
  };

   return (
    <motion.div 
     {...animationProps}
      className="text-center mb-12"
            >
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
        <span className='pr-8'>
        {anchorId && (
            <button
              type="button"
              onClick={handleAnchorClick}
              title={copied ? 'Copied!' : 'Copy link to this section'}
              className={`inline-flex items-center justify-center h-8 w-8 rounded-md border transition-colors
                ${copied
                  ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-orange-300 hover:bg-orange-400/10 hover:border-orange-400/30'}`}
              aria-label="Copy link to this section"
            >
              {copied ? <Check size={16} /> : <LinkIcon size={16} />}
            </button>
          )}
          </span>
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-300 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      {children && (
        <div className="mt-6 flex justify-center">
          {children}
        </div>
      )}
    </motion.div>
  );
}

