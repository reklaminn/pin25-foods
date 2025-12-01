/*
  # Adres Yönetimi Tablosu
  
  1. Tables
    - addresses: Üye teslimat adresleri
    
  2. Security
    - RLS enabled
    - Members can only access their own addresses
    
  3. Features
    - Multiple addresses per member
    - Default address selection
    - Full address details
*/

-- Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  title text NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  district text NOT NULL,
  postal_code text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT phone_format CHECK (phone ~* '^[0-9]{10,11}$'),
  CONSTRAINT postal_code_format CHECK (postal_code IS NULL OR postal_code ~* '^[0-9]{5}$')
);

-- Enable Row Level Security
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Members can read own addresses"
  ON addresses
  FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Members can insert own addresses"
  ON addresses
  FOR INSERT
  TO authenticated
  WITH CHECK (member_id = auth.uid());

CREATE POLICY "Members can update own addresses"
  ON addresses
  FOR UPDATE
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Members can delete own addresses"
  ON addresses
  FOR DELETE
  TO authenticated
  USING (member_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_addresses_member_id ON addresses(member_id);
CREATE INDEX IF NOT EXISTS idx_addresses_is_default ON addresses(is_default);

-- Updated at trigger
CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure only one default address per member
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE addresses
    SET is_default = false
    WHERE member_id = NEW.member_id
      AND id != NEW.id
      AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for default address
CREATE TRIGGER ensure_single_default_address_trigger
  BEFORE INSERT OR UPDATE ON addresses
  FOR EACH ROW
  WHEN (NEW.is_default = true)
  EXECUTE FUNCTION ensure_single_default_address();
