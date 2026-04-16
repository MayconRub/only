import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

const supabaseClient = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Helper to handle refresh token errors
const handleAuthError = (error: any) => {
  if (error && (error.message?.includes('Refresh Token Not Found') || error.message?.includes('Invalid Refresh Token'))) {
    console.warn('Supabase: Invalid refresh token detected, clearing session...');
    supabaseClient.auth.signOut().catch(console.error);
    // Also clear local storage as a fallback
    localStorage.removeItem('supabase.auth.token');
    // Optional: reload or redirect
    // window.location.href = '/';
  }
};

// Wrap getUser
const originalGetUser = supabaseClient.auth.getUser.bind(supabaseClient.auth);
supabaseClient.auth.getUser = async (jwt?: string) => {
  const result = await originalGetUser(jwt);
  if (result.error) handleAuthError(result.error);
  return result;
};

// Wrap getSession
const originalGetSession = supabaseClient.auth.getSession.bind(supabaseClient.auth);
supabaseClient.auth.getSession = async () => {
  const result = await originalGetSession();
  if (result.error) handleAuthError(result.error);
  return result;
};

export const supabase = supabaseClient;
