/**
 * Reusable badge/chip component
 * @param {string} variant - 'default' | 'orange' | 'success' | 'warning'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {React.ReactNode} children - Badge content
 */
export default function Badge({ 
  variant = 'default', 
  size = 'md',
  children,
  className = '' 
}) {
  const baseClasses = 'inline-flex items-center justify-center rounded-full border font-semibold';
  
  const variantClasses = {
    default: 'bg-slate-800 text-slate-300 border-white/10',
    orange: 'bg-orange-900/20 text-orange-300 border-orange-400/30',
    success: 'bg-green-500/10 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
}

