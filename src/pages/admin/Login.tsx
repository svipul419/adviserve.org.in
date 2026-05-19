import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await signIn(email, password);
    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      navigate('/admin');
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Enter your email address'); return; }
    setError('');
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/login`,
    });
    setLoading(false);

    if (resetError) {
      setError(resetError.message);
    } else {
      setResetSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f2333] flex flex-col justify-center py-12 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-oxblood-primary/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-oxblood-primary/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-[420px]">
        {/* Logo */}
        <Link to="/" className="flex justify-center mb-10">
          <span className="font-display text-[32px] tracking-[0.12em] text-[#e8d5c4]">
            ADVISERVE<span className="text-oxblood-primary text-[16px] align-super ml-0.5">&reg;</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-[#132a3d] border border-[#e8d5c4]/[0.08] p-8 sm:p-10">
          <div className="text-center mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-oxblood-primary mb-3">// Admin Panel</p>
            <h2 className="font-display text-[28px] uppercase tracking-[0.04em] text-[#e8d5c4]">
              Sign In
            </h2>
          </div>

          {resetMode ? (
            resetSent ? (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-oxblood-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-oxblood-primary text-xl">✓</span>
                </div>
                <p className="text-[#e8d5c4] text-[15px]">Password reset email sent!</p>
                <p className="text-[#e8d5c4]/55 text-[13px]">Check your inbox for a reset link.</p>
                <button onClick={() => { setResetMode(false); setResetSent(false); }} className="font-mono text-[10px] uppercase tracking-[0.14em] text-oxblood-primary hover:text-oxblood-hover/80 transition-colors mt-4">
                  &larr; Back to Sign In
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleResetPassword}>
                <div>
                  <label htmlFor="reset-email" className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#e8d5c4]/55 mb-2 block">
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@adviserve.org.in"
                    className="w-full px-4 py-3.5 bg-[#0f2333] border border-[#e8d5c4]/[0.08] text-[#e8d5c4] text-[14px] placeholder:text-[#e8d5c4]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#132a3d] transition-colors"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-[13px]" role="alert">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-mono text-[10px] uppercase tracking-[0.16em] bg-[#e8d5c4] text-[#0f2333] py-4 min-h-[44px] hover:bg-oxblood-hover hover:text-[#e8d5c4] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <button type="button" onClick={() => { setResetMode(false); setError(''); }} className="w-full font-mono text-[10px] uppercase tracking-[0.14em] text-[#e8d5c4]/55 hover:text-oxblood-hover transition-colors py-2">
                  &larr; Back to Sign In
                </button>
              </form>
            )
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#e8d5c4]/55 mb-2 block">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@adviserve.org.in"
                  className="w-full px-4 py-3.5 bg-[#0f2333] border border-[#e8d5c4]/[0.08] text-[#e8d5c4] text-[14px] placeholder:text-[#e8d5c4]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#132a3d] transition-colors"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#e8d5c4]/55">
                    Password
                  </label>
                  <button type="button" onClick={() => { setResetMode(true); setError(''); }} className="font-mono text-[9px] uppercase tracking-[0.14em] text-oxblood-primary/70 hover:text-oxblood-hover transition-colors">
                    Forgot password?
                  </button>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3.5 bg-[#0f2333] border border-[#e8d5c4]/[0.08] text-[#e8d5c4] text-[14px] placeholder:text-[#e8d5c4]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#132a3d] transition-colors"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-[13px]" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full font-mono text-[10px] uppercase tracking-[0.16em] bg-[#e8d5c4] text-[#0f2333] py-4 min-h-[44px] hover:bg-oxblood-hover hover:text-[#e8d5c4] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <Link to="/" className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#e8d5c4]/55 hover:text-oxblood-hover transition-colors">
            &larr; Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
