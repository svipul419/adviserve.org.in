import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../lib/api';

interface SiteAssets {
  logo_url: string;
  favicon_url: string;
}

async function fetchSiteAssets(): Promise<SiteAssets | null> {
  try {
    const settings = await publicApi.getSettings(['logo_url', 'favicon_url']);
    if (!settings || settings.length === 0) return null;

    const map: Record<string, string> = {};
    settings.forEach((s: any) => {
      if (s.key && s.value) map[s.key] = s.value;
    });

    if (!map.logo_url && !map.favicon_url) return null;
    return {
      logo_url: map.logo_url || '',
      favicon_url: map.favicon_url || '',
    };
  } catch {
    return null;
  }
}

export function useSiteAssets() {
  const { data: assets } = useQuery({
    queryKey: ['siteAssets'],
    queryFn: fetchSiteAssets,
  });

  useEffect(() => {
    if (assets?.favicon_url) {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = assets.favicon_url;
    }
  }, [assets?.favicon_url]);

  return assets ?? null;
}
