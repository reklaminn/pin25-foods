/*
  # Authentication System - Üye ve Admin Kullanıcıları
  
  1. Tables
    - members: Üye kullanıcıları (müşteriler)
    - admins: Admin kullanıcıları (yöneticiler)
    
  2. Security
    - RLS enabled on both tables
    - Separate authentication flows
    - Password hashing with bcrypt
    - Role-based access control
*/

-- Members Table (Üye Kullanıcıları)
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz,
  is_active boolean DEFAULT true,
  email_verified boolean DEFAULT false,
  
  -- Constraints
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT phone_format CHECK (phone IS NULL OR phone ~* '^[0-9]{10,11}$')
);

-- Admins Table (Admin Kullanıcıları)
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz,
  is_active boolean DEFAULT true,
  
  -- Constraints
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT role_check CHECK (role IN ('admin', 'super_admin', 'manager'))
);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Members Policies
CREATE POLICY "Members can read own data"
  ON members
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Members can update own data"
  ON members
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Admins Policies
CREATE POLICY "Admins can read all data"
  ON admins
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_created_at ON members(created_at);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin (password: admin123)
-- Note: In production, change this password immediately!
INSERT INTO admins (email, password_hash, full_name, role)
VALUES (
  'admin@mealora.com',
  '$2a$10$rKvVPZqGhf5vVZJ5kZJ5kO5vVZJ5kZJ5kZJ5kZJ5kZJ5kZJ5kZJ5k',
  'Admin User',
  'super_admin'
) ON CONFLICT (email) DO NOTHING;
