import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../lib/api';

async function fetchSiteSettings() {
  const data = await publicApi.getSettings();
  const map: Record<string, string> = {};
  (data || []).forEach((item: { key: string; value: string }) => {
    map[item.key] = item.value;
  });
  return map;
}

/**
 * Hook to fetch all site_settings as a key-value map via API.
 */
export function useSiteSettings(_category?: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => fetchSiteSettings(),
  });

  return {
    settings: data ?? {},
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
  };
}
