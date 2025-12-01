'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { memberLogin, memberRegister, saveUserSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useLogo } from '@/hooks/useLogo';

interface MemberLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MemberLoginModal({ isOpen, onClose }: MemberLoginModalProps) {
  const router = useRouter();
  const { logoUrl } = useLogo();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await memberLogin(loginData.email, loginData.password);
    
    setLoading(false);

    if (result.success) {
      saveUserSession(result.user, 'member');
      onClose();
      router.push('/hesabim');
    } else {
      setError(result.error || 'Giriş yapılırken bir hata oluştu');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);

    const result = await memberRegister({
      email: registerData.email,
      password: registerData.password,
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      phone: registerData.phone
    });

    setLoading(false);

    if (result.success) {
      saveUserSession(result.user, 'member');
      onClose();
      router.push('/hesabim');
    } else {
      setError(result.error || 'Kayıt olurken bir hata oluştu');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">
            {mode === 'login' ? 'Üye Girişi' : 'Üye Ol'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Logo Display */}
          <div className="flex justify-center mb-6">
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                placeholder="ornek@email.com"
                icon={Mail}
                required
              />

              <div className="relative">
                <Input
                  label="Şifre"
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="••••••••"
                  icon={Lock}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-mealora-primary hover:underline text-sm"
                >
                  Hesabınız yok mu? Üye olun
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Ad"
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                  placeholder="Adınız"
                  icon={User}
                  required
                />
                <Input
                  label="Soyad"
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                  placeholder="Soyadınız"
                  required
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                placeholder="ornek@email.com"
                icon={Mail}
                required
              />

              <Input
                label="Telefon"
                type="tel"
                value={registerData.phone}
                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                placeholder="5XX XXX XX XX"
                icon={Phone}
              />

              <div className="relative">
                <Input
                  label="Şifre"
                  type={showPassword ? 'text' : 'password'}
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  placeholder="En az 6 karakter"
                  icon={Lock}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Input
                label="Şifre Tekrar"
                type={showPassword ? 'text' : 'password'}
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                placeholder="Şifrenizi tekrar girin"
                icon={Lock}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Kayıt olunuyor...' : 'Üye Ol'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-mealora-primary hover:underline text-sm"
                >
                  Zaten hesabınız var mı? Giriş yapın
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
