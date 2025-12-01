/*
  # Create Admins Table and Security Policies
  
  1. New Tables
    - `admins`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `role` (text)
      - `is_active` (boolean)
      - `last_login` (timestamp)
  
  2. Security
    - Enable RLS on `admins` table
    - Add policy for admins to view their own data
    - Add policy for admins to update their own data (last_login)
*/

CREATE TABLE IF NOT EXISTS public.admins (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text NOT NULL,
  full_name text,
  role text DEFAULT 'admin',
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Allow users to read their own admin record
CREATE POLICY "Admins can view own data" 
ON public.admins 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- 2. Allow users to update their own record (e.g. last_login)
CREATE POLICY "Admins can update own data" 
ON public.admins 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);
