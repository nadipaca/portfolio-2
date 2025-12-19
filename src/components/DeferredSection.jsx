import { useEffect, useRef, useState } from 'react';

/**
 * Mount heavy sections only when they are near the viewport.
 * Keeps an anchor element in the DOM (via `id`) so navbar hash links still work.
 */
export default function DeferredSection({
  id,
  className = '',
  rootMargin = '800px 0px',
  minHeight = 180,
  forceMount = false,
  children,
}) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(Boolean(forceMount));

  useEffect(() => {
    if (forceMount) {
      setMounted(true);
      return;
    }
    if (mounted) return;

    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      // No IO support: mount immediately.
      setMounted(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setMounted(true);
          obs.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [forceMount, mounted, rootMargin]);

  return (
    <div
      id={id}
      ref={ref}
      className={`scroll-mt-24 ${className}`}
      style={!mounted ? { minHeight } : undefined}
    >
      {mounted ? children : null}
    </div>
  );
}


