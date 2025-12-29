import { forwardRef } from 'react';

/**
 * Reusable form field component
 * @param {string} label - Field label
 * @param {React.ReactNode} icon - Optional icon component
 * @param {string} type - Input type
 * @param {string} error - Error message
 */
const FormField = forwardRef(function FormField(
  { 
    label, 
    icon, 
    error,
    className = '',
    ...props 
  },
  ref
) {
  const inputClasses = `w-full px-4 py-3 bg-slate-800/50 border ${
    error ? 'border-red-500/50' : 'border-white/10'
  } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 transition-colors ${className}`;

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {icon && <span className="inline mr-2">{icon}</span>}
        {label}
      </label>
      <input
        ref={ref}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
});

export default FormField;

