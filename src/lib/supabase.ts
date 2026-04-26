import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase URL or Anon Key. Please check your environment variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service Role Client (Server-side only)
export const supabaseAdmin = () => {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin should only be used on the server');
  }
  
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  
  return createClient(supabaseUrl, serviceRoleKey);
};
