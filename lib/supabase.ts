import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Member {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  is_active: boolean;
  email_verified: boolean;
}

export interface Admin {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin' | 'manager';
  created_at: string;
  updated_at: string;
  last_login: string | null;
  is_active: boolean;
}
