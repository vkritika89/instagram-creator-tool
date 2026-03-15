import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
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

// Mock data for demo mode
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

// Session timeout configuration (in milliseconds)
// TESTING: Set to 1 minute for easy testing (change back to 30 minutes for production)
const SESSION_TIMEOUT = 1 * 60 * 1000; // 1 minute (for testing)
const SESSION_WARNING_TIME = 30 * 1000; // Show warning 30 seconds before timeout

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      // PGRST116 = no rows returned (user has no profile yet - this is OK for new users)
      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found - user is new, needs onboarding
          setProfile(null);
          return;
        }
        console.error('Error fetching profile:', error);
        setProfile(null);
        return;
      }
      
      // Profile found - existing user
      setProfile(data);
    } catch (err) {
      console.error('Fetch profile error:', err);
      setProfile(null);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn(
        'Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env then restart the dev server (npm run dev).'
      );
      setLoading(false);
      return;
    }

    let mounted = true;
    
    // Maximum timeout - always stop loading after 10 seconds no matter what
    const maxTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timeout - forcing loading to stop');
        setLoading(false);
      }
    }, 10000);

    // Check for OAuth callback with timeout
    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 5000));

    Promise.race([sessionPromise, timeoutPromise])
      .then((result) => {
        if (!mounted) return;
        
        if (result === null) {
          // Timeout - stop loading anyway
          console.warn('Session check timed out');
          clearTimeout(maxTimeout);
          setLoading(false);
          return;
        }

        const { data: { session: s } } = result as { data: { session: any } };
        setSession(s);
        setUser(s?.user ?? null);
        
        if (s?.user) {
          // Fetch profile with timeout protection
          const profileTimeout = setTimeout(() => {
            if (mounted) {
              console.warn('Profile fetch timed out');
              setProfile(null);
              clearTimeout(maxTimeout);
              setLoading(false);
            }
          }, 5000);

          fetchProfile(s.user.id)
            .catch((err) => {
              console.error('Profile fetch error:', err);
              setProfile(null);
            })
            .finally(() => {
              clearTimeout(profileTimeout);
              clearTimeout(maxTimeout);
              if (mounted) {
                setLoading(false);
              }
            });
        } else {
          clearTimeout(maxTimeout);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Get session error:', err);
        clearTimeout(maxTimeout);
        if (mounted) {
          setLoading(false);
        }
      });

    // Handle OAuth callbacks and auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (!mounted) return;
        console.log('Auth state changed:', event);
        
        // Handle OAuth callback
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(s);
          setUser(s?.user ?? null);
          if (s?.user) {
            // Reset activity timer on login
            setLastActivity(Date.now());
            await fetchProfile(s.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
        } else {
          setSession(s);
          setUser(s?.user ?? null);
          if (s?.user) {
            await fetchProfile(s.user.id);
          } else {
            setProfile(null);
          }
        }
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
    setProfile(DEMO_PROFILE);
    setSession({} as Session);
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error(
        'Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env and restart the dev server.'
      );
    }
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
    
    // Check if email confirmation is required
    // If user is null but no error, it means confirmation email was sent
    return { needsConfirmation: !data.user };
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error(
        'Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env and restart the dev server.'
      );
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    // Update state immediately after successful login
    if (data.session) {
      setSession(data.session);
      setUser(data.session.user);
      setLastActivity(Date.now());
      
      // Fetch profile
      if (data.session.user) {
        await fetchProfile(data.session.user.id);
      }
    }
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      throw new Error(
        'Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env and restart the dev server.'
      );
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
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
    
    // OAuth redirect will happen automatically
    // The onAuthStateChange handler will catch the callback
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured. Add your keys to .env file.');
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      // Provide helpful error messages
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
      setProfile(null);
      setSession(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (demoMode) return;
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const extendSession = () => {
    setLastActivity(Date.now());
    setSessionWarning(false);
    setTimeRemaining(0);
  };

  // Session timeout effect - tracks inactivity and shows warning/logout
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
        // Session expired - logout
        console.log('Session expired due to inactivity');
        await signOut();
        setSessionWarning(false);
        setTimeRemaining(0);
      } else if (timeUntilWarning <= 0) {
        // Show warning
        setSessionWarning(true);
        setTimeRemaining(Math.ceil(timeUntilTimeout / 1000)); // seconds remaining
      } else {
        setSessionWarning(false);
        setTimeRemaining(0);
      }
    };

    // Check every second
    const interval = setInterval(checkInactivity, 1000);
    checkInactivity(); // Initial check

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, demoMode, lastActivity]);

  // Track user activity (mouse, keyboard, clicks, scroll)
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

  // Reset activity timer when user logs in
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
