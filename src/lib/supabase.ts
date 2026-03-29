import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client singleton.
 *
 * Uses NEXT_PUBLIC_ prefixed env vars so the client can be used
 * in both server components and client components.
 *
 * For server-only operations (like the API route logging),
 * this same client works since we're using the anon key with RLS.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
    'Add it to .env.local — see .env.local.example for reference.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
    'Add it to .env.local — see .env.local.example for reference.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
