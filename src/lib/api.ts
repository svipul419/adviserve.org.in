/**
 * API Client — replaces direct Supabase database calls.
 * All database operations go through our secure Vercel API routes.
 * Supabase is only used for authentication (login/logout/session).
 */
import { supabase } from './supabase';

const API_BASE = '/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `API error: ${res.status}`);
  }
  return res.json();
}

/**
 * Get the current admin session bearer token from the Supabase SDK.
 *
 * Uses `supabase.auth.getSession()` so we don't rely on the internal
 * localStorage key format (which Supabase has changed across major versions
 * and which differs when cookie-based storage is enabled).
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return { Authorization: `Bearer ${session.access_token}` };
    }
  } catch {
    /* ignore — caller will get an unauthenticated request */
  }
  return {};
}

// ─── PUBLIC API ───

export const publicApi = {
  getContent: (pageSlug: string) =>
    fetchApi<{ content: Record<string, string>; items: any[]; pageId: string | null }>(`/content?page=${pageSlug}`),

  getBlogPosts: () =>
    fetchApi<any[]>('/blog'),

  getBlogPost: (slug: string) =>
    fetchApi<any | null>(`/blog?slug=${slug}`),

  getServices: () =>
    fetchApi<any[]>('/services'),

  getService: (slug: string) =>
    fetchApi<any | null>(`/services?slug=${slug}`),

  getSubServices: (parentSlug: string) =>
    fetchApi<any[]>(`/services?parent=${parentSlug}`),

  getSettings: (keys?: string[]) =>
    fetchApi<any[]>(keys ? `/settings?keys=${keys.join(',')}` : '/settings'),

  getLegalDocument: (slug: string) =>
    fetchApi<any | null>(`/legal?slug=${slug}`),

  getMenu: () =>
    fetchApi<any[]>('/menu'),

  getProducts: () =>
    fetchApi<any[]>('/products'),

  getProduct: (slug: string) =>
    fetchApi<any | null>(`/products?slug=${slug}`),

  getCaseStudies: () =>
    fetchApi<any[]>('/case-studies'),

  getCaseStudy: (slug: string) =>
    fetchApi<any | null>(`/case-studies?slug=${slug}`),

  getJobPositions: () =>
    fetchApi<any[]>('/careers'),
};

// ─── FORM SUBMISSIONS ───

export const formApi = {
  submitContact: (data: {
    name: string; email: string; phone?: string; company?: string;
    service_interest?: string; message: string; website?: string;
  }) =>
    fetchApi<{ success: boolean }>('/contact', { method: 'POST', body: JSON.stringify(data) }),

  subscribe: (data: {
    email: string; first_name?: string; last_name?: string;
    company?: string; source?: string;
  }) =>
    fetchApi<{ success: boolean }>('/subscribe', { method: 'POST', body: JSON.stringify(data) }),

  trackPageView: (data: {
    page_path: string; page_title?: string; referrer?: string;
    user_agent?: string; screen_width?: number; session_id?: string;
  }) =>
    fetchApi<{ success: boolean }>('/analytics', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── ADMIN API (requires auth) ───

export const adminApi = {
  // Generic admin CRUD — goes through /api/admin/* routes
  fetch: async <T>(endpoint: string) =>
    fetchApi<T>(`/admin${endpoint}`, { headers: await getAuthHeaders() }),

  post: async <T>(endpoint: string, data: unknown) =>
    fetchApi<T>(`/admin${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: await getAuthHeaders(),
    }),

  put: async <T>(endpoint: string, data: unknown) =>
    fetchApi<T>(`/admin${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: await getAuthHeaders(),
    }),

  delete: async <T>(endpoint: string) =>
    fetchApi<T>(`/admin${endpoint}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    }),
};
