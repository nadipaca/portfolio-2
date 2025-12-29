import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-based animations and active element tracking
 * @param {Function} onActiveChange - Callback when active element changes
 * @param {Array} elements - Array of element refs to track
 */
export function useScrollAnimation(onActiveChange, elements = []) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const computeActive = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      elements.forEach((elementRef, index) => {
        if (!elementRef?.current) return;
        const rect = elementRef.current.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const distance = Math.abs(centerY - viewportCenter);

        if (rect.top < window.innerHeight && rect.bottom > 0) {
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });

      if (activeIndex !== closestIndex) {
        setActiveIndex(closestIndex);
        onActiveChange?.(closestIndex);
      }
    };

    computeActive();

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          computeActive();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', computeActive);
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', computeActive);
    };
  }, [elements, activeIndex, onActiveChange]);

  return activeIndex;
}

