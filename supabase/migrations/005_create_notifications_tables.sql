/*
  # Bildirim Sistemi Tabloları
  
  1. Tables
    - notifications: Bildirimler
    - push_subscriptions: Push notification abonelikleri
    
  2. Security
    - RLS enabled
    - Members can only access their own notifications
    
  3. Features
    - Real-time notifications
    - Push notification support
    - Notification types and priorities
    - Read/unread tracking
    - Archive functionality
*/

-- Notification Type Enum
CREATE TYPE notification_type AS ENUM (
  'order_update',
  'delivery_update',
  'payment_update',
  'promotion',
  'system'
);

-- Notification Priority Enum
CREATE TYPE notification_priority AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  
  type notification_type NOT NULL,
  priority notification_priority DEFAULT 'medium',
  
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  
  is_read boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  
  action_url text,
  
  created_at timestamptz DEFAULT now(),
  read_at timestamptz,
  
  CONSTRAINT valid_title CHECK (length(title) > 0),
  CONSTRAINT valid_message CHECK (length(message) > 0)
);

-- Push Subscriptions Table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  
  endpoint text NOT NULL UNIQUE,
  keys jsonb NOT NULL,
  
  user_agent text,
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz,
  
  CONSTRAINT valid_endpoint CHECK (length(endpoint) > 0),
  CONSTRAINT valid_keys CHECK (keys ? 'p256dh' AND keys ? 'auth')
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Notifications Policies
CREATE POLICY "Members can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Members can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (member_id = auth.uid());

-- Push Subscriptions Policies
CREATE POLICY "Members can read own subscriptions"
  ON push_subscriptions
  FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Members can insert own subscriptions"
  ON push_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (member_id = auth.uid());

CREATE POLICY "Members can update own subscriptions"
  ON push_subscriptions
  FOR UPDATE
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Members can delete own subscriptions"
  ON push_subscriptions
  FOR DELETE
  TO authenticated
  USING (member_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_member_id ON notifications(member_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_member_id ON push_subscriptions(member_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Function to create notification on order status change
CREATE OR REPLACE FUNCTION create_order_notification()
RETURNS TRIGGER AS $$
DECLARE
  notification_title text;
  notification_message text;
  notification_type notification_type;
BEGIN
  -- Only create notification if status changed
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Set notification content based on status
    CASE NEW.status
      WHEN 'confirmed' THEN
        notification_title := 'Siparişiniz Onaylandı! ✅';
        notification_message := 'Sipariş numarası: ' || NEW.order_number || ' onaylandı ve hazırlık aşamasına geçti.';
        notification_type := 'order_update';
      WHEN 'preparing' THEN
        notification_title := 'Yemekleriniz Hazırlanıyor! 👨‍🍳';
        notification_message := 'Şeflerimiz sizin için özel olarak yemeklerinizi hazırlıyor.';
        notification_type := 'order_update';
      WHEN 'shipped' THEN
        notification_title := 'Siparişiniz Yola Çıktı! 🚚';
        notification_message := 'Sipariş numarası: ' || NEW.order_number || ' kargoya verildi ve yakında kapınızda olacak.';
        notification_type := 'delivery_update';
      WHEN 'delivered' THEN
        notification_title := 'Siparişiniz Teslim Edildi! 🎉';
        notification_message := 'Afiyet olsun! Deneyiminizi değerlendirmeyi unutmayın.';
        notification_type := 'order_update';
      WHEN 'cancelled' THEN
        notification_title := 'Siparişiniz İptal Edildi ❌';
        notification_message := 'Sipariş numarası: ' || NEW.order_number || ' iptal edildi.';
        notification_type := 'order_update';
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
      NEW.member_id,
      notification_type,
      'high',
      notification_title,
      notification_message,
      jsonb_build_object(
        'order_id', NEW.id,
        'order_number', NEW.order_number,
        'status', NEW.status
      ),
      '/hesabim/siparislerim'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order notifications
DROP TRIGGER IF EXISTS order_notification_trigger ON orders;
CREATE TRIGGER order_notification_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION create_order_notification();

-- Function to create notification on payment status change
CREATE OR REPLACE FUNCTION create_payment_notification()
RETURNS TRIGGER AS $$
DECLARE
  notification_title text;
  notification_message text;
BEGIN
  -- Only create notification if payment status changed
  IF (TG_OP = 'UPDATE' AND OLD.payment_status IS DISTINCT FROM NEW.payment_status) THEN
    CASE NEW.payment_status
      WHEN 'completed' THEN
        notification_title := 'Ödeme Başarılı! ✅';
        notification_message := 'Sipariş numarası: ' || NEW.order_number || ' için ödemeniz alındı.';
      WHEN 'failed' THEN
        notification_title := 'Ödeme Başarısız ❌';
        notification_message := 'Sipariş numarası: ' || NEW.order_number || ' için ödeme işlemi başarısız oldu.';
      WHEN 'refunded' THEN
        notification_title := 'İade İşlemi Tamamlandı 💰';
        notification_message := 'Sipariş numarası: ' || NEW.order_number || ' için iade işlemi tamamlandı.';
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
      NEW.member_id,
      'payment_update',
      'high',
      notification_title,
      notification_message,
      jsonb_build_object(
        'order_id', NEW.id,
        'order_number', NEW.order_number,
        'payment_status', NEW.payment_status,
        'amount', NEW.final_amount
      ),
      '/hesabim/siparislerim'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment notifications
DROP TRIGGER IF EXISTS payment_notification_trigger ON orders;
CREATE TRIGGER payment_notification_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW
  WHEN (OLD.payment_status IS DISTINCT FROM NEW.payment_status)
  EXECUTE FUNCTION create_payment_notification();

-- Add comments
COMMENT ON TABLE notifications IS 'User notifications for orders, deliveries, payments, and promotions';
COMMENT ON TABLE push_subscriptions IS 'Web push notification subscriptions';
COMMENT ON FUNCTION create_order_notification() IS 'Creates notification when order status changes';
COMMENT ON FUNCTION create_payment_notification() IS 'Creates notification when payment status changes';
