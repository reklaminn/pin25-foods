import { iyzicoService, formatIyzicoPrice, generateBasketId } from './iyzico';
import { createOrder } from './orders';
import type { IyzicoPaymentRequest } from './iyzico';

export interface InitializePaymentParams {
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
  promoCode?: string;
  promoDiscount?: number;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  address: {
    full: string;
    city: string;
    district: string;
  };
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
}

export async function initializePayment(params: InitializePaymentParams) {
  try {
    // First, create the order in database
    const orderResult = await createOrder({
      memberId: params.memberId,
      packageType: params.packageType,
      dietType: params.dietType,
      mealCount: params.mealCount,
      deliveryDays: params.deliveryDays,
      totalAmount: params.totalAmount,
      discountAmount: params.discountAmount,
      finalAmount: params.finalAmount,
      deliveryAddressId: params.deliveryAddressId,
      deliveryDate: params.deliveryDate,
      deliveryTimeSlot: params.deliveryTimeSlot,
      deliveryNotes: params.deliveryNotes,
      paymentMethod: 'credit_card',
      promoCode: params.promoCode,
      promoDiscount: params.promoDiscount,
      items: params.items
    });

    if (!orderResult.success) {
      return {
        success: false,
        error: orderResult.error
      };
    }

    const order = orderResult.order;

    // Initialize payment with İyzico
    const response = await fetch('/api/payment/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: order.id,
        orderNumber: order.order_number,
        amount: params.finalAmount,
        customer: params.customer,
        address: params.address,
        items: params.items.map(item => ({
          name: item.mealName,
          category: item.mealCategory,
          dietType: params.dietType,
          price: item.totalPrice
        }))
      })
    });

    const result = await response.json();

    if (result.success && result.paymentPageUrl) {
      return {
        success: true,
        paymentPageUrl: result.paymentPageUrl,
        orderId: order.id,
        orderNumber: order.order_number
      };
    } else {
      return {
        success: false,
        error: result.error || 'Ödeme başlatılamadı'
      };
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    return {
      success: false,
      error: 'Ödeme başlatılırken bir hata oluştu'
    };
  }
}

export async function cancelPayment(paymentId: string, ip: string) {
  try {
    const result = await iyzicoService.cancelPayment(paymentId, ip);
    return {
      success: result.status === 'success',
      error: result.errorMessage
    };
  } catch (error) {
    console.error('Payment cancellation error:', error);
    return {
      success: false,
      error: 'Ödeme iptal edilemedi'
    };
  }
}

export async function refundPayment(paymentTransactionId: string, amount: number, ip: string) {
  try {
    const result = await iyzicoService.refundPayment(
      paymentTransactionId,
      formatIyzicoPrice(amount),
      ip
    );
    return {
      success: result.status === 'success',
      error: result.errorMessage
    };
  } catch (error) {
    console.error('Payment refund error:', error);
    return {
      success: false,
      error: 'İade işlemi gerçekleştirilemedi'
    };
  }
}
