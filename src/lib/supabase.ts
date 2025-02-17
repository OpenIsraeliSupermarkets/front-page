
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sjifhmsdzwktdglnpyba.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqaWZobXNkendrdGRnbG5weWJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MTM5NTEsImV4cCI6MjA1NTM4OTk1MX0.Za_Ts7zPQ2J20qFRg6GQqI3zniyaAfgCAWcvxz3uJAc';

export const supabase = createClient(supabaseUrl, supabaseKey);
