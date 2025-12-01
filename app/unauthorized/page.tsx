import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
          <ShieldAlert className="w-12 h-12 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Yetkisiz Erişim
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8">
          Bu sayfaya erişim yetkiniz bulunmamaktadır. Admin paneline erişmek için yetkili bir hesapla giriş yapmanız gerekmektedir.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Home size={20} />
              Ana Sayfaya Dön
            </Button>
          </Link>
          
          <Link href="/admin/login">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <ArrowLeft size={20} />
              Giriş Sayfasına Dön
            </Button>
          </Link>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Eğer admin erişiminiz olması gerektiğini düşünüyorsanız, lütfen sistem yöneticinizle iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  );
}
