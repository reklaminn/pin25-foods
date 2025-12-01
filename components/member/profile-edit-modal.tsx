'use client';

import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, Eye, EyeOff, Camera, Check } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { updateMemberProfile, changePassword } from '@/lib/auth';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdate: (updatedUser: any) => void;
}

export default function ProfileEditModal({ isOpen, onClose, user, onUpdate }: ProfileEditModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Validation errors
  const [errors, setErrors] = useState<any>({});

  if (!isOpen) return null;

  const validateProfile = () => {
    const newErrors: any = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'Ad alanı zorunludur';
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Soyad alanı zorunludur';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email alanı zorunludur';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Geçerli bir email adresi giriniz';
    }

    if (profileData.phone && !/^[0-9]{10}$/.test(profileData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz (10 haneli)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: any = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Mevcut şifre zorunludur';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Yeni şifre zorunludur';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Şifre en az 8 karakter olmalıdır';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı zorunludur';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfile()) return;

    setLoading(true);
    setMessage(null);

    const result = await updateMemberProfile(user.id, {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      phone: profileData.phone
    });

    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Profil bilgileriniz başarıyla güncellendi!' });
      onUpdate(result.user);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Bir hata oluştu' });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    setLoading(true);
    setMessage(null);

    const result = await changePassword(
      user.id,
      passwordData.currentPassword,
      passwordData.newPassword
    );

    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Şifreniz başarıyla değiştirildi!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => {
        setActiveTab('profile');
        setMessage(null);
      }, 2000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Bir hata oluştu' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-mealora-primary to-green-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Profil Ayarları</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab('profile');
                setErrors({});
                setMessage(null);
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'profile'
                  ? 'bg-white text-mealora-primary'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Profil Bilgileri
            </button>
            <button
              onClick={() => {
                setActiveTab('password');
                setErrors({});
                setMessage(null);
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'password'
                  ? 'bg-white text-mealora-primary'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Şifre Değiştir
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Success/Error Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' && <Check className="w-5 h-5" />}
              <p className="font-medium">{message.text}</p>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-mealora-primary to-green-600 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border-2 border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-3">Profil fotoğrafını değiştir</p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Ad"
                  icon={User}
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  error={errors.firstName}
                  placeholder="Adınız"
                />
                <Input
                  label="Soyad"
                  icon={User}
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  error={errors.lastName}
                  placeholder="Soyadınız"
                />
              </div>

              {/* Email */}
              <Input
                label="Email"
                type="email"
                icon={Mail}
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                error={errors.email}
                placeholder="ornek@email.com"
              />

              {/* Phone */}
              <Input
                label="Telefon"
                type="tel"
                icon={Phone}
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                error={errors.phone}
                placeholder="5XX XXX XX XX"
              />

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Not:</strong> Email adresinizi değiştirirseniz, yeni email adresinize bir doğrulama linki gönderilecektir.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </Button>
              </div>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mevcut Şifre
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className={`w-full pl-11 pr-11 py-3 rounded-lg border ${
                      errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-mealora-primary focus:border-transparent transition-all`}
                    placeholder="Mevcut şifreniz"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yeni Şifre
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className={`w-full pl-11 pr-11 py-3 rounded-lg border ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-mealora-primary focus:border-transparent transition-all`}
                    placeholder="Yeni şifreniz"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yeni Şifre (Tekrar)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className={`w-full pl-11 pr-11 py-3 rounded-lg border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-mealora-primary focus:border-transparent transition-all`}
                    placeholder="Yeni şifrenizi tekrar giriniz"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Şifre Gereksinimleri:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      passwordData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    En az 8 karakter
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      /[A-Z]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    En az bir büyük harf
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      /[a-z]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    En az bir küçük harf
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      /\d/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    En az bir rakam
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
