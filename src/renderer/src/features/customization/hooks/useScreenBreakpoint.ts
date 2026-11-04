import { useState, useEffect } from 'react';
import { ScreenBreakpoint } from '../types/customization.types';

export function useScreenBreakpoint() {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    let animId: number;
    const handleResize = () => {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const { width, height } = dimensions;

  let breakpoint: ScreenBreakpoint = 'desktop';
  if (width < 768) {
    breakpoint = 'mobile';
  } else if (width < 1024) {
    breakpoint = 'tablet';
  } else if (width >= 1440) {
    breakpoint = 'ultrawide';
  }

  return {
    width,
    height,
    breakpoint,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024 && width < 1440,
    isUltraWide: width >= 1440,
    shouldAutoCollapseSidebar: width < 1180,
  };
}

