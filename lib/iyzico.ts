import crypto from 'crypto';

export interface IyzicoPaymentRequest {
  locale: string;
  conversationId: string;
  price: string;
  paidPrice: string;
  currency: string;
  basketId: string;
  paymentGroup: string;
  callbackUrl: string;
  enabledInstallments: number[];
  buyer: {
    id: string;
    name: string;
    surname: string;
    gsmNumber: string;
    email: string;
    identityNumber: string;
    registrationAddress: string;
    ip: string;
    city: string;
    country: string;
  };
  shippingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category1: string;
    category2?: string;
    itemType: string;
    price: string;
  }>;
}

export interface IyzicoPaymentResponse {
  status: string;
  locale: string;
  systemTime: number;
  conversationId: string;
  token?: string;
  tokenExpireTime?: number;
  paymentPageUrl?: string;
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
}

export interface IyzicoCallbackData {
  status: string;
  locale: string;
  systemTime: number;
  conversationId: string;
  token: string;
  paymentId?: string;
  price?: number;
  paidPrice?: number;
  currency?: string;
  basketId?: string;
  paymentStatus?: string;
  fraudStatus?: number;
  merchantCommissionRate?: number;
  merchantCommissionRateAmount?: number;
  iyziCommissionRateAmount?: number;
  iyziCommissionFee?: number;
  cardType?: string;
  cardAssociation?: string;
  cardFamily?: string;
  binNumber?: string;
  lastFourDigits?: string;
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
}

class IyzicoService {
  private apiKey: string;
  private secretKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_IYZICO_API_KEY || '';
    this.secretKey = process.env.NEXT_PUBLIC_IYZICO_SECRET_KEY || '';
    this.baseUrl = process.env.NEXT_PUBLIC_IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';
  }

  private generateAuthorizationHeader(url: string, requestBody: string): string {
    const randomString = crypto.randomBytes(16).toString('hex');
    const dataToSign = randomString + url + requestBody;
    
    const hash = crypto
      .createHmac('sha256', this.secretKey)
      .update(dataToSign)
      .digest('base64');

    return `IYZWS ${this.apiKey}:${hash}:${randomString}`;
  }

  async initializePayment(paymentData: IyzicoPaymentRequest): Promise<IyzicoPaymentResponse> {
    try {
      const url = '/payment/iyzipos/checkoutform/initialize/auth/ecom';
      const requestBody = JSON.stringify(paymentData);
      
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.generateAuthorizationHeader(url, requestBody),
          'x-iyzi-rnd': crypto.randomBytes(16).toString('hex')
        },
        body: requestBody
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('İyzico payment initialization error:', error);
      throw new Error('Ödeme başlatılamadı');
    }
  }

  async retrievePaymentResult(token: string, conversationId: string): Promise<IyzicoCallbackData> {
    try {
      const url = '/payment/iyzipos/checkoutform/auth/ecom/detail';
      const requestBody = JSON.stringify({
        locale: 'tr',
        conversationId,
        token
      });

      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.generateAuthorizationHeader(url, requestBody),
          'x-iyzi-rnd': crypto.randomBytes(16).toString('hex')
        },
        body: requestBody
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('İyzico payment result retrieval error:', error);
      throw new Error('Ödeme sonucu alınamadı');
    }
  }

  async cancelPayment(paymentId: string, ip: string): Promise<any> {
    try {
      const url = '/payment/cancel';
      const requestBody = JSON.stringify({
        locale: 'tr',
        conversationId: `cancel-${Date.now()}`,
        paymentId,
        ip
      });

      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.generateAuthorizationHeader(url, requestBody),
          'x-iyzi-rnd': crypto.randomBytes(16).toString('hex')
        },
        body: requestBody
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('İyzico payment cancellation error:', error);
      throw new Error('Ödeme iptal edilemedi');
    }
  }

  async refundPayment(paymentTransactionId: string, price: string, ip: string): Promise<any> {
    try {
      const url = '/payment/refund';
      const requestBody = JSON.stringify({
        locale: 'tr',
        conversationId: `refund-${Date.now()}`,
        paymentTransactionId,
        price,
        ip,
        currency: 'TRY'
      });

      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.generateAuthorizationHeader(url, requestBody),
          'x-iyzi-rnd': crypto.randomBytes(16).toString('hex')
        },
        body: requestBody
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('İyzico payment refund error:', error);
      throw new Error('İade işlemi gerçekleştirilemedi');
    }
  }
}

export const iyzicoService = new IyzicoService();

// Helper function to format price for İyzico (must be string with 2 decimals)
export function formatIyzicoPrice(amount: number): string {
  return amount.toFixed(2);
}

// Helper function to generate basket ID
export function generateBasketId(): string {
  return `B${Date.now()}`;
}

// Helper function to get user IP (client-side)
export async function getUserIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to get user IP:', error);
    return '127.0.0.1';
  }
}
