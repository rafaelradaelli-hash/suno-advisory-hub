import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = "https://zjowgamtmfqzievqnrhg.supabase.co";
export const SUPABASE_KEY = "sb_publishable_L9M6LKA_YuyygIPs_t1oMA_Z-pF2kGz";

// Singleton Supabase client — manages session in localStorage, refreshes token automatically.
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "suno-advisory-hub-auth"
  }
});

/**
 * Returns the current session's access token (JWT) to use as Bearer token in REST calls.
 * Falls back to the anon/publishable key if there's no session (pre-login state).
 */
export async function getAuthToken() {
  try {
    const { data } = await supabase.auth.getSession();
    if (data && data.session && data.session.access_token) return data.session.access_token;
  } catch (e) { /* fall through */ }
  return SUPABASE_KEY;
}

/** Returns the current user's UUID or null if not logged in. */
export async function getUserId() {
  try {
    const { data } = await supabase.auth.getSession();
    if (data && data.session && data.session.user) return data.session.user.id;
  } catch (e) { /* fall through */ }
  return null;
}
