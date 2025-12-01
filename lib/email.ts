import { supabase } from './supabase';

export interface SendEmailParams {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: params
    });

    if (error) {
      console.error('Email sending error:', error);
      return false;
    }

    return data?.success || false;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

// Email template helpers
export const EmailTemplates = {
  ORDER_CONFIRMATION: 'order-confirmation',
  ORDER_CONFIRMED: 'order-confirmed',
  ORDER_PREPARING: 'order-preparing',
  ORDER_SHIPPED: 'order-shipped',
  ORDER_DELIVERED: 'order-delivered',
  ORDER_CANCELLED: 'order-cancelled',
  PAYMENT_SUCCESS: 'payment-success',
  PAYMENT_FAILED: 'payment-failed'
} as const;

// Send order confirmation email
export async function sendOrderConfirmationEmail(orderData: {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  packageName: string;
  dietType: string;
  mealCount: number;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  totalAmount: number;
  orderUrl: string;
}): Promise<boolean> {
  return sendEmail({
    to: orderData.customerEmail,
    subject: `Siparişiniz Alındı - ${orderData.orderNumber}`,
    template: EmailTemplates.ORDER_CONFIRMATION,
    data: orderData
  });
}

// Send order status update email
export async function sendOrderStatusEmail(
  status: string,
  orderData: {
    customerEmail: string;
    customerName: string;
    orderNumber: string;
    deliveryAddress?: string;
    deliveryDate?: string;
    deliveryTime?: string;
    orderUrl: string;
    reviewUrl?: string;
    cancelReason?: string;
    refundAmount?: number;
    shopUrl?: string;
  }
): Promise<boolean> {
  const templateMap: Record<string, string> = {
    'confirmed': EmailTemplates.ORDER_CONFIRMED,
    'preparing': EmailTemplates.ORDER_PREPARING,
    'shipped': EmailTemplates.ORDER_SHIPPED,
    'delivered': EmailTemplates.ORDER_DELIVERED,
    'cancelled': EmailTemplates.ORDER_CANCELLED
  };

  const subjectMap: Record<string, string> = {
    'confirmed': 'Siparişiniz Onaylandı',
    'preparing': 'Yemekleriniz Hazırlanıyor',
    'shipped': 'Siparişiniz Yola Çıktı',
    'delivered': 'Siparişiniz Teslim Edildi',
    'cancelled': 'Siparişiniz İptal Edildi'
  };

  const template = templateMap[status];
  const subject = `${subjectMap[status]} - ${orderData.orderNumber}`;

  if (!template) {
    console.error('Unknown order status:', status);
    return false;
  }

  return sendEmail({
    to: orderData.customerEmail,
    subject,
    template,
    data: orderData
  });
}

// Send payment success email
export async function sendPaymentSuccessEmail(paymentData: {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  transactionId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  orderUrl: string;
}): Promise<boolean> {
  return sendEmail({
    to: paymentData.customerEmail,
    subject: `Ödeme Başarılı - ${paymentData.orderNumber}`,
    template: EmailTemplates.PAYMENT_SUCCESS,
    data: paymentData
  });
}

// Send payment failed email
export async function sendPaymentFailedEmail(paymentData: {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  errorMessage: string;
  retryUrl: string;
}): Promise<boolean> {
  return sendEmail({
    to: paymentData.customerEmail,
    subject: `Ödeme Başarısız - ${paymentData.orderNumber}`,
    template: EmailTemplates.PAYMENT_FAILED,
    data: paymentData
  });
}
