// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sjifhmsdzwktdglnpyba.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqaWZobXNkendrdGRnbG5weWJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MTM5NTEsImV4cCI6MjA1NTM4OTk1MX0.Za_Ts7zPQ2J20qFRg6GQqI3zniyaAfgCAWcvxz3uJAc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);