'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Package, MapPin, CreditCard, Calendar, Phone, Mail, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';

interface OrderData {
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    full: string;
    district: string;
    city: string;
    postalCode: string;
  };
  package: {
    packageName: string;
    mealPlan: string;
    calories: number;
    duration: number;
    pricePerDay: number;
    icon: string;
  };
  payment: {
    method: string;
    subtotal: number;
    discount: number;
    total: number;
  };
  promoCode: string | null;
  date: string;
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    // Get order data from sessionStorage
    const storedOrder = sessionStorage.getItem('lastOrder');
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder));
    } else {
      // If no order data, redirect to home
      router.push('/');
    }
  }, [router]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mealora-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const paymentMethodText = {
    'credit-card': 'Kredi Kartı',
    'bank-transfer': 'Havale / EFT',
    'cash-on-delivery': 'Kapıda Ödeme'
  };

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 1);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Siparişiniz Alındı!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Teşekkür ederiz, {orderData.customer.name}
          </p>
          <p className="text-sm text-gray-500">
            Sipariş No: <span className="font-mono font-bold text-mealora-primary">{orderData.orderNumber}</span>
          </p>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Package Info */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-6 h-6 text-mealora-primary" />
              <h2 className="text-2xl font-bold">Paket Detayları</h2>
            </div>

            <div className="bg-mealora-cream rounded-lg p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-5xl">{orderData.package.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{orderData.package.packageName}</h3>
                  <p className="text-gray-600 mb-3">{orderData.package.mealPlan}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="primary">{orderData.package.calories} kalori</Badge>
                    <Badge variant="secondary">{orderData.package.duration} gün</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Günlük Fiyat</p>
                  <p className="text-lg font-bold">{orderData.package.pricePerDay}₺</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Toplam Süre</p>
                  <p className="text-lg font-bold">{orderData.package.duration} gün</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Toplam Tutar</p>
                  <p className="text-lg font-bold text-mealora-primary">{orderData.payment.total}₺</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Delivery Info */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-6 h-6 text-mealora-primary" />
              <h2 className="text-2xl font-bold">Teslimat Bilgileri</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-1">{orderData.address.full}</p>
                <p className="text-sm text-gray-600">
                  {orderData.address.district}, {orderData.address.city} {orderData.address.postalCode}
                </p>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-5 h-5 text-mealora-primary" />
                <div>
                  <p className="font-medium text-gray-900">Tahmini Teslimat</p>
                  <p className="text-gray-600">
                    {estimatedDelivery.toLocaleDateString('tr-TR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Info */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-6 h-6 text-mealora-primary" />
              <h2 className="text-2xl font-bold">Ödeme Bilgileri</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Ödeme Yöntemi</span>
                <span className="font-medium">{paymentMethodText[orderData.payment.method as keyof typeof paymentMethodText]}</span>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Ara Toplam</span>
                  <span>{orderData.payment.subtotal}₺</span>
                </div>
                {orderData.payment.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>İndirim {orderData.promoCode && `(${orderData.promoCode})`}</span>
                    <span>-{orderData.payment.discount}₺</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Teslimat</span>
                  <span className="text-green-600 font-medium">Ücretsiz</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-xl font-bold">Toplam</span>
                  <span className="text-2xl font-bold text-mealora-primary">{orderData.payment.total}₺</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Info */}
          <Card>
            <h2 className="text-2xl font-bold mb-6">İletişim Bilgileri</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-mealora-primary" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{orderData.customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-mealora-primary" />
                <div>
                  <p className="text-sm text-gray-600">Telefon</p>
                  <p className="font-medium">{orderData.customer.phone}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-br from-mealora-primary to-green-700 text-white">
            <h2 className="text-2xl font-bold mb-6">Sıradaki Adımlar</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium mb-1">Email Onayı</p>
                  <p className="text-white/80 text-sm">
                    Sipariş detaylarınız email adresinize gönderildi
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium mb-1">Hazırlık Süreci</p>
                  <p className="text-white/80 text-sm">
                    Öğünleriniz taze malzemelerle hazırlanıyor
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium mb-1">Teslimat</p>
                  <p className="text-white/80 text-sm">
                    Öğünleriniz soğuk zincir ile adresinize teslim edilecek
                  </p>
                </div>
              </div>

              {orderData.payment.method === 'bank-transfer' && (
                <div className="bg-white/10 rounded-lg p-4 mt-4">
                  <p className="font-medium mb-2">⚠️ Önemli Not</p>
                  <p className="text-sm text-white/90">
                    Havale/EFT işleminizi yaptıktan sonra dekont fotoğrafını WhatsApp üzerinden göndermeyi unutmayın.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/')}
              className="flex-1"
            >
              Ana Sayfaya Dön
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.print()}
              className="flex-1"
            >
              Siparişi Yazdır
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-2">
              Sorularınız için bize ulaşın
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <a href="tel:+905551234567" className="text-mealora-primary hover:underline flex items-center gap-2">
                <Phone className="w-4 h-4" />
                0555 123 45 67
              </a>
              <a href="mailto:destek@mealora.com" className="text-mealora-primary hover:underline flex items-center gap-2">
                <Mail className="w-4 h-4" />
                destek@mealora.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
