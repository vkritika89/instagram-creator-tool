import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || '';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Use before protected API calls. Throws if user has no session (so backend won't get "Missing or invalid authorization header"). */
export async function ensureSession(): Promise<void> {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.access_token) {
    throw new Error('Please log in to continue.');
  }
}

function isAuthError(errBody: { error?: string }): boolean {
  const msg = (errBody?.error || '').toLowerCase();
  return (
    msg.includes('authorization') ||
    msg.includes('invalid or expired token') ||
    msg.includes('unauthorized')
  );
}

export async function apiGet<T = unknown>(endpoint: string): Promise<T> {
  const headers = await getAuthHeaders();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers,
      credentials: 'include',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      const errBody = err as { error?: string };
      if (res.status === 401 && isAuthError(errBody)) {
        throw new Error('Please log in again to continue.');
      }
      throw new Error(errBody.error || 'Request failed');
    }
    return res.json();
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timeout - backend may not be running');
    }
    throw err;
  }
}

export async function apiPost<T = unknown>(endpoint: string, body: unknown): Promise<T> {
  const headers = await getAuthHeaders();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      const errBody = err as { error?: string };
      if (res.status === 401 && isAuthError(errBody)) {
        throw new Error('Please log in again to continue.');
      }
      throw new Error(errBody.error || 'Request failed');
    }
    return res.json();
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timeout - backend may not be running. Please start the backend server.');
    }
    throw err;
  }
}

export async function apiDelete<T = unknown>(endpoint: string): Promise<T> {
  const headers = await getAuthHeaders();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      const errBody = err as { error?: string };
      if (res.status === 401 && isAuthError(errBody)) {
        throw new Error('Please log in again to continue.');
      }
      throw new Error(errBody.error || 'Request failed');
    }
    return res.json();
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timeout - backend may not be running');
    }
    throw err;
  }
}

/** Fetch binary video content with auth and return a blob URL for playback. */
export async function apiGetVideoBlobUrl(endpoint: string): Promise<string> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}${endpoint}`, { headers, credentials: 'include' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    const errBody = err as { error?: string };
    if (res.status === 401 && isAuthError(errBody)) {
      throw new Error('Please log in again to continue.');
    }
    throw new Error(errBody.error || 'Failed to load video');
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
