import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../lib/api';

async function fetchSEOSettings() {
  const settings = await publicApi.getSettings();

  const map: Record<string, string> = {};
  (settings || []).forEach((row: { category?: string; key: string; value: string | null }) => {
    if (row.category) {
      map[`${row.category}.${row.key}`] = row.value || '';
    }
    map[row.key] = row.value || '';
  });
  return map;
}

export function useSEOSettings() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seoSettings'],
    queryFn: fetchSEOSettings,
  });

  return {
    settings: data ?? {},
    loading: isLoading,
    error: error?.message ?? null,
  };
}
