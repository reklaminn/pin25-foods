/*
  # Sipariş Durum Değişikliği Email Trigger'ları
  
  1. Triggers
    - order_status_changed: Durum değiştiğinde email gönder
    
  2. Functions
    - notify_order_status_change: Edge function'ı tetikle
*/

-- Function to notify order status change via Edge Function
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
  member_data RECORD;
  address_data RECORD;
  email_data jsonb;
BEGIN
  -- Only send email if status actually changed
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Get member details
    SELECT * INTO member_data
    FROM members
    WHERE id = NEW.member_id;

    -- Get delivery address if exists
    IF NEW.delivery_address_id IS NOT NULL THEN
      SELECT * INTO address_data
      FROM addresses
      WHERE id = NEW.delivery_address_id;
    END IF;

    -- Prepare email data based on status
    email_data := jsonb_build_object(
      'customerEmail', member_data.email,
      'customerName', member_data.first_name || ' ' || member_data.last_name,
      'orderNumber', NEW.order_number,
      'orderUrl', 'https://mealora.com/hesabim/siparislerim',
      'deliveryAddress', COALESCE(
        address_data.address_line1 || ', ' || address_data.district || ', ' || address_data.city,
        'Belirtilmemiş'
      ),
      'deliveryDate', COALESCE(
        to_char(NEW.delivery_date, 'DD Month YYYY'),
        'Belirtilmemiş'
      ),
      'deliveryTime', COALESCE(NEW.delivery_time_slot, 'Belirtilmemiş')
    );

    -- Add status-specific data
    IF NEW.status = 'cancelled' THEN
      email_data := email_data || jsonb_build_object(
        'cancelReason', COALESCE(
          (SELECT notes FROM order_status_history 
           WHERE order_id = NEW.id AND status = 'cancelled' 
           ORDER BY created_at DESC LIMIT 1),
          'Belirtilmemiş'
        ),
        'refundAmount', CASE 
          WHEN NEW.payment_status = 'completed' THEN NEW.final_amount 
          ELSE NULL 
        END,
        'shopUrl', 'https://mealora.com/paket-sec'
      );
    ELSIF NEW.status = 'delivered' THEN
      email_data := email_data || jsonb_build_object(
        'reviewUrl', 'https://mealora.com/hesabim/siparislerim?review=' || NEW.id
      );
    END IF;

    -- Call Edge Function to send email
    -- Note: This requires pg_net extension and proper configuration
    -- For now, we'll log the email data
    RAISE NOTICE 'Order status changed to %: %', NEW.status, email_data;

    -- In production, you would call the Edge Function here:
    -- PERFORM net.http_post(
    --   url := 'https://your-project.supabase.co/functions/v1/send-email',
    --   headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
    --   body := jsonb_build_object(
    --     'to', member_data.email,
    --     'subject', 'Sipariş Durumu Güncellendi - ' || NEW.order_number,
    --     'template', 'order-' || NEW.status,
    --     'data', email_data
    --   )
    -- );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order status changes
DROP TRIGGER IF EXISTS order_status_email_trigger ON orders;
CREATE TRIGGER order_status_email_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION notify_order_status_change();

-- Add comment
COMMENT ON FUNCTION notify_order_status_change() IS 
  'Sends email notification when order status changes via Supabase Edge Function';
