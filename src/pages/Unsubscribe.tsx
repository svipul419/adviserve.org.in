import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MailX, CheckCircle, AlertCircle } from 'lucide-react';
import { FadeUp } from '../components/animations';
import SEOHead from '../components/SEOHead';

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [inputEmail, setInputEmail] = useState(email);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'not_found'>('idle');

  // Note: previous implementation auto-unsubscribed any address present in the
  // URL on mount. That let third parties unsubscribe arbitrary users by
  // sharing a crafted link, so we require an explicit click on the button now.

  const handleUnsubscribe = async (emailToUnsub: string) => {
    if (!emailToUnsub.trim()) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUnsub.trim().toLowerCase() }),
      });
      const result = await res.json();

      if (!res.ok) {
        if (res.status === 404 || result.error === 'not_found') {
          setStatus('not_found');
        } else {
          setStatus('error');
        }
      } else {
        setStatus('success');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUnsubscribe(inputEmail);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <SEOHead title="Unsubscribe" robots="noindex, nofollow" />
      <FadeUp className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          {status === 'success' ? (
            <>
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">You've been unsubscribed</h1>
              <p className="text-gray-500 mb-6">
                You will no longer receive marketing emails from us. If this was a mistake, you can re-subscribe by contacting us.
              </p>
              <Link to="/" className="text-accent-blue hover:text-accent-blue font-semibold text-sm transition-colors">
                Return to homepage
              </Link>
            </>
          ) : status === 'not_found' ? (
            <>
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <AlertCircle className="w-8 h-8 text-amber-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Email not found</h1>
              <p className="text-gray-500 mb-6">
                We couldn't find this email in our subscriber list. You may have already unsubscribed.
              </p>
              <Link to="/" className="text-accent-blue hover:text-accent-blue font-semibold text-sm transition-colors">
                Return to homepage
              </Link>
            </>
          ) : status === 'error' ? (
            <>
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h1>
              <p className="text-gray-500 mb-6">
                We couldn't process your request. Please try again or contact us directly.
              </p>
              <button onClick={() => setStatus('idle')} className="text-accent-blue hover:text-accent-blue font-semibold text-sm transition-colors">
                Try again
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <MailX className="w-8 h-8 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Unsubscribe</h1>
              <p className="text-gray-500 mb-6">
                Enter your email address to unsubscribe from our mailing list.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue outline-none text-gray-900 bg-white"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? 'Processing...' : 'Unsubscribe'}
                </button>
              </form>
            </>
          )}
        </div>
      </FadeUp>
    </div>
  );
}
