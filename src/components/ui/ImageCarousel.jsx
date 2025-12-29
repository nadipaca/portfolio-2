import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable image carousel component
 * @param {Array} images - Array of image objects with {src, caption, metrics}
 * @param {boolean} autoPlay - Enable auto-play
 * @param {number} autoPlayInterval - Auto-play interval in ms
 * @param {boolean} showIndicators - Show dot indicators
 * @param {boolean} showNavigation - Show prev/next buttons
 */
export default function ImageCarousel({ 
  images = [], 
  autoPlay = false,
  autoPlayInterval = 4000,
  showIndicators = true,
  showNavigation = true,
  className = ''
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || images.length <= 1 || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, images.length, isPaused, autoPlayInterval]);

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative bg-slate-800 rounded-xl overflow-hidden aspect-video shadow-lg">
        {/* Image Display */}
        {currentImage?.src ? (
          <img
            src={currentImage.src}
            alt={currentImage.caption || `Gallery image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            loading={currentIndex === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gray-400 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Image Placeholder</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {showNavigation && images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-900/60 backdrop-blur-md hover:bg-slate-900/70 rounded-full p-2.5 shadow-lg border border-white/10 transition-all z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="text-white" size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900/60 backdrop-blur-md hover:bg-slate-900/70 rounded-full p-2.5 shadow-lg border border-white/10 transition-all z-10"
              aria-label="Next image"
            >
              <ChevronRight className="text-white" size={20} />
            </button>
          </>
        )}

        {/* Indicators */}
        {showIndicators && images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'w-8 bg-orange-400' : 'w-2 bg-slate-600'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Caption and Metrics */}
      {currentImage && (
        <div className="mt-3">
          {currentImage.caption && (
            <p className="text-sm text-slate-400 text-center font-medium mb-2">
              {currentImage.caption}
            </p>
          )}
          {currentImage.metrics && currentImage.metrics.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              {currentImage.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 bg-orange-400/10 border border-orange-400/30 rounded-lg"
                >
                  <div className="text-xs font-semibold text-orange-300">{metric.label}</div>
                  <div className="text-sm font-bold text-orange-400">{metric.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

