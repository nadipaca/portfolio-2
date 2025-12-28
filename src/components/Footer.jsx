import { Github, Linkedin, Mail } from 'lucide-react';
import { portfolioData } from '../constants';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 border-t border-orange-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-slate-300">
              © {new Date().getFullYear()} {portfolioData.profile.name}
            </p>
            <p className="text-slate-500 text-sm mt-1">{portfolioData.profile.role}</p>
          </div>
          <div className="flex items-center space-x-6">
            <a
              href={portfolioData.profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors hover:scale-110 transform duration-200"
            >
              <Github size={20} />
            </a>
            <a
              href={portfolioData.profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors hover:scale-110 transform duration-200"
            >
              <Linkedin size={20} />
            </a>
            <a
              href={`mailto:${portfolioData.profile.socials.email}`}
              className="text-slate-400 hover:text-white transition-colors hover:scale-110 transform duration-200"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

