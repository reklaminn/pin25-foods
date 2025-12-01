'use client';

import { useState, useEffect } from 'react';
import { getLogoUrl } from '@/lib/storage';

/**
 * Hook to get logo URL with caching
 */
export function useLogo() {
  const [logoUrl, setLogoUrl] = useState<string>('/logo.svg');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchLogo = async () => {
      try {
        // Check localStorage cache first
        const cachedLogo = localStorage.getItem('logo_url');
        const cacheTime = localStorage.getItem('logo_cache_time');
        const now = Date.now();

        // Use cache if less than 1 hour old
        if (cachedLogo && cacheTime && (now - parseInt(cacheTime)) < 3600000) {
          if (mounted) {
            setLogoUrl(cachedLogo);
            setLoading(false);
          }
          // Background refresh to ensure freshness
          getLogoUrl().then((url) => {
            if (url !== cachedLogo) {
              localStorage.setItem('logo_url', url);
              localStorage.setItem('logo_cache_time', now.toString());
              if (mounted) setLogoUrl(url);
            }
          });
          return;
        }

        // Fetch from database
        const url = await getLogoUrl();
        if (mounted) {
          setLogoUrl(url);
          localStorage.setItem('logo_url', url);
          localStorage.setItem('logo_cache_time', now.toString());
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in useLogo:', error);
        if (mounted) setLoading(false);
      }
    };

    fetchLogo();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshLogo = async () => {
    setLoading(true);
    const url = await getLogoUrl();
    setLogoUrl(url);
    localStorage.setItem('logo_url', url);
    localStorage.setItem('logo_cache_time', Date.now().toString());
    setLoading(false);
  };

  return { logoUrl, loading, refreshLogo };
}
