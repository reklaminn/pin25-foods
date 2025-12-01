/*
  # Sipariş Yönetimi Tabloları
  
  1. Tables
    - orders: Ana sipariş tablosu
    - order_items: Sipariş kalemleri
    - order_status_history: Sipariş durum geçmişi
    
  2. Security
    - RLS enabled
    - Members can only access their own orders
    
  3. Features
    - Complete order tracking
    - Status history
    - Payment tracking
    - Delivery tracking
*/

-- Order Status Enum
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'shipped',
  'delivered',
  'cancelled'
);

-- Payment Status Enum
CREATE TYPE payment_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'refunded'
);

-- Payment Method Enum
CREATE TYPE payment_method AS ENUM (
  'credit_card',
  'debit_card',
  'bank_transfer',
  'cash_on_delivery'
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  
  -- Order Details
  status order_status DEFAULT 'pending',
  total_amount decimal(10,2) NOT NULL,
  discount_amount decimal(10,2) DEFAULT 0,
  final_amount decimal(10,2) NOT NULL,
  
  -- Package Details
  package_type text NOT NULL,
  diet_type text NOT NULL,
  meal_count integer NOT NULL,
  delivery_days text[] NOT NULL,
  
  -- Delivery Details
  delivery_address_id uuid REFERENCES addresses(id) ON DELETE SET NULL,
  delivery_date date,
  delivery_time_slot text,
  delivery_notes text,
  
  -- Payment Details
  payment_method payment_method NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  payment_date timestamptz,
  transaction_id text,
  
  -- Promo Code
  promo_code text,
  promo_discount decimal(10,2) DEFAULT 0,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz,
  
  -- Constraints
  CONSTRAINT positive_amounts CHECK (
    total_amount >= 0 AND 
    discount_amount >= 0 AND 
    final_amount >= 0 AND
    promo_discount >= 0
  ),
  CONSTRAINT valid_meal_count CHECK (meal_count > 0)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Item Details
  meal_name text NOT NULL,
  meal_category text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  
  -- Meal Details
  calories integer,
  protein decimal(5,2),
  carbs decimal(5,2),
  fat decimal(5,2),
  
  -- Delivery
  delivery_date date NOT NULL,
  
  created_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT positive_quantity CHECK (quantity > 0),
  CONSTRAINT positive_prices CHECK (unit_price >= 0 AND total_price >= 0)
);

-- Order Status History Table
CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  status order_status NOT NULL,
  notes text,
  created_by text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Orders Policies
CREATE POLICY "Members can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Members can insert own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (member_id = auth.uid());

CREATE POLICY "Members can update own pending orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (member_id = auth.uid() AND status = 'pending');

-- Order Items Policies
CREATE POLICY "Members can read own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders WHERE member_id = auth.uid()
    )
  );

-- Order Status History Policies
CREATE POLICY "Members can read own order status history"
  ON order_status_history
  FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders WHERE member_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_member_id ON orders(member_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_delivery_date ON order_items(delivery_date);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);

-- Updated at trigger for orders
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  new_number text;
  year_part text;
  sequence_part text;
BEGIN
  year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT LPAD(
    COALESCE(
      MAX(
        CAST(
          SUBSTRING(order_number FROM 'ORD-' || year_part || '-(.*)') 
          AS INTEGER
        )
      ), 0
    ) + 1, 
    6, 
    '0'
  )
  INTO sequence_part
  FROM orders
  WHERE order_number LIKE 'ORD-' || year_part || '-%';
  
  new_number := 'ORD-' || year_part || '-' || sequence_part;
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Function to add status history on order status change
CREATE OR REPLACE FUNCTION add_order_status_history()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') OR (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO order_status_history (order_id, status, notes)
    VALUES (NEW.id, NEW.status, 'Status changed to ' || NEW.status);
    
    -- Update timestamp fields based on status
    IF NEW.status = 'confirmed' AND NEW.confirmed_at IS NULL THEN
      NEW.confirmed_at := now();
    ELSIF NEW.status = 'delivered' AND NEW.delivered_at IS NULL THEN
      NEW.delivered_at := now();
    ELSIF NEW.status = 'cancelled' AND NEW.cancelled_at IS NULL THEN
      NEW.cancelled_at := now();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_order_status_history_trigger
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION add_order_status_history();
