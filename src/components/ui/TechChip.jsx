/**
 * Reusable tech stack chip component
 * @param {string} tech - Technology name
 * @param {string} variant - 'primary' | 'secondary'
 */
export default function TechChip({ 
  tech, 
  variant = 'primary',
  className = '' 
}) {
  const variantClasses = {
    primary: 'bg-white/5 text-slate-200 border border-white/10',
    secondary: 'bg-transparent text-slate-400 border border-slate-600/50',
  };

  const classes = `px-2 py-0.5 text-xs rounded border ${variantClasses[variant]} ${className}`;

  return (
    <span className={classes}>
      {tech}
    </span>
  );
}

