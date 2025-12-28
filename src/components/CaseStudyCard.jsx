import { memo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileDeviceFrame from './MobileDeviceFrame';
import playgroundThumbnail from '../assets/thumbnails/playground.png';

function CaseStudyCard({ caseStudy }) {
  const navigate = useNavigate();
  const categoryColors = {
    'AI/ML': 'bg-orange-900/20 text-orange-300 border-orange-400/30',
    'Mobile': 'bg-orange-900/20 text-orange-300 border-orange-400/30',
    'Cloud Architecture': 'bg-orange-900/20 text-orange-300 border-orange-400/30',
    'Web': 'bg-orange-900/20 text-orange-300 border-orange-400/30',
  };

  const handleClick = () => {
    // If it's a GitHub-only repo (no full case study), go to GitHub repo
    if (caseStudy.id?.startsWith('github-')) {
      window.open(caseStudy.links.repo, '_blank', 'noopener,noreferrer');
      return;
    }
    // Otherwise navigate to case study page
    navigate(`/case-studies/${caseStudy.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="bg-slate-900/90 rounded-2xl shadow-lg hover:shadow-2xl border border-orange-400/20 hover:border-orange-400/60 transition-all relative overflow-hidden cursor-pointer group"
      onClick={handleClick}
    >
      {/* Subtle corner glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-400/15 transition-colors" />
      
      <div className="flex flex-col w-full">
        {/* Image/Video with Overlay Badge and Arrow */}
        <div className="relative w-full">
          {caseStudy.category === 'Mobile' && caseStudy.id === 'playground-app' ? (
            // Playground app thumbnail image
            <div className="relative w-full aspect-video overflow-hidden">
              <img
                src={playgroundThumbnail}
                alt={caseStudy.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              {/* Overlay Badge and Arrow */}
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3 z-10">
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm bg-black/30 ${
                    categoryColors[caseStudy.category] || 'bg-slate-800 text-slate-300 border-white/10'
                  }`}
                >
                  {caseStudy.category}
                </span>
                
                <div className="flex items-center gap-2">
                  {caseStudy.readTime && (
                    <span className="text-xs text-white backdrop-blur-sm bg-black/30 px-2 py-0.5 rounded">{caseStudy.readTime}</span>
                  )}
                  <motion.div
                    className="text-white backdrop-blur-sm bg-black/30 p-1 rounded-full"
                    whileHover={{ x: 4 }}
                  >
                    <ArrowRight size={16} className="rotate-[-45deg]" />
                  </motion.div>
                </div>
              </div>
            </div>
          ) : caseStudy.category === 'Mobile' && caseStudy.videoUrl ? (
            // Mobile Device Frame for mobile apps (compact version for card)
            <div className="relative w-full flex justify-center bg-slate-800/50 aspect-video">
              <div className="relative w-full max-w-[200px] h-full">
                <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-[1.5rem] p-1.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] h-full">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-900 rounded-b-lg z-10"></div>
                  
                  {/* Screen Container */}
                  <div className="bg-black rounded-[1.25rem] overflow-hidden relative h-full" style={{ aspectRatio: '9/19' }}>
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/40 to-transparent z-10 flex items-center justify-between px-2 text-white text-[7px] font-medium">
                      <span>9:41</span>
                      <div className="flex items-center gap-0.5">
                        <div className="w-1.5 h-0.5 border border-white/80 rounded-sm"></div>
                        <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Video Container */}
                    <div className="w-full h-full flex items-center justify-center bg-black">
                      <video
                        src={caseStudy.videoUrl}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => {
                          e.target.pause();
                          e.target.currentTime = 0;
                        }}
                      />
                    </div>
                    
                    {/* Home Indicator */}
                    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-white/40 rounded-full"></div>
                  </div>
                </div>
              </div>
              {/* Overlay Badge and Arrow */}
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3 z-10">
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm bg-black/30 ${
                    categoryColors[caseStudy.category] || 'bg-slate-800 text-slate-300 border-white/10'
                  }`}
                >
                  {caseStudy.category}
                </span>
                
                <div className="flex items-center gap-2">
                  {caseStudy.readTime && (
                    <span className="text-xs text-white backdrop-blur-sm bg-black/30 px-2 py-0.5 rounded">{caseStudy.readTime}</span>
                  )}
                  <motion.div
                    className="text-white backdrop-blur-sm bg-black/30 p-1 rounded-full"
                    whileHover={{ x: 4 }}
                  >
                    <ArrowRight size={16} className="rotate-[-45deg]" />
                  </motion.div>
                </div>
              </div>
            </div>
          ) : (
            // Regular video/image placeholder for non-mobile
            <div className="relative w-full aspect-video overflow-hidden bg-slate-800/50">
              {caseStudy.videoUrl ? (
                <video
                  src={caseStudy.videoUrl}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => {
                    e.target.pause();
                    e.target.currentTime = 0;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <div className="text-center">
                    <div className="text-slate-500 text-sm mb-2">Video Preview</div>
                    <div className="flex flex-wrap gap-2 justify-center text-xs text-slate-400">
                      {caseStudy.stack.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-700/50 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* Overlay Badge and Arrow */}
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3 z-10">
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm bg-black/30 ${
                    categoryColors[caseStudy.category] || 'bg-slate-800 text-slate-300 border-white/10'
                  }`}
                >
                  {caseStudy.category}
                </span>
                
                <div className="flex items-center gap-2">
                  {caseStudy.readTime && (
                    <span className="text-xs text-white backdrop-blur-sm bg-black/30 px-2 py-0.5 rounded">{caseStudy.readTime}</span>
                  )}
                  <motion.div
                    className="text-white backdrop-blur-sm bg-black/30 p-1 rounded-full"
                    whileHover={{ x: 4 }}
                  >
                    <ArrowRight size={16} className="rotate-[-45deg]" />
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content - Full width, starts from top */}
        <div className="w-full flex flex-col flex-grow">
          {/* Title */}
          <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2 tracking-tight line-clamp-2 group-hover:text-orange-300 transition-colors px-4 pt-4">
            {caseStudy.title}
          </h3>

          {/* One-liner */}
          <p className="text-sm text-slate-400 mb-3 line-clamp-2 px-4">
            {caseStudy.oneLiner}
          </p>

          {/* Impact Metrics - List points with border */}
          {caseStudy.impactChips && caseStudy.impactChips.length > 0 && (
            <div className="border-t border-white/10 mb-3 px-4">
              <ul className="space-y-1.5 pt-2">
                {caseStudy.impactChips.slice(0, 2).map((chip, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-orange-400">✓</span>
                    <span className="text-white font-medium">
                      {chip.value ? `${chip.label} ${chip.value}` : chip.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stack Chips (max 3) + "+N" */}
          <div className="flex flex-wrap gap-1.5 mb-3 px-4">
            {caseStudy.stack.slice(0, 3).map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-xs bg-white/5 text-slate-200 rounded border border-white/10"
              >
                {tech}
              </span>
            ))}
            {caseStudy.stack.length > 3 && (
              <span className="px-2 py-0.5 text-xs bg-white/5 text-slate-200 rounded border border-white/10">
                +{caseStudy.stack.length - 3}
              </span>
            )}
          </div>

          {/* Footer: Small CTA Button + Secondary Links */}
          <div className="flex items-center gap-2 pt-3 border-t border-white/10 mt-auto px-4 pb-4">
            {/* Small CTA Button */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-400 hover:bg-orange-300 text-white text-sm font-medium rounded-md transition-colors group/btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{caseStudy.id?.startsWith('github-') ? 'View repo' : 'View case study'}</span>
              <ArrowRight size={14} />
            </motion.button>
            
            {/* Secondary Links */}
            <div className="flex items-center gap-1">
              {caseStudy.links.repo && (
                <a
                  href={caseStudy.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  title="View Repository"
                >
                  <Github size={16} />
                </a>
              )}
              
              {caseStudy.links.demo && caseStudy.links.demo !== '#' && (
                <a
                  href={caseStudy.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  title="View Demo"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(CaseStudyCard);
