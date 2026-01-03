import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DeferredSection from './components/DeferredSection';
import SectionSkeleton from './components/SectionSkeleton';

const Projects = lazy(() => import('./components/Projects'));
const Experience = lazy(() => import('./components/Experience'));
const About = lazy(() => import('./components/About'));
const GitHubProjects = lazy(() => import('./components/GitHubProjects'));
const Skills = lazy(() => import('./components/Skills'));
const Certifications = lazy(() => import('./components/Certifications'));
const Education = lazy(() => import('./components/Education'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const ResumeChatDrawer = lazy(() => import('./components/ResumeChatDrawer'));
const CaseStudyPage = lazy(() => import('./components/CaseStudyPage'));

function ScrollToHashOnHome() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname !== '/' || !hash) return;
    const id = String(hash).replace(/^#/, '').trim();
    if (!id) return;

    const start = Date.now();
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
        return;
      }
      if (Date.now() - start > 2500) return;
      window.setTimeout(tryScroll, 100);
    };

    window.setTimeout(tryScroll, 0);
  }, [pathname, hash]);

  return null;
}

function HomePage() {
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
    chatRef.current?.open?.();
  };

  return (
    <div className="min-h-screen">
      <Navbar onOpenChat={openChat} />
      <Hero />

      {/* About */}
      <DeferredSection id="about" minHeight={380} rootMargin="200px 0px">
        <Suspense fallback={<SectionSkeleton lines={2} />}>
          <About />
        </Suspense>
      </DeferredSection>

      {/* Projects (near fold) */}
      <DeferredSection id="projects" minHeight={320} rootMargin="200px 0px" forceMount={forced.has('projects')}>
        <Suspense fallback={<SectionSkeleton lines={3} />}>
          <Projects />
        </Suspense>
      </DeferredSection>

      {/* Experience */}
      <DeferredSection id="experience" minHeight={420} rootMargin="200px 0px" forceMount={forced.has('experience')}>
        <Suspense fallback={<SectionSkeleton lines={2} />}>
          <Experience />
        </Suspense>
      </DeferredSection>

      {/* GitHub Projects */}
      <DeferredSection id="all-projects" minHeight={420} rootMargin="200px 0px" forceMount={forced.has('all-projects')}>
        <Suspense fallback={<SectionSkeleton lines={4} />}>
          <GitHubProjects />
        </Suspense>
      </DeferredSection>

      {/* Skills */}
      <DeferredSection id="skills" minHeight={340} rootMargin="200px 0px" forceMount={forced.has('skills')}>
        <Suspense fallback={<SectionSkeleton lines={3} />}>
          <Skills />
        </Suspense>
      </DeferredSection>

      {/* Certifications */}
      <DeferredSection id="certifications" minHeight={340} rootMargin="200px 0px" forceMount={forced.has('certifications')}>
        <Suspense fallback={<SectionSkeleton lines={3} />}>
          <Certifications />
        </Suspense>
      </DeferredSection>

      {/* Education */}
      <DeferredSection id="education" minHeight={400} rootMargin="200px 0px" forceMount={forced.has('education')}>
        <Suspense fallback={<SectionSkeleton lines={2} />}>
          <Education />
        </Suspense>
      </DeferredSection>

      {/* Contact */}
      <DeferredSection id="contact" minHeight={500} rootMargin="200px 0px" forceMount={forced.has('contact')}>
        <Suspense fallback={<SectionSkeleton lines={1} />}>
          <Contact />
        </Suspense>
      </DeferredSection>

      {/* Footer */}
      <DeferredSection id="footer" minHeight={120} rootMargin="400px 0px">
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

function App() {
  return (
    <>
      <ScrollToHashOnHome />
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/case-studies/:slug" element={
        <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading case study…</div>}>
          <CaseStudyPage />
        </Suspense>
      } />
      </Routes>
    </>
  );
}

export default App
