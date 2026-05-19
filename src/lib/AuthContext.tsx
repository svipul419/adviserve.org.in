import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function checkIsAdmin(session: Session | null): Promise<boolean> {
  if (!session?.access_token) return false;

  // Check app_metadata first (fast, no network)
  if (session.user?.app_metadata?.role === 'admin') return true;

  // Fall back to server-side check (reads ADMIN_EMAILS env var)
  try {
    const res = await fetch('/api/admin/check', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return data.isAdmin === true;
    }
  } catch { /* fall through */ }

  return false;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    // Single source of truth: apply the latest known session to state and
    // resolve `loading`. Called from both the initial getSession() and the
    // onAuthStateChange subscription so they cannot race against each other.
    const applySession = async (s: Session | null) => {
      if (!active) return;
      setSession(s);
      setUser(s?.user ?? null);
      const admin = await checkIsAdmin(s);
      if (!active) return;
      setIsAdmin(admin);
      setLoading(false);
    };

    supabase.auth.getSession()
      .then(({ data: { session } }) => applySession(session))
      .catch(() => { if (active) setLoading(false); });

    // Safety timeout: if auth check takes > 5s, stop loading
    const timeout = setTimeout(() => { if (active) setLoading(false); }, 5000);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  // signUp intentionally removed — admin accounts must be created
  // via Supabase dashboard or invite-only flow. Public registration is disabled.

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
