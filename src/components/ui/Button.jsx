import { motion } from 'framer-motion';
import { forwardRef } from 'react';

/**
 * Reusable button component with variants
 * @param {string} variant - 'primary' | 'secondary' | 'outline'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} disabled - Disabled state
 * @param {string} as - Render as 'button' | 'a' | 'span'
 * @param {React.ReactNode} children - Button content
 * @param {object} motionProps - Optional framer-motion props
 */
const Button = forwardRef(function Button(
  { 
    variant = 'primary', 
    size = 'md', 
    disabled = false,
    as: Component = 'button',
    children, 
    className = '',
    motionProps = {},
    ...props 
  },
  ref
) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-orange-400 text-white hover:bg-orange-300',
    secondary: 'bg-transparent border-2 border-orange-400 text-white hover:bg-orange-400/10',
    outline: 'bg-white/10 border border-white/10 text-slate-100 hover:bg-white/15',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const defaultMotionProps = Component === 'button' ? {
    whileHover: disabled ? {} : { scale: 1.02 },
    whileTap: disabled ? {} : { scale: 0.98 },
  } : {};

  const MotionComponent = Component === 'button' ? motion.button : 
                          Component === 'a' ? motion.a : 
                          Component === 'span' ? motion.span : motion.button;

  return (
    <MotionComponent
      ref={ref}
      className={classes}
      disabled={Component === 'button' ? disabled : undefined}
      {...defaultMotionProps}
      {...motionProps}
      {...props}
    >
      {children}
    </MotionComponent>
  );
});

export default Button;

