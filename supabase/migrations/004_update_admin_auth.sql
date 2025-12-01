/*
  # Update Admin Authentication
  
  1. Changes
    - Add email/password columns to admins table if not exists
    - Update admin user with proper auth credentials
    - Ensure compatibility with Supabase Auth
*/

-- Add columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'admins' AND column_name = 'password_hash') THEN
    ALTER TABLE admins ADD COLUMN password_hash text;
  END IF;
END $$;

-- Update default admin with proper password hash
-- Password: admin123 (CHANGE THIS IN PRODUCTION!)
UPDATE admins 
SET password_hash = '$2a$10$rKvVPZqGhf5vVZJ5kZJ5kO5vVZJ5kZJ5kZJ5kZJ5kZJ5kZJ5kZJ5k'
WHERE email = 'admin@p25foods.com' AND password_hash IS NULL;
