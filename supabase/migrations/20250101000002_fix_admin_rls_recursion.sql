/*
  # Fix Infinite Recursion in Admins Table
  
  CRITICAL FIX:
  The previous policies likely contained a subquery to `admins` (e.g., checking if the user is an admin to view other admins), 
  which causes an infinite loop when the table is queried.

  1. Changes
    - Drop ALL existing policies on `admins` table to ensure a clean slate.
    - Create a single, strictly non-recursive policy: `auth.uid() = id`.
    
  2. Why this works
    - The login page only performs: `.select('*').eq('id', authData.session.user.id).single()`
    - The new policy `auth.uid() = id` allows exactly this query without needing to check any other rows.
*/

-- 1. Drop all potential existing policies to clear the recursion
DROP POLICY IF EXISTS "Admins can view own data" ON public.admins;
DROP POLICY IF EXISTS "Admins can update own data" ON public.admins;
DROP POLICY IF EXISTS "Admins can view all data" ON public.admins;
DROP POLICY IF EXISTS "Allow read access for admins" ON public.admins;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.admins;

-- 2. Create the safe, non-recursive SELECT policy
-- This allows a user to see ONLY their own row.
CREATE POLICY "Admins can view own data" 
ON public.admins 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- 3. Create the safe, non-recursive UPDATE policy
-- Allows updating only their own row (e.g. for last_login)
CREATE POLICY "Admins can update own data" 
ON public.admins 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);
