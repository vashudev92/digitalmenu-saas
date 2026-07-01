'use client';

import { useEffect } from 'react';

interface FontLoaderProps {
  headingFont?: string | null;
  bodyFont?: string | null;
}

/**
 * Dynamically loads Google Fonts by injecting <link> tags into the document head.
 * Only loads fonts that are not already loaded, preventing duplicate requests.
 */
export default function FontLoader({ headingFont, bodyFont }: FontLoaderProps) {
  useEffect(() => {
    const fontsToLoad = new Set<string>();
    
    if (headingFont && headingFont !== 'Playfair Display') {
      fontsToLoad.add(headingFont);
    }
    if (bodyFont && bodyFont !== 'Inter') {
      fontsToLoad.add(bodyFont);
    }

    fontsToLoad.forEach((font) => {
      const linkId = `google-font-${font.replace(/\s+/g, '-').toLowerCase()}`;
      
      // Skip if already loaded
      if (document.getElementById(linkId)) return;

      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`;
      document.head.appendChild(link);
    });
  }, [headingFont, bodyFont]);

  return null;
}
