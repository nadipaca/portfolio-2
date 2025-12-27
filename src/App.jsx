import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DeferredSection from './components/DeferredSection';

const Projects = lazy(() => import('./components/Projects'));
const Experience = lazy(() => import('./components/Experience'));
const GitHubProjects = lazy(() => import('./components/GitHubProjects'));
const Skills = lazy(() => import('./components/Skills'));
const Certifications = lazy(() => import('./components/Certifications'));
const Education = lazy(() => import('./components/Education'));
const Footer = lazy(() => import('./components/Footer'));
const ResumeChatDrawer = lazy(() => import('./components/ResumeChatDrawer'));

function SectionFallback({ label }) {
  return <div className="py-16 text-center text-slate-400">{label || 'Loading…'}</div>;
}

function App() {
  const chatRef = useRef(null);
  const [forced, setForced] = useState(() => {
    const h = String(window.location.hash || '').replace(/^#/, '').trim();
    const initial = new Set(h ? [h] : []);
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('project')) initial.add('projects');
    } catch {
      // ignore
    }
    return initial;
  });
  // Chat drawer always mounted; no conditional mounting

  useEffect(() => {
    const onHashChange = () => {
      const h = String(window.location.hash || '').replace(/^#/, '').trim();
      if (!h) return;
      setForced((prev) => {
        if (prev.has(h)) return prev;
        const next = new Set(prev);
        next.add(h);
        return next;
      });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const openChat = () => {
    // Drawer is always mounted; open immediately
    chatRef.current?.open?.();
  };

  return (
    <div className="min-h-screen">
      <Navbar onOpenChat={openChat} />
      <Hero />

      {/* Projects (near fold) */}
      <DeferredSection id="projects" minHeight={320} forceMount={forced.has('projects')}>
        <Suspense fallback={<SectionFallback label="Loading projects…" />}>
          <Projects />
        </Suspense>
      </DeferredSection>

      {/* Experience */}
      <DeferredSection id="experience" minHeight={420} forceMount={forced.has('experience')}>
        <Suspense fallback={<SectionFallback label="Loading experience…" />}>
          <Experience />
        </Suspense>
      </DeferredSection>

      {/* GitHub Projects */}
      <DeferredSection id="all-projects" minHeight={420} forceMount={forced.has('all-projects')}>
        <Suspense fallback={<SectionFallback label="Loading GitHub projects…" />}>
          <GitHubProjects />
        </Suspense>
      </DeferredSection>

      {/* Skills */}
      <DeferredSection id="skills" minHeight={340} forceMount={forced.has('skills')}>
        <Suspense fallback={<SectionFallback label="Loading skills…" />}>
          <Skills />
        </Suspense>
      </DeferredSection>

      {/* Certifications */}
      <DeferredSection id="certifications" minHeight={340} forceMount={forced.has('certifications')}>
        <Suspense fallback={<SectionFallback label="Loading certifications…" />}>
          <Certifications />
        </Suspense>
      </DeferredSection>

      {/* Education */}
      <DeferredSection id="education" minHeight={220} forceMount={forced.has('education')}>
        <Suspense fallback={<SectionFallback label="Loading education…" />}>
          <Education />
        </Suspense>
      </DeferredSection>

      {/* Footer */}
      <DeferredSection id="footer" minHeight={120} rootMargin="1200px 0px">
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </DeferredSection>

      {/* Chat drawer always mounted */}
      <Suspense fallback={null}>
        <ResumeChatDrawer ref={chatRef} />
      </Suspense>
    </div>
  );
}

export default App
