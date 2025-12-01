/*
  # Teslimat Takibi Tabloları
  
  1. Tables
    - couriers: Kuryeler
    - delivery_tracking: Teslimat takibi
    
  2. Security
    - RLS enabled
    - Members can only track their own deliveries
    
  3. Features
    - Real-time location tracking
    - Courier information
    - Delivery status tracking
    - Route polyline
    - ETA calculation
*/

-- Delivery Status Enum
CREATE TYPE delivery_status AS ENUM (
  'assigned',
  'picked_up',
  'in_transit',
  'nearby',
  'arrived',
  'delivered'
);

-- Couriers Table
CREATE TABLE IF NOT EXISTS couriers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  
  vehicle_type text NOT NULL,
  vehicle_plate text NOT NULL,
  
  photo_url text,
  rating decimal(3,2) DEFAULT 5.00,
  total_deliveries integer DEFAULT 0,
  
  is_active boolean DEFAULT true,
  is_available boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_name CHECK (length(name) > 0),
  CONSTRAINT valid_phone CHECK (length(phone) >= 10),
  CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5)
);

-- Delivery Tracking Table
CREATE TABLE IF NOT EXISTS delivery_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
  courier_id uuid REFERENCES couriers(id) ON DELETE SET NULL,
  
  status delivery_status DEFAULT 'assigned',
  
  -- Location data (stored as JSONB for flexibility)
  current_location jsonb,
  pickup_location jsonb NOT NULL,
  delivery_location jsonb NOT NULL,
  
  -- Route and ETA
  estimated_arrival timestamptz,
  distance_remaining decimal(10,2),
  route_polyline text,
  
  -- Timestamps
  started_at timestamptz,
  picked_up_at timestamptz,
  delivered_at timestamptz,
  
  -- Delivery proof
  delivery_photo_url text,
  delivery_notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_locations CHECK (
    pickup_location ? 'latitude' AND 
    pickup_location ? 'longitude' AND
    delivery_location ? 'latitude' AND 
    delivery_location ? 'longitude'
  )
);

-- Enable Row Level Security
ALTER TABLE couriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;

-- Couriers Policies (read-only for members)
CREATE POLICY "Members can read active couriers"
  ON couriers
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Delivery Tracking Policies
CREATE POLICY "Members can read own delivery tracking"
  ON delivery_tracking
  FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders WHERE member_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_couriers_is_active ON couriers(is_active);
CREATE INDEX IF NOT EXISTS idx_couriers_is_available ON couriers(is_available);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_order_id ON delivery_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_courier_id ON delivery_tracking(courier_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_status ON delivery_tracking(status);

-- Updated at trigger for couriers
CREATE TRIGGER update_couriers_updated_at
  BEFORE UPDATE ON couriers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Updated at trigger for delivery_tracking
CREATE TRIGGER update_delivery_tracking_updated_at
  BEFORE UPDATE ON delivery_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create notification on delivery status change
CREATE OR REPLACE FUNCTION create_delivery_notification()
RETURNS TRIGGER AS $$
DECLARE
  notification_title text;
  notification_message text;
  order_data RECORD;
BEGIN
  -- Only create notification if status changed
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Get order data
    SELECT * INTO order_data FROM orders WHERE id = NEW.order_id;
    
    -- Set notification content based on status
    CASE NEW.status
      WHEN 'assigned' THEN
        notification_title := 'Kurye Atandı! 👤';
        notification_message := 'Siparişiniz için kurye atandı ve yakında yola çıkacak.';
      WHEN 'picked_up' THEN
        notification_title := 'Paket Alındı! 📦';
        notification_message := 'Kuryemiz paketinizi aldı ve size doğru yola çıktı.';
      WHEN 'in_transit' THEN
        notification_title := 'Yolda! 🚚';
        notification_message := 'Siparişiniz size doğru geliyor. Canlı takip için tıklayın.';
      WHEN 'nearby' THEN
        notification_title := 'Yakınınızda! 📍';
        notification_message := 'Kuryemiz yakınınızda, birkaç dakika içinde kapınızda olacak.';
      WHEN 'arrived' THEN
        notification_title := 'Adresinizde! 🏠';
        notification_message := 'Kuryemiz adresinize ulaştı. Lütfen kapıyı açın.';
      WHEN 'delivered' THEN
        notification_title := 'Teslim Edildi! ✅';
        notification_message := 'Siparişiniz başarıyla teslim edildi. Afiyet olsun!';
      ELSE
        RETURN NEW;
    END CASE;

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
      order_data.member_id,
      'delivery_update',
      CASE 
        WHEN NEW.status IN ('nearby', 'arrived') THEN 'urgent'
        ELSE 'high'
      END,
      notification_title,
      notification_message,
      jsonb_build_object(
        'order_id', NEW.order_id,
        'order_number', order_data.order_number,
        'delivery_status', NEW.status,
        'tracking_id', NEW.id
      ),
      '/hesabim/teslimat-takibi?order=' || NEW.order_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for delivery notifications
DROP TRIGGER IF EXISTS delivery_notification_trigger ON delivery_tracking;
CREATE TRIGGER delivery_notification_trigger
  AFTER UPDATE ON delivery_tracking
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION create_delivery_notification();

-- Function to update delivery timestamps
CREATE OR REPLACE FUNCTION update_delivery_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  -- Update timestamps based on status
  IF NEW.status = 'picked_up' AND NEW.picked_up_at IS NULL THEN
    NEW.picked_up_at := now();
  ELSIF NEW.status = 'in_transit' AND NEW.started_at IS NULL THEN
    NEW.started_at := now();
  ELSIF NEW.status = 'delivered' AND NEW.delivered_at IS NULL THEN
    NEW.delivered_at := now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for delivery timestamps
DROP TRIGGER IF EXISTS delivery_timestamps_trigger ON delivery_tracking;
CREATE TRIGGER delivery_timestamps_trigger
  BEFORE UPDATE ON delivery_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_delivery_timestamps();

-- Add comments
COMMENT ON TABLE couriers IS 'Courier information for delivery tracking';
COMMENT ON TABLE delivery_tracking IS 'Real-time delivery tracking with location updates';
COMMENT ON FUNCTION create_delivery_notification() IS 'Creates notification when delivery status changes';
COMMENT ON FUNCTION update_delivery_timestamps() IS 'Updates delivery timestamps based on status changes';
