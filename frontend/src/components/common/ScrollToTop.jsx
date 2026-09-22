import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 *
 * Ensures that whenever the pathname/report section changes,
 * the page starts instantly at the TOP of the section (Section 19).
 *
 * If a hash anchor is provided or clicked within the same page,
 * it scrolls smoothly to the target element (Section 20).
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace(/^#/, '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    // On route change without hash, instant scroll to top (no smooth animation)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, hash]);

  return null;
}
