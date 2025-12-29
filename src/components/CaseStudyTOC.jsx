import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'problem', label: 'Problem' },
  { id: 'my-role', label: 'My Role' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'key-decisions', label: 'Key Decisions' },
  { id: 'results', label: 'Results' },
  { id: 'improvements', label: 'What I\'d Improve Next' },
  { id: 'links', label: 'Links' },
];

export default function CaseStudyTOC({ className = '' }) {
  const [activeSection, setActiveSection] = useState('problem');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for sticky header

      // Find the current section based on scroll position
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const section = document.getElementById(SECTIONS[i].id);
        if (section) {
          const offsetTop = section.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveSection(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offsetTop = section.offsetTop - 100; // Account for sticky header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className={`sticky top-24 ${className}`}>
      <div className="mb-6">
        <h3 className="text-sm font-bold text-white">Article's content</h3>
      </div>
      <div className="relative pl-1">
        {/* Vertical dotted line */}
        <div className="absolute left-2.5 top-0 bottom-0 w-px border-l border-dashed border-slate-500/60"></div>
        
        {/* Section items */}
        <div className="relative space-y-0">
          {SECTIONS.map((section, index) => {
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => handleClick(section.id)}
                className={`relative flex items-center gap-3 w-full text-left py-2 transition-colors group ${
                  isActive
                    ? ''
                    : 'hover:opacity-80'
                }`}
              >
                {/* Circular marker */}
                <div
                  className={`relative z-10 flex-shrink-0 w-3 h-3 rounded-full transition-all ${
                    isActive
                      ? 'bg-blue-500 border-0'
                      : 'bg-transparent border border-slate-500'
                  }`}
                />
                
                {/* Label */}
                <span className={`text-sm font-normal transition-colors ${
                  isActive ? 'text-blue-500' : 'text-slate-400'
                }`}>
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

