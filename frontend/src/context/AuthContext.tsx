import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface CreatorProfile {
  id: string;
  user_id: string;
  niche: string;
  goal: string;
  target_audience: {
    age_range?: string;
    location?: string;
    interests?: string;
  };
  posting_style: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: CreatorProfile | null;
  loading: boolean;
  profileLoading: boolean;
  demoMode: boolean;
  sessionWarning: boolean;
  timeRemaining: number;
  signUp: (email: string, password: string) => Promise<{ needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  enterDemoMode: () => void;
  resetPassword: (email: string) => Promise<void>;
  extendSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'demo-user-id',
  email: 'creator@demo.com',
  user_metadata: { full_name: 'Demo Creator' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User;

const DEMO_PROFILE: CreatorProfile = {
  id: 'demo-profile-id',
  user_id: 'demo-user-id',
  niche: 'Fitness Coach',
  goal: 'followers',
  target_audience: { age_range: '25-34', location: 'USA', interests: 'health, wellness' },
  posting_style: 'reels',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const SESSION_TIMEOUT = 30 * 60 * 1000;
const SESSION_WARNING_TIME = 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  const profileRef = useRef<CreatorProfile | null>(null);
  const fetchingRef = useRef(false);

  const setProfileSafe = (data: CreatorProfile | null) => {
    profileRef.current = data;
    setProfile(data);
  };

  const fetchProfile = async (userId: string, isInitial = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setProfileLoading(true);
    try {
      const result = await Promise.race([
        supabase
          .from('creator_profiles')
          .select('*')
          .eq('user_id', userId)
          .single(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000)),
      ]);

      if (result === null) {
        console.warn('fetchProfile timed out');
        return;
      }

      const { data, error } = result;

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile row exists — user genuinely needs onboarding
          setProfileSafe(null);
          return;
        }
        console.error('Error fetching profile:', error);
        return;
      }

      setProfileSafe(data);
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      fetchingRef.current = false;
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
      setLoading(false);
      return;
    }

    let mounted = true;

    const maxTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timeout - forcing loading to stop');
        setLoading(false);
      }
    }, 10000);

    supabase.auth.getSession()
      .then(({ data: { session: s } }) => {
        if (!mounted) return;
        setSession(s);
        setUser(s?.user ?? null);

        if (s?.user) {
          fetchProfile(s.user.id, true)
            .finally(() => {
              clearTimeout(maxTimeout);
              if (mounted) setLoading(false);
            });
        } else {
          clearTimeout(maxTimeout);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Get session error:', err);
        clearTimeout(maxTimeout);
        if (mounted) setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (!mounted) return;
        console.log('Auth state changed:', event);

        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfileSafe(null);
          return;
        }

        setSession(s);
        setUser(s?.user ?? null);

        if (event === 'SIGNED_IN' && s?.user) {
          setLastActivity(Date.now());
          if (!profileRef.current) {
            await fetchProfile(s.user.id);
          }
        }
        // TOKEN_REFRESHED — don't re-fetch profile; it hasn't changed
      }
    );

    return () => {
      mounted = false;
      clearTimeout(maxTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const enterDemoMode = () => {
    setDemoMode(true);
    setUser(DEMO_USER);
    setProfileSafe(DEMO_PROFILE);
    setSession({} as Session);
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured. Add your keys to .env file.');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
    return { needsConfirmation: !data.user };
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured. Add your keys to .env file.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    if (data.session) {
      setLastActivity(Date.now());
      setSession(data.session);
      setUser(data.session.user);
      setLoading(false);

      if (data.session.user) {
        fetchProfile(data.session.user.id).catch((err) => {
          console.error('Profile fetch after login failed:', err);
        });
      }
    }
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured. Add your keys to .env file.');
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google OAuth error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured. Add your keys to .env file.');
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      if (error.message.includes('rate limit') || error.message.includes('too many')) {
        throw new Error('Email rate limit exceeded. Please wait 1 hour or reset password manually in Supabase dashboard.');
      }
      throw error;
    }
  };

  const signOut = async () => {
    if (demoMode) {
      setDemoMode(false);
      setUser(null);
      setProfileSafe(null);
      setSession(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfileSafe(null);
  };

  const refreshProfile = async () => {
    if (demoMode) return;
    if (user) {
      fetchingRef.current = false;
      await fetchProfile(user.id);
    }
  };

  const extendSession = () => {
    setLastActivity(Date.now());
    setSessionWarning(false);
    setTimeRemaining(0);
  };

  useEffect(() => {
    if (!user || demoMode) {
      setSessionWarning(false);
      setTimeRemaining(0);
      return;
    }

    const checkInactivity = async () => {
      const now = Date.now();
      const inactiveTime = now - lastActivity;
      const timeUntilTimeout = SESSION_TIMEOUT - inactiveTime;
      const timeUntilWarning = SESSION_TIMEOUT - SESSION_WARNING_TIME - inactiveTime;

      if (inactiveTime >= SESSION_TIMEOUT) {
        console.log('Session expired due to inactivity');
        await signOut();
        setSessionWarning(false);
        setTimeRemaining(0);
      } else if (timeUntilWarning <= 0) {
        setSessionWarning(true);
        setTimeRemaining(Math.ceil(timeUntilTimeout / 1000));
      } else {
        setSessionWarning(false);
        setTimeRemaining(0);
      }
    };

    const interval = setInterval(checkInactivity, 1000);
    checkInactivity();

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, demoMode, lastActivity]);

  useEffect(() => {
    if (!user || demoMode) return;

    const updateActivity = () => {
      setLastActivity(Date.now());
      if (sessionWarning) {
        setSessionWarning(false);
        setTimeRemaining(0);
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach((event) => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [user, demoMode, sessionWarning]);

  useEffect(() => {
    if (user && !demoMode) {
      setLastActivity(Date.now());
    }
  }, [user, demoMode]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        profileLoading,
        demoMode,
        sessionWarning,
        timeRemaining,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        refreshProfile,
        enterDemoMode,
        resetPassword,
        extendSession,
      }}
    >
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
