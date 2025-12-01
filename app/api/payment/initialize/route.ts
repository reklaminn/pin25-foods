import { NextRequest, NextResponse } from 'next/server';
import { iyzicoService, formatIyzicoPrice, generateBasketId, getUserIP } from '@/lib/iyzico';
import type { IyzicoPaymentRequest } from '@/lib/iyzico';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      orderId,
      orderNumber,
      amount,
      customer,
      address,
      items
    } = body;

    // Validate required fields
    if (!orderId || !orderNumber || !amount || !customer || !address || !items) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user IP
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                '127.0.0.1';

    // Prepare payment request
    const paymentRequest: IyzicoPaymentRequest = {
      locale: 'tr',
      conversationId: orderId,
      price: formatIyzicoPrice(amount),
      paidPrice: formatIyzicoPrice(amount),
      currency: 'TRY',
      basketId: generateBasketId(),
      paymentGroup: 'PRODUCT',
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,
      enabledInstallments: [1, 2, 3, 6, 9, 12],
      buyer: {
        id: customer.id,
        name: customer.firstName,
        surname: customer.lastName,
        gsmNumber: customer.phone.replace(/\s/g, ''),
        email: customer.email,
        identityNumber: '11111111111', // TC kimlik no - gerçek uygulamada alınmalı
        registrationAddress: address.full,
        ip: ip,
        city: address.city,
        country: 'Turkey'
      },
      shippingAddress: {
        contactName: `${customer.firstName} ${customer.lastName}`,
        city: address.city,
        country: 'Turkey',
        address: address.full
      },
      billingAddress: {
        contactName: `${customer.firstName} ${customer.lastName}`,
        city: address.city,
        country: 'Turkey',
        address: address.full
      },
      basketItems: items.map((item: any, index: number) => ({
        id: `item-${index + 1}`,
        name: item.name,
        category1: item.category || 'Yemek Paketi',
        category2: item.dietType || 'Diyet',
        itemType: 'PHYSICAL',
        price: formatIyzicoPrice(item.price)
      }))
    };

    // Initialize payment
    const result = await iyzicoService.initializePayment(paymentRequest);

    if (result.status === 'success' && result.paymentPageUrl) {
      return NextResponse.json({
        success: true,
        paymentPageUrl: result.paymentPageUrl,
        token: result.token
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.errorMessage || 'Ödeme başlatılamadı'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: 'Ödeme başlatılırken bir hata oluştu' },
      { status: 500 }
    );
  }
}
