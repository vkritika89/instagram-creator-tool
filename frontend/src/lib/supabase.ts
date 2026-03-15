import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co').trim().replace(/\/$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key').trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Consider configured if we have real values (not placeholders). Trim so trailing CRLF/spaces don't break the check.
export const isSupabaseConfigured =
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseAnonKey !== 'placeholder-key' &&
  supabaseUrl.length > 0 &&
  supabaseAnonKey.length > 10;
