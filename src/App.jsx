import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Footer from './components/Footer';
import ResumeChatDrawer from './components/ResumeChatDrawer';
import { useRef } from 'react';

function App() {
  const chatRef = useRef(null);

  return (
    <div className="min-h-screen">
      <Navbar onOpenChat={() => chatRef.current?.open?.()} />
      <Hero />
      <Projects />
      <Experience />
      <Skills />
      <Footer />
      <ResumeChatDrawer ref={chatRef} />
    </div>
  );
}

export default App
