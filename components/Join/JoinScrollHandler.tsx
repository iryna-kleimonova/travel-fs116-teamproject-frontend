'use client';

import { useEffect } from 'react';

const JoinScrollHandler = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#join') {
        const timeoutId = setTimeout(() => {
          const joinSection = document.getElementById('join');
          if (joinSection) {
            joinSection.scrollIntoView({ behavior: 'smooth' });
            window.history.replaceState(null, '', window.location.pathname);
          }
        }, 100);

        return () => clearTimeout(timeoutId);
      }
    }
  }, []);

  return null;
};

export default JoinScrollHandler;
