import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const COOKIE_CONSENT_KEY = 'adviserve_cookie_consent';

export function hasAnalyticsConsent(): boolean {
  return localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    // Non-blocking bottom-left toast so it doesn't cover hero CTAs or the
    // WhatsApp button (bottom-right). Stays within ~360px width on desktop
    // and pins to bottom on mobile.
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-40 animate-in slide-in-from-bottom">
      <div className="bg-white/95 backdrop-blur border border-[#d8d8d0] rounded-xl p-4 shadow-2xl">
        <p className="text-[12.5px] text-gray-700 leading-relaxed mb-3">
          Essential cookies only. Analytics cookies require consent.{' '}
          <Link to="/privacy" className="text-accent-blue hover:underline">Privacy</Link>
        </p>
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={decline}
            className="px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-gray-600 hover:text-gray-900 transition-all rounded-lg"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-[11px] font-mono uppercase tracking-wider bg-[#1e9df1] text-white hover:bg-[#1a82d4] transition-all rounded-lg font-medium"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
