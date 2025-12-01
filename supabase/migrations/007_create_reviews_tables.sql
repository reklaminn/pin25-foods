/*
  # Sipariş Değerlendirme Tabloları
  
  1. Tables
    - order_reviews: Sipariş değerlendirmeleri
    - review_photos: Değerlendirme fotoğrafları
    - review_responses: Admin yanıtları
    
  2. Security
    - RLS enabled
    - Members can only manage their own reviews
    
  3. Features
    - Star ratings (1-5)
    - Multiple rating categories
    - Photo uploads
    - Admin responses
    - Helpful votes
    - Moderation system
*/

-- Review Status Enum
CREATE TYPE review_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'flagged'
);

-- Order Reviews Table
CREATE TABLE IF NOT EXISTS order_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  
  -- Overall Rating
  overall_rating integer NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  
  -- Category Ratings
  food_quality_rating integer CHECK (food_quality_rating >= 1 AND food_quality_rating <= 5),
  portion_size_rating integer CHECK (portion_size_rating >= 1 AND portion_size_rating <= 5),
  packaging_rating integer CHECK (packaging_rating >= 1 AND packaging_rating <= 5),
  delivery_rating integer CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  value_rating integer CHECK (value_rating >= 1 AND value_rating >= 1 AND value_rating <= 5),
  
  -- Review Content
  title text,
  comment text,
  
  -- Moderation
  status review_status DEFAULT 'pending',
  moderation_notes text,
  moderated_by uuid REFERENCES admins(id) ON DELETE SET NULL,
  moderated_at timestamptz,
  
  -- Engagement
  helpful_count integer DEFAULT 0,
  not_helpful_count integer DEFAULT 0,
  
  -- Metadata
  is_verified_purchase boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_title CHECK (title IS NULL OR length(title) >= 3),
  CONSTRAINT valid_comment CHECK (comment IS NULL OR length(comment) >= 10)
);

-- Review Photos Table
CREATE TABLE IF NOT EXISTS review_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL REFERENCES order_reviews(id) ON DELETE CASCADE,
  
  photo_url text NOT NULL,
  caption text,
  display_order integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_photo_url CHECK (length(photo_url) > 0)
);

-- Review Responses Table (Admin Replies)
CREATE TABLE IF NOT EXISTS review_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL REFERENCES order_reviews(id) ON DELETE CASCADE,
  
  admin_id uuid NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  response_text text NOT NULL,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_response CHECK (length(response_text) >= 10)
);

-- Review Helpful Votes Table
CREATE TABLE IF NOT EXISTS review_helpful_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL REFERENCES order_reviews(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  
  is_helpful boolean NOT NULL,
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(review_id, member_id)
);

-- Enable Row Level Security
ALTER TABLE order_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- Order Reviews Policies
CREATE POLICY "Members can read approved reviews"
  ON order_reviews
  FOR SELECT
  TO authenticated
  USING (status = 'approved' OR member_id = auth.uid());

CREATE POLICY "Members can create reviews for own orders"
  ON order_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    member_id = auth.uid() AND
    order_id IN (
      SELECT id FROM orders 
      WHERE member_id = auth.uid() 
      AND status = 'delivered'
      AND delivered_at IS NOT NULL
    )
  );

CREATE POLICY "Members can update own pending reviews"
  ON order_reviews
  FOR UPDATE
  TO authenticated
  USING (member_id = auth.uid() AND status = 'pending');

CREATE POLICY "Members can delete own pending reviews"
  ON order_reviews
  FOR DELETE
  TO authenticated
  USING (member_id = auth.uid() AND status = 'pending');

-- Review Photos Policies
CREATE POLICY "Anyone can read photos of approved reviews"
  ON review_photos
  FOR SELECT
  TO authenticated
  USING (
    review_id IN (
      SELECT id FROM order_reviews 
      WHERE status = 'approved' OR member_id = auth.uid()
    )
  );

CREATE POLICY "Members can insert photos for own reviews"
  ON review_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    review_id IN (
      SELECT id FROM order_reviews WHERE member_id = auth.uid()
    )
  );

CREATE POLICY "Members can delete photos from own reviews"
  ON review_photos
  FOR DELETE
  TO authenticated
  USING (
    review_id IN (
      SELECT id FROM order_reviews WHERE member_id = auth.uid()
    )
  );

-- Review Responses Policies
CREATE POLICY "Anyone can read responses to approved reviews"
  ON review_responses
  FOR SELECT
  TO authenticated
  USING (
    review_id IN (
      SELECT id FROM order_reviews 
      WHERE status = 'approved' OR member_id = auth.uid()
    )
  );

-- Review Helpful Votes Policies
CREATE POLICY "Members can read all helpful votes"
  ON review_helpful_votes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Members can vote on approved reviews"
  ON review_helpful_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    member_id = auth.uid() AND
    review_id IN (
      SELECT id FROM order_reviews WHERE status = 'approved'
    )
  );

CREATE POLICY "Members can update own votes"
  ON review_helpful_votes
  FOR UPDATE
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Members can delete own votes"
  ON review_helpful_votes
  FOR DELETE
  TO authenticated
  USING (member_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_reviews_order_id ON order_reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_order_reviews_member_id ON order_reviews(member_id);
CREATE INDEX IF NOT EXISTS idx_order_reviews_status ON order_reviews(status);
CREATE INDEX IF NOT EXISTS idx_order_reviews_overall_rating ON order_reviews(overall_rating);
CREATE INDEX IF NOT EXISTS idx_order_reviews_created_at ON order_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_photos_review_id ON review_photos(review_id);
CREATE INDEX IF NOT EXISTS idx_review_responses_review_id ON review_responses(review_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_review_id ON review_helpful_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_member_id ON review_helpful_votes(member_id);

-- Updated at triggers
CREATE TRIGGER update_order_reviews_updated_at
  BEFORE UPDATE ON order_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_responses_updated_at
  BEFORE UPDATE ON review_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update helpful counts
CREATE OR REPLACE FUNCTION update_review_helpful_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.is_helpful THEN
      UPDATE order_reviews 
      SET helpful_count = helpful_count + 1 
      WHERE id = NEW.review_id;
    ELSE
      UPDATE order_reviews 
      SET not_helpful_count = not_helpful_count + 1 
      WHERE id = NEW.review_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.is_helpful != NEW.is_helpful THEN
      IF NEW.is_helpful THEN
        UPDATE order_reviews 
        SET helpful_count = helpful_count + 1,
            not_helpful_count = not_helpful_count - 1
        WHERE id = NEW.review_id;
      ELSE
        UPDATE order_reviews 
        SET helpful_count = helpful_count - 1,
            not_helpful_count = not_helpful_count + 1
        WHERE id = NEW.review_id;
      END IF;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.is_helpful THEN
      UPDATE order_reviews 
      SET helpful_count = helpful_count - 1 
      WHERE id = OLD.review_id;
    ELSE
      UPDATE order_reviews 
      SET not_helpful_count = not_helpful_count - 1 
      WHERE id = OLD.review_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for helpful counts
CREATE TRIGGER update_helpful_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON review_helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_counts();

-- Function to prevent duplicate reviews
CREATE OR REPLACE FUNCTION check_duplicate_review()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM order_reviews 
    WHERE order_id = NEW.order_id 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
  ) THEN
    RAISE EXCEPTION 'Bu sipariş için zaten bir değerlendirme yapılmış';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for duplicate check
CREATE TRIGGER check_duplicate_review_trigger
  BEFORE INSERT OR UPDATE ON order_reviews
  FOR EACH ROW
  EXECUTE FUNCTION check_duplicate_review();

-- Function to create notification on review response
CREATE OR REPLACE FUNCTION create_review_response_notification()
RETURNS TRIGGER AS $$
DECLARE
  review_data RECORD;
BEGIN
  -- Get review data
  SELECT r.*, o.order_number 
  INTO review_data 
  FROM order_reviews r
  JOIN orders o ON o.id = r.order_id
  WHERE r.id = NEW.review_id;
  
  -- Create notification
  INSERT INTO notifications (
    member_id,
    type,
    priority,
    title,
    message,
    data,
    action_url
  ) VALUES (
    review_data.member_id,
    'system',
    'medium',
    'Değerlendirmenize Yanıt Verildi! 💬',
    'Sipariş numarası: ' || review_data.order_number || ' için yaptığınız değerlendirmeye yanıt verildi.',
    jsonb_build_object(
      'review_id', NEW.review_id,
      'order_id', review_data.order_id,
      'order_number', review_data.order_number
    ),
    '/hesabim/siparislerim'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for review response notification
CREATE TRIGGER review_response_notification_trigger
  AFTER INSERT ON review_responses
  FOR EACH ROW
  EXECUTE FUNCTION create_review_response_notification();

-- Add comments
COMMENT ON TABLE order_reviews IS 'Customer reviews and ratings for delivered orders';
COMMENT ON TABLE review_photos IS 'Photos attached to reviews';
COMMENT ON TABLE review_responses IS 'Admin responses to customer reviews';
COMMENT ON TABLE review_helpful_votes IS 'Helpful/not helpful votes on reviews';
COMMENT ON FUNCTION update_review_helpful_counts() IS 'Updates helpful and not_helpful counts on reviews';
COMMENT ON FUNCTION check_duplicate_review() IS 'Prevents duplicate reviews for the same order';
COMMENT ON FUNCTION create_review_response_notification() IS 'Creates notification when admin responds to review';
