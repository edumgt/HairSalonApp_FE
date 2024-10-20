import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export function useScrollRestoration() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef(new Map());

  useEffect(() => {
    console.log('useScrollRestoration effect running', { pathname, navigationType });

    const handleScroll = () => {
      scrollPositions.current.set(pathname, window.scrollY);
    };

    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    } else {
      const savedPosition = scrollPositions.current.get(pathname);
      if (savedPosition !== undefined) {
        window.scrollTo(0, savedPosition);
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, navigationType]);
}