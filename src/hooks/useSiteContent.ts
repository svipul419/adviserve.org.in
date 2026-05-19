import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../lib/api';

/**
 * Hook to fetch all website_content for a given page slug via API.
 * Returns a content map (section_key -> content_value) for visible items.
 */
export function useSiteContent(pageSlug: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['siteContent', pageSlug],
    queryFn: () => publicApi.getContent(pageSlug),
  });

  return {
    content: data?.content ?? {},
    items: data?.items ?? [],
    pageId: data?.pageId ?? null,
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
  };
}

/**
 * Helper to parse JSON content safely, returning fallback on failure.
 *
 * CMS sometimes returns raw source-code strings ("import { … }", "<script>…").
 * Validate the leading token looks JSON-shaped before attempting JSON.parse —
 * stops SyntaxErrors from surfacing in the console and crashing strict callers.
 */
export function parseJsonContent<T>(value: string | undefined | null, fallback: T): T {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  const first = trimmed[0];
  if (first !== '{' && first !== '[' && first !== '"') return fallback;
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    return fallback;
  }
}
