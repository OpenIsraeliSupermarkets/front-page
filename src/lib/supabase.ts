
import { createClient } from '@supabase/supabase-js';

console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are not set. Make sure you have connected your Supabase project in the Lovable interface.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
