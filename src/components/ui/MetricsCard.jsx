import { motion } from 'framer-motion';

/**
 * Reusable metrics card component
 * @param {string} value - Metric value (e.g., "99%", "+40%")
 * @param {string} label - Metric label
 * @param {string} variant - 'default' | 'orange'
 * @param {object} animationProps - Optional animation props
 */
export default function MetricsCard({ 
  value, 
  label, 
  variant = 'default',
  animationProps = {}
}) {
  const variantClasses = {
    default: 'bg-slate-800/50 border-orange-400/20',
    orange: 'bg-orange-400/10 border-orange-400/30',
  };

  // Parse value and suffix (e.g., "+40 %" -> value: "+40", suffix: "%")
  const [mainValue, suffix] = value.split(' ');

  return (
    <motion.div
      className={`rounded-lg p-4 md:p-6 border ${variantClasses[variant]}`}
      {...animationProps}
    >
      <div className="text-2xl md:text-3xl font-bold text-white mb-1">
        {mainValue}
        {suffix && <span className="text-orange-400"> {suffix}</span>}
      </div>
      <div className="text-sm text-slate-300">{label}</div>
    </motion.div>
  );
}

