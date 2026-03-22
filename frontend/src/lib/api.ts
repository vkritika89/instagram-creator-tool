import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || '';

const TIMEOUT_MS = {
  default: 15_000,
  ai: 60_000,
};

const AI_ENDPOINTS = ['/api/reel-script/', '/api/weekly-plan/', '/api/captions/', '/api/video/'];

function getTimeoutForEndpoint(endpoint: string): number {
  if (AI_ENDPOINTS.some(prefix => endpoint.startsWith(prefix))) {
    return TIMEOUT_MS.ai;
  }
  return TIMEOUT_MS.default;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiGet<T = unknown>(endpoint: string): Promise<T> {
  const headers = await getAuthHeaders();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), getTimeoutForEndpoint(endpoint));

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. The server may be busy — please try again.');
    }
    throw err;
  }
}

export async function apiPost<T = unknown>(endpoint: string, body: unknown): Promise<T> {
  const headers = await getAuthHeaders();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), getTimeoutForEndpoint(endpoint));

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. The server may be busy — please try again.');
    }
    throw err;
  }
}

export async function apiPut<T = unknown>(endpoint: string, body: unknown): Promise<T> {
  const headers = await getAuthHeaders();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), getTimeoutForEndpoint(endpoint));

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. The server may be busy — please try again.');
    }
    throw err;
  }
}

export async function apiDelete<T = unknown>(endpoint: string): Promise<T> {
  const headers = await getAuthHeaders();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), getTimeoutForEndpoint(endpoint));

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. The server may be busy — please try again.');
    }
    throw err;
  }
}

