/*
  # Site Settings RLS Policy Fix
  
  1. Changes
    - Drop existing restrictive policies
    - Add admin-friendly policies for INSERT/UPDATE
    - Keep public read access
    
  2. Security
    - Admins can INSERT/UPDATE settings
    - Public can only read settings
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can insert site settings" ON site_settings;

-- Public can read all settings
CREATE POLICY "Public read access"
  ON site_settings
  FOR SELECT
  TO public
  USING (true);

-- Admins can insert new settings
CREATE POLICY "Admins can insert settings"
  ON site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE id = auth.uid() 
      AND is_active = true
    )
  );

-- Admins can update existing settings
CREATE POLICY "Admins can update settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE id = auth.uid() 
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE id = auth.uid() 
      AND is_active = true
    )
  );

-- Admins can delete settings (optional, for cleanup)
CREATE POLICY "Admins can delete settings"
  ON site_settings
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE id = auth.uid() 
      AND is_active = true
    )
  );
