'use client';

import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Upload, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { uploadLogo, deleteOldLogo } from '@/lib/storage';

interface Settings {
  logo_url: string;
  site_title: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  delivery_time: string;
  min_order_amount: string;
  free_delivery: string;
  ga4_measurement_id: string;
  meta_pixel_id: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    logo_url: '',
    site_title: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    delivery_time: '',
    min_order_amount: '',
    free_delivery: 'true',
    ga4_measurement_id: '',
    meta_pixel_id: ''
  });

  const [showGA4, setShowGA4] = useState(false);
  const [showMetaPixel, setShowMetaPixel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      const data = await response.json();

      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Load settings error:', error);
      showMessage('error', 'Ayarlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = (key: keyof Settings, checked: boolean) => {
    setSettings(prev => ({ ...prev, [key]: checked ? 'true' : 'false' }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Delete old logo if exists
      if (settings.logo_url) {
        await deleteOldLogo(settings.logo_url);
      }

      // Upload new logo
      const result = await uploadLogo(file);
      
      if (result.success && result.url) {
        setSettings(prev => ({ ...prev, logo_url: result.url! }));
        showMessage('success', 'Logo başarıyla yüklendi');
      } else {
        showMessage('error', result.error || 'Logo yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      showMessage('error', 'Logo yüklenirken hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Ayarlar başarıyla kaydedildi');
        // Reload to ensure we have latest data
        await loadSettings();
      } else {
        showMessage('error', data.error || 'Ayarlar kaydedilirken hata oluştu');
      }
    } catch (error) {
      console.error('Save settings error:', error);
      showMessage('error', 'Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A6B3C]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Ayarları</h1>
        <p className="mt-1 text-sm text-gray-600">
          Genel site ayarlarını ve takip kodlarını yönetin
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Logo Upload */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Site Logosu</h2>
        
        <div className="space-y-4">
          {settings.logo_url && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <img 
                src={settings.logo_url} 
                alt="Current Logo" 
                className="h-12 w-auto object-contain"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Mevcut Logo</p>
                <p className="text-xs text-gray-500 mt-1 break-all">{settings.logo_url}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yeni Logo Yükle
            </label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                <Upload size={20} />
                <span>{uploading ? 'Yükleniyor...' : 'Dosya Seç'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              {uploading && <Loader2 className="w-5 h-5 animate-spin text-[#4A6B3C]" />}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              PNG, JPG veya SVG formatında, maksimum 2MB
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Analitik & Takip Kodları</h2>
        
        <div className="space-y-6">
          {/* Google Analytics 4 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Analytics 4 Measurement ID
            </label>
            <div className="relative">
              <input
                type={showGA4 ? 'text' : 'password'}
                value={settings.ga4_measurement_id}
                onChange={(e) => handleInputChange('ga4_measurement_id', e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A6B3C] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowGA4(!showGA4)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showGA4 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Google Analytics 4 ölçüm kimliğinizi girin (örn: G-XXXXXXXXXX)
            </p>
          </div>

          {/* Meta Pixel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Pixel ID
            </label>
            <div className="relative">
              <input
                type={showMetaPixel ? 'text' : 'password'}
                value={settings.meta_pixel_id}
                onChange={(e) => handleInputChange('meta_pixel_id', e.target.value)}
                placeholder="123456789012345"
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A6B3C] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowMetaPixel(!showMetaPixel)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showMetaPixel ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Facebook/Meta Pixel kimliğinizi girin (15 haneli sayı)
            </p>
          </div>
        </div>
      </div>

      {/* Site Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Site Bilgileri</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Başlığı
            </label>
            <input
              type="text"
              value={settings.site_title}
              onChange={(e) => handleInputChange('site_title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A6B3C] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Açıklaması
            </label>
            <textarea
              rows={3}
              value={settings.site_description}
              onChange={(e) => handleInputChange('site_description', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A6B3C] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İletişim E-postası
            </label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => handleInputChange('contact_email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A6B3C] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefon
            </label>
            <input
              type="tel"
              value={settings.contact_phone}
              onChange={(e) => handleInputChange('contact_phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A6B3C] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Delivery Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Teslimat Ayarları</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Varsayılan Teslimat Saati
            </label>
            <input
              type="text"
              value={settings.delivery_time}
              onChange={(e) => handleInputChange('delivery_time', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A6B3C] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Sipariş Tutarı (₺)
            </label>
            <input
              type="text"
              value={settings.min_order_amount}
              onChange={(e) => handleInputChange('min_order_amount', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A6B3C] focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="freeDelivery"
              checked={settings.free_delivery === 'true'}
              onChange={(e) => handleCheckboxChange('free_delivery', e.target.checked)}
              className="w-4 h-4 text-[#4A6B3C] border-gray-300 rounded focus:ring-[#4A6B3C]"
            />
            <label htmlFor="freeDelivery" className="text-sm font-medium text-gray-700">
              Ücretsiz teslimat aktif
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A6B3C] text-white rounded-lg hover:bg-[#3d5a31] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Kaydediliyor...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Değişiklikleri Kaydet</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
