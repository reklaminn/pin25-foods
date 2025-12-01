'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';

export default function CheckoutFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const error = searchParams.get('error');
    
    const errorMessages: Record<string, string> = {
      'missing_token': 'Ödeme bilgileri eksik',
      'payment_failed': 'Ödeme işlemi başarısız oldu',
      'callback_error': 'Ödeme sonucu alınamadı',
      'insufficient_funds': 'Yetersiz bakiye',
      'card_declined': 'Kart reddedildi',
      'expired_card': 'Kartın süresi dolmuş',
      'invalid_card': 'Geçersiz kart bilgileri',
      'fraud_suspected': 'Güvenlik nedeniyle işlem reddedildi'
    };

    setErrorMessage(errorMessages[error || ''] || 'Ödeme işlemi sırasında bir hata oluştu');
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ödeme Başarısız
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            {errorMessage}
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-red-900 mb-3">Ne yapabilirsiniz?</h3>
            <ul className="text-left text-sm text-red-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Kart bilgilerinizi kontrol edin ve tekrar deneyin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Kartınızda yeterli bakiye olduğundan emin olun</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Farklı bir ödeme yöntemi deneyin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Bankanızla iletişime geçin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Sorun devam ederse müşteri hizmetlerimizle iletişime geçin</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              icon={ArrowLeft}
              onClick={() => router.push('/checkout')}
              size="lg"
            >
              Ödeme Sayfasına Dön
            </Button>
            <Button
              variant="primary"
              icon={RefreshCw}
              onClick={() => router.push('/checkout')}
              size="lg"
            >
              Tekrar Dene
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Yardıma mı ihtiyacınız var?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a 
                href="tel:+905551234567" 
                className="text-mealora-primary hover:underline"
              >
                📞 0555 123 45 67
              </a>
              <a 
                href="mailto:destek@mealora.com" 
                className="text-mealora-primary hover:underline"
              >
                ✉️ destek@mealora.com
              </a>
              <a 
                href="https://wa.me/905551234567" 
                className="text-mealora-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 WhatsApp Destek
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
