/*
  # Fix Site Settings Public Access
  1. Security: Ensure site_settings table is readable by everyone (public) so the logo can be fetched without login.
*/

DO $$ 
BEGIN
  -- Create site_settings table if it doesn't exist (safety check)
  CREATE TABLE IF NOT EXISTS site_settings (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    logo_url text,
    site_title text,
    site_description text,
    contact_email text,
    contact_phone text,
    delivery_time text,
    min_order_amount text,
    free_delivery text,
    ga4_measurement_id text,
    meta_pixel_id text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- Enable RLS
  ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

  -- Drop existing policy if it exists to avoid conflicts
  DROP POLICY IF EXISTS "Public settings are viewable by everyone" ON site_settings;
  
  -- Create public read policy
  CREATE POLICY "Public settings are viewable by everyone" 
    ON site_settings FOR SELECT 
    TO public 
    USING (true);

  -- Ensure at least one row exists
  IF NOT EXISTS (SELECT 1 FROM site_settings) THEN
    INSERT INTO site_settings (logo_url, site_title) VALUES ('/logo.svg', 'P25 Foods');
  END IF;
END $$;
