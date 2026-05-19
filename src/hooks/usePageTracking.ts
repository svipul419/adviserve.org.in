import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { formApi } from '../lib/api';
import { hasAnalyticsConsent } from '../components/CookieConsent';

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('analytics_session', sessionId);
  }
  return sessionId;
}

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    if (!hasAnalyticsConsent()) return;
    // Vite dev server has no /api/* routes — skip the POST to stop 404
    // spam in the browser console during local development.
    if (import.meta.env.DEV) return;

    formApi.trackPageView({
      page_path: location.pathname,
      page_title: document.title,
      referrer: document.referrer || undefined,
      user_agent: navigator.userAgent,
      screen_width: window.innerWidth,
      session_id: getSessionId(),
    }).catch(() => { /* silently fail */ });
  }, [location.pathname]);
}
