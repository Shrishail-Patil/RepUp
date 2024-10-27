// path/to/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project URL and public API key
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Replace with your Supabase public API key

// Create a Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

