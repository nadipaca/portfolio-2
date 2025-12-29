import { motion } from 'framer-motion';

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
  }
}) {
  return (
    <motion.div
      {...animationProps}
      className="text-center mb-12"
    >
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
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

