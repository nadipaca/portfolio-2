/**
 * Reusable section wrapper with consistent styling
 * @param {string} id - Section ID for navigation
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children - Section content
 */

import { createContext } from 'react';

export const SectionContext = createContext({ id: null });


export default function SectionWrapper({ id, className = '', children }) {
  return (
    <section id={id} 
    className={`py-20 bg-slate-900 relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 section-glow pointer-events-none" />
      {/* <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> */}

      <SectionContext.Provider value={{ id }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
        </div>
      </SectionContext.Provider>
    </section>
  );
}

