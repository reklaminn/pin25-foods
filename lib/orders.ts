import { supabase } from './supabase';

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash_on_delivery';

export interface Order {
  id: string;
  order_number: string;
  member_id: string;
  status: OrderStatus;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  package_type: string;
  diet_type: string;
  meal_count: number;
  delivery_days: string[];
  delivery_address_id: string | null;
  delivery_date: string | null;
  delivery_time_slot: string | null;
  delivery_notes: string | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_date: string | null;
  transaction_id: string | null;
  promo_code: string | null;
  promo_discount: number;
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  meal_name: string;
  meal_category: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  delivery_date: string;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface OrderWithDetails extends Order {
  items?: OrderItem[];
  status_history?: OrderStatusHistory[];
  delivery_address?: any;
}

// Get all orders for a member
export async function getMemberOrders(
  memberId: string,
  filters?: {
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }
) {
  try {
    let query = supabase
      .from('orders')
      .select('*')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Get orders error:', error);
      return { success: false, error: 'Siparişler yüklenirken bir hata oluştu' };
    }

    return { success: true, orders: data as Order[] };
  } catch (error) {
    console.error('Get orders error:', error);
    return { success: false, error: 'Siparişler yüklenirken bir hata oluştu' };
  }
}

// Get single order with full details
export async function getOrderDetails(orderId: string, memberId: string) {
  try {
    // Get order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('member_id', memberId)
      .single();

    if (orderError) {
      console.error('Get order error:', orderError);
      return { success: false, error: 'Sipariş bulunamadı' };
    }

    // Get order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
      .order('delivery_date', { ascending: true });

    if (itemsError) {
      console.error('Get order items error:', itemsError);
    }

    // Get status history
    const { data: statusHistory, error: historyError } = await supabase
      .from('order_status_history')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (historyError) {
      console.error('Get status history error:', historyError);
    }

    // Get delivery address if exists
    let deliveryAddress = null;
    if (order.delivery_address_id) {
      const { data: address } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', order.delivery_address_id)
        .single();
      
      deliveryAddress = address;
    }

    const orderWithDetails: OrderWithDetails = {
      ...order,
      items: items || [],
      status_history: statusHistory || [],
      delivery_address: deliveryAddress
    };

    return { success: true, order: orderWithDetails };
  } catch (error) {
    console.error('Get order details error:', error);
    return { success: false, error: 'Sipariş detayları yüklenirken bir hata oluştu' };
  }
}

// Create new order
export async function createOrder(orderData: {
  memberId: string;
  packageType: string;
  dietType: string;
  mealCount: number;
  deliveryDays: string[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  deliveryAddressId: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  deliveryNotes?: string;
  paymentMethod: PaymentMethod;
  promoCode?: string;
  promoDiscount?: number;
  items: Array<{
    mealName: string;
    mealCategory: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    deliveryDate: string;
  }>;
}) {
  try {
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        member_id: orderData.memberId,
        package_type: orderData.packageType,
        diet_type: orderData.dietType,
        meal_count: orderData.mealCount,
        delivery_days: orderData.deliveryDays,
        total_amount: orderData.totalAmount,
        discount_amount: orderData.discountAmount,
        final_amount: orderData.finalAmount,
        delivery_address_id: orderData.deliveryAddressId,
        delivery_date: orderData.deliveryDate,
        delivery_time_slot: orderData.deliveryTimeSlot,
        delivery_notes: orderData.deliveryNotes || null,
        payment_method: orderData.paymentMethod,
        promo_code: orderData.promoCode || null,
        promo_discount: orderData.promoDiscount || 0,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Create order error:', orderError);
      return { success: false, error: 'Sipariş oluşturulurken bir hata oluştu' };
    }

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      meal_name: item.mealName,
      meal_category: item.mealCategory,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
      calories: item.calories || null,
      protein: item.protein || null,
      carbs: item.carbs || null,
      fat: item.fat || null,
      delivery_date: item.deliveryDate
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Create order items error:', itemsError);
      // Rollback order creation
      await supabase.from('orders').delete().eq('id', order.id);
      return { success: false, error: 'Sipariş kalemleri oluşturulurken bir hata oluştu' };
    }

    return { success: true, order };
  } catch (error) {
    console.error('Create order error:', error);
    return { success: false, error: 'Sipariş oluşturulurken bir hata oluştu' };
  }
}

// Cancel order
export async function cancelOrder(orderId: string, memberId: string, reason?: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('member_id', memberId)
      .in('status', ['pending', 'confirmed'])
      .select()
      .single();

    if (error) {
      console.error('Cancel order error:', error);
      return { success: false, error: 'Sipariş iptal edilirken bir hata oluştu' };
    }

    // Add cancellation note to history
    if (reason) {
      await supabase
        .from('order_status_history')
        .insert({
          order_id: orderId,
          status: 'cancelled',
          notes: `Cancelled by customer: ${reason}`
        });
    }

    return { success: true, order: data };
  } catch (error) {
    console.error('Cancel order error:', error);
    return { success: false, error: 'Sipariş iptal edilirken bir hata oluştu' };
  }
}

// Get order statistics
export async function getOrderStatistics(memberId: string) {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('status, final_amount')
      .eq('member_id', memberId);

    if (error) {
      console.error('Get statistics error:', error);
      return { success: false, error: 'İstatistikler yüklenirken bir hata oluştu' };
    }

    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalSpent: orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + Number(o.final_amount), 0)
    };

    return { success: true, stats };
  } catch (error) {
    console.error('Get statistics error:', error);
    return { success: false, error: 'İstatistikler yüklenirken bir hata oluştu' };
  }
}

// Status display helpers
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Beklemede',
  confirmed: 'Onaylandı',
  preparing: 'Hazırlanıyor',
  ready: 'Hazır',
  shipped: 'Kargoda',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal Edildi'
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-purple-100 text-purple-700',
  ready: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  credit_card: 'Kredi Kartı',
  debit_card: 'Banka Kartı',
  bank_transfer: 'Havale/EFT',
  cash_on_delivery: 'Kapıda Ödeme'
};
