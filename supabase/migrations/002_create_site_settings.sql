/*
  # Site Ayarları Tablosu
  
  1. Tables
    - site_settings: Site geneli ayarlar (logo, iletişim bilgileri, vb.)
    
  2. Security
    - RLS enabled
    - Admins can read/update
    - Public can read
*/

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  description text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES admins(id),
  
  CONSTRAINT key_format CHECK (key ~* '^[a-z_]+$')
);

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings
CREATE POLICY "Anyone can read site settings"
  ON site_settings
  FOR SELECT
  TO public
  USING (true);

-- Admins can update settings
CREATE POLICY "Admins can update site settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Admins can insert settings
CREATE POLICY "Admins can insert site settings"
  ON site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

-- Trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO site_settings (key, value, description) VALUES
  ('logo_url', '', 'Site logo URL (Supabase Storage)'),
  ('site_title', 'P25 Foods & Cloud Kitchen - İyi yaşamın tadı', 'Site başlığı'),
  ('site_description', 'Günlük sağlıklı yemek aboneliği. Temiz içerikli, fonksiyonel menüler.', 'Site açıklaması'),
  ('contact_email', 'info@p25foods.com', 'İletişim e-postası'),
  ('contact_phone', '+90 (212) 123 45 67', 'İletişim telefonu'),
  ('delivery_time', '06:00 - 08:00', 'Varsayılan teslimat saati'),
  ('min_order_amount', '0', 'Minimum sipariş tutarı (TL)'),
  ('free_delivery', 'true', 'Ücretsiz teslimat aktif mi'),
  ('ga4_measurement_id', '', 'Google Analytics 4 Measurement ID'),
  ('meta_pixel_id', '', 'Meta Pixel ID')
ON CONFLICT (key) DO NOTHING;
