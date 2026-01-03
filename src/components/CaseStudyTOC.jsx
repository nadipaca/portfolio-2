import { useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const DEFAULT_SECTIONS = [
  { id: 'problem', label: 'Problem' },
  { id: 'my-role', label: 'My Role' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'key-decisions', label: 'Key Decisions' },
  { id: 'results', label: 'Results' },
  { id: 'improvements', label: 'What I\'d Improve Next' },
  { id: 'links', label: 'Links' },
];

export default function CaseStudyTOC({
  className = '',
  mode = 'sidebar', // 'sidebar' | 'mobile'
  title = "Content",
  sections = DEFAULT_SECTIONS,
}) {
  const [activeSection, setActiveSection] = useState(sections?.[0]?.id || 'problem');
  const [open, setOpen] = useState(false);

  const activeLabel = useMemo(() => {
    const hit = (sections || []).find((s) => s.id === activeSection);
    return hit?.label || 'Overview';
  }, [activeSection, sections]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for sticky header

      // Find the current section based on scroll position
      for (let i = (sections || []).length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section) {
          const offsetTop = section.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const handleClick = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offsetTop = section.offsetTop - 100; // Account for sticky header
      setOpen(false);
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const list = (
    <div className="relative pl-1">
      <div className="relative space-y-0">
        {(sections || []).map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => handleClick(section.id)}
              className={`relative flex items-center gap-3 w-full text-left py-2 transition-colors ${
                isActive ? '' : 'hover:opacity-80'
              }`}
            >
              <div
                className={`relative z-10 flex-shrink-0 w-3 h-3 rounded-full transition-all ${
                  isActive ? 'bg-orange-400 border-0' : 'bg-transparent border border-slate-500'
                }`}
              />
              <span className={`text-sm font-normal transition-colors ${isActive ? 'text-orange-300' : 'text-slate-400'}`}>
                {section.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  if (mode === 'mobile') {
    return (
      <nav className={`sticky top-20 z-20 ${className}`}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/90 backdrop-blur px-4 py-3 text-left"
          aria-expanded={open}
        >
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wide text-slate-400">{title}</div>
            <div className="text-sm font-semibold text-white truncate">{activeLabel}</div>
          </div>
          <ChevronDown size={18} className={`text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open ? (
          <div className="mt-2 rounded-xl border border-white/10 bg-slate-900/95 shadow-xl px-3 py-2">
            {list}
          </div>
        ) : null}
      </nav>
    );
  }

  return (
    <nav className={`sticky top-24 ${className}`}>
      <div className="mb-6">
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      {list}
    </nav>
  );
}

