/*
  # Favori Yemekler Tablosu
  
  1. Tables
    - favorite_meals: Kullanıcıların favori yemekleri
    
  2. Security
    - RLS enabled
    - Members can only manage their own favorites
    
  3. Features
    - Add/remove favorites
    - Favorite count tracking
    - Meal metadata storage
*/

-- Favorite Meals Table
CREATE TABLE IF NOT EXISTS favorite_meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  
  -- Meal Information
  meal_id text NOT NULL,
  meal_name text NOT NULL,
  meal_description text,
  meal_image text,
  meal_category text NOT NULL,
  
  -- Nutritional Info
  kcal integer,
  protein integer,
  carbs integer,
  fat integer,
  fiber integer,
  
  -- Metadata
  notes text,
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(member_id, meal_id)
);

-- Enable Row Level Security
ALTER TABLE favorite_meals ENABLE ROW LEVEL SECURITY;

-- Favorite Meals Policies
CREATE POLICY "Members can read own favorites"
  ON favorite_meals
  FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Members can insert own favorites"
  ON favorite_meals
  FOR INSERT
  TO authenticated
  WITH CHECK (member_id = auth.uid());

CREATE POLICY "Members can delete own favorites"
  ON favorite_meals
  FOR DELETE
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Members can update own favorites"
  ON favorite_meals
  FOR UPDATE
  TO authenticated
  USING (member_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_favorite_meals_member_id ON favorite_meals(member_id);
CREATE INDEX IF NOT EXISTS idx_favorite_meals_meal_id ON favorite_meals(meal_id);
CREATE INDEX IF NOT EXISTS idx_favorite_meals_category ON favorite_meals(meal_category);
CREATE INDEX IF NOT EXISTS idx_favorite_meals_created_at ON favorite_meals(created_at DESC);

-- Function to get favorite count for member
CREATE OR REPLACE FUNCTION get_member_favorite_count(p_member_id uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM favorite_meals
    WHERE member_id = p_member_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if meal is favorited
CREATE OR REPLACE FUNCTION is_meal_favorited(p_member_id uuid, p_meal_id text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM favorite_meals
    WHERE member_id = p_member_id
    AND meal_id = p_meal_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments
COMMENT ON TABLE favorite_meals IS 'User favorite meals for quick access and recommendations';
COMMENT ON FUNCTION get_member_favorite_count IS 'Returns total favorite count for a member';
COMMENT ON FUNCTION is_meal_favorited IS 'Checks if a meal is in member favorites';
