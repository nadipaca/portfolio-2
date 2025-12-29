import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

/**
 * Reusable list item component with icon variants
 * @param {string} variant - 'check' | 'bullet' | 'arrow' | 'alert'
 * @param {React.ReactNode} children - List item content
 */
export default function ListItem({ 
  variant = 'bullet', 
  children,
  className = '' 
}) {
  const iconMap = {
    check: <CheckCircle2 className="text-emerald-400 mt-0.5 flex-shrink-0" size={16} />,
    bullet: <span className="text-orange-400 mt-1">•</span>,
    arrow: <span className="text-slate-500 mt-1">→</span>,
    alert: <AlertTriangle className="text-orange-400 mt-0.5 flex-shrink-0" size={16} />,
  };

  return (
    <li className={`flex items-start gap-3 text-slate-300 ${className}`}>
      {iconMap[variant]}
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

