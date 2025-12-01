'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/button';
import { useLogo } from '@/hooks/useLogo';

export default function MemberLoginPage() {
  const router = useRouter();
  const { logoUrl } = useLogo();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simüle edilmiş giriş işlemi
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ email: formData.email, role: 'member' }));
      setIsLoading(false);
      router.push('/member');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <img 
              src={logoUrl} 
              alt="P25 Foods" 
              className="h-16 w-auto mx-auto"
            />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Hoş Geldiniz</h2>
          <p className="mt-2 text-sm text-gray-600">
            P25 Foods üye hesabınıza giriş yapın
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta Adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-mealora-primary focus:border-mealora-primary sm:text-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-mealora-primary focus:border-mealora-primary sm:text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-mealora-primary focus:ring-mealora-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Beni hatırla
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-mealora-primary hover:text-mealora-secondary">
                Şifremi unuttum
              </a>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            icon={ArrowRight}
          >
            Giriş Yap
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Hesabınız yok mu? </span>
            <Link href="/member/register" className="font-medium text-mealora-primary hover:text-mealora-secondary">
              Hemen Kayıt Olun
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
