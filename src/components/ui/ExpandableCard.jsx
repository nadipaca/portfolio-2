import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable expandable card component
 * @param {React.ReactNode} header - Header content (always visible)
 * @param {React.ReactNode} children - Expandable content
 * @param {boolean} defaultExpanded - Initial expanded state
 * @param {string} className - Additional CSS classes
 */
export default function ExpandableCard({ 
  header, 
  children, 
  defaultExpanded = false,
  className = '' 
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      className={`bg-slate-900/95 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border-2 border-white/10 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Header (always visible) */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full text-left p-6 pb-5 relative group/button"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {header}
          </div>
          <span
            className={`mt-1 inline-flex items-center justify-center h-9 w-9 rounded-full border transition-all ${
              expanded 
                ? 'border-orange-400/30 bg-orange-400/10 text-orange-400' 
                : 'border-white/10 bg-slate-800 text-slate-300 group-hover/button:border-orange-400/30 group-hover/button:bg-orange-400/10 group-hover/button:text-orange-400'
            }`}
            aria-hidden="true"
          >
            <ChevronDown className={`transition-transform ${expanded ? 'rotate-180' : ''}`} size={18} />
          </span>
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="px-6 pb-6 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

