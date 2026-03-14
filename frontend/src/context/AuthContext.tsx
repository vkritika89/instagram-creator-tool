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
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  enterDemoMode: () => void;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
      setProfile(data || null);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // No Supabase configured — just stop loading so the login page shows
      console.warn('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          await fetchProfile(s.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const enterDemoMode = () => {
    setDemoMode(true);
    setUser(DEMO_USER);
    setProfile(DEMO_PROFILE);
    setSession({} as Session);
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured. Add your keys to .env file.');
    }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured. Add your keys to .env file.');
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured. Add your keys to .env file.');
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
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

  return (
    <AuthContext.Provider
      value={{ user, session, profile, loading, demoMode, signUp, signIn, signInWithGoogle, signOut, refreshProfile, enterDemoMode }}
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
