'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin, Plus, Edit2, Trash2, Check, Star, Map } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import AddressMapSelector from './address-map-selector';
import { 
  getMemberAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress,
  setDefaultAddress,
  TURKISH_CITIES,
  type Address 
} from '@/lib/addresses';
import type { PlaceResult } from '@/lib/maps';

interface AddressManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  onUpdate: () => void;
}

export default function AddressManagementModal({ 
  isOpen, 
  onClose, 
  memberId,
  onUpdate 
}: AddressManagementModalProps) {
  const [view, setView] = useState<'list' | 'add' | 'edit' | 'map'>('list');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    postalCode: '',
    isDefault: false,
    latitude: null as number | null,
    longitude: null as number | null
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      loadAddresses();
    }
  }, [isOpen, memberId]);

  const loadAddresses = async () => {
    setLoading(true);
    const result = await getMemberAddresses(memberId);
    setLoading(false);

    if (result.success) {
      setAddresses(result.addresses || []);
    } else {
      setMessage({ type: 'error', text: result.error || 'Adresler yüklenemedi' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      district: '',
      postalCode: '',
      isDefault: false,
      latitude: null,
      longitude: null
    });
    setErrors({});
    setSelectedAddress(null);
  };

  const handleMapSelect = (result: PlaceResult) => {
    setFormData(prev => ({
      ...prev,
      addressLine1: result.address,
      city: result.components.city || prev.city,
      district: result.components.district || prev.district,
      postalCode: result.components.postalCode || prev.postalCode,
      latitude: result.location.lat,
      longitude: result.location.lng
    }));
    setView(view === 'map' ? (selectedAddress ? 'edit' : 'add') : view);
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Adres başlığı zorunludur';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Ad Soyad zorunludur';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon numarası zorunludur';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz (10-11 haneli)';
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Adres satırı zorunludur';
    }

    if (!formData.city) {
      newErrors.city = 'Şehir seçimi zorunludur';
    }

    if (!formData.district.trim()) {
      newErrors.district = 'İlçe zorunludur';
    }

    if (formData.postalCode && !/^[0-9]{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Posta kodu 5 haneli olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    let result;
    if (view === 'edit' && selectedAddress) {
      result = await updateAddress(selectedAddress.id, formData);
    } else {
      result = await addAddress(memberId, formData);
    }

    setLoading(false);

    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: view === 'edit' ? 'Adres başarıyla güncellendi!' : 'Adres başarıyla eklendi!' 
      });
      await loadAddresses();
      onUpdate();
      setTimeout(() => {
        setView('list');
        resetForm();
        setMessage(null);
      }, 1500);
    } else {
      setMessage({ type: 'error', text: result.error || 'Bir hata oluştu' });
    }
  };

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setFormData({
      title: address.title,
      fullName: address.full_name,
      phone: address.phone,
      addressLine1: address.address_line1,
      addressLine2: address.address_line2 || '',
      city: address.city,
      district: address.district,
      postalCode: address.postal_code || '',
      isDefault: address.is_default,
      latitude: address.latitude,
      longitude: address.longitude
    });
    setView('edit');
    setMessage(null);
  };

  const handleDelete = async (addressId: string) => {
    setLoading(true);
    setMessage(null);

    const result = await deleteAddress(addressId);
    
    setLoading(false);
    setDeleteConfirm(null);

    if (result.success) {
      setMessage({ type: 'success', text: 'Adres başarıyla silindi!' });
      await loadAddresses();
      onUpdate();
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Bir hata oluştu' });
    }
  };

  const handleSetDefault = async (addressId: string) => {
    setLoading(true);
    setMessage(null);

    const result = await setDefaultAddress(memberId, addressId);
    
    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Varsayılan adres güncellendi!' });
      await loadAddresses();
      onUpdate();
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Bir hata oluştu' });
    }
  };

  if (!isOpen) return null;

  // Map View
  if (view === 'map') {
    return (
      <AddressMapSelector
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
        initialLocation={
          formData.latitude && formData.longitude
            ? { lat: formData.latitude, lng: formData.longitude }
            : undefined
        }
        onLocationSelect={handleMapSelect}
        onClose={() => setView(selectedAddress ? 'edit' : 'add')}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-mealora-primary to-green-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  {view === 'list' ? 'Adres Yönetimi' : view === 'add' ? 'Yeni Adres Ekle' : 'Adresi Düzenle'}
                </h2>
                <p className="text-white/80 text-sm">
                  {view === 'list' 
                    ? `${addresses.length} kayıtlı adres` 
                    : 'Teslimat bilgilerinizi girin'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                setView('list');
                resetForm();
                setMessage(null);
              }}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
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

          {/* List View */}
          {view === 'list' && (
            <div className="space-y-4">
              {/* Add New Button */}
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => {
                  setView('add');
                  resetForm();
                  setMessage(null);
                }}
                className="w-full"
              >
                Yeni Adres Ekle
              </Button>

              {/* Address List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mealora-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Yükleniyor...</p>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Henüz kayıtlı adresiniz yok</p>
                  <p className="text-sm text-gray-500">Yeni adres ekleyerek başlayın</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`border rounded-xl p-4 transition-all ${
                        address.is_default
                          ? 'border-mealora-primary bg-mealora-primary/5 shadow-md'
                          : 'border-gray-200 hover:border-mealora-primary hover:shadow-md'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{address.title}</h3>
                          {address.is_default && (
                            <span className="flex items-center gap-1 text-xs bg-mealora-primary text-white px-2 py-1 rounded-full">
                              <Star className="w-3 h-3 fill-current" />
                              Varsayılan
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(address)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(address.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>

                      {/* Address Details */}
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <p className="font-medium text-gray-900">{address.full_name}</p>
                        <p>{address.phone}</p>
                        <p>{address.address_line1}</p>
                        {address.address_line2 && <p>{address.address_line2}</p>}
                        <p>{address.district}, {address.city}</p>
                        {address.postal_code && <p>Posta Kodu: {address.postal_code}</p>}
                      </div>

                      {/* Set Default Button */}
                      {!address.is_default && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          className="w-full"
                          disabled={loading}
                        >
                          Varsayılan Yap
                        </Button>
                      )}

                      {/* Delete Confirmation */}
                      {deleteConfirm === address.id && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800 mb-2">Bu adresi silmek istediğinizden emin misiniz?</p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteConfirm(null)}
                              className="flex-1"
                            >
                              İptal
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleDelete(address.id)}
                              className="flex-1 bg-red-600 hover:bg-red-700"
                              disabled={loading}
                            >
                              Sil
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add/Edit Form */}
          {(view === 'add' || view === 'edit') && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Map Button */}
              <Button
                type="button"
                variant="outline"
                icon={Map}
                onClick={() => setView('map')}
                className="w-full"
              >
                {formData.latitude && formData.longitude
                  ? 'Haritada Konumu Güncelle'
                  : 'Haritadan Konum Seç'}
              </Button>

              {formData.latitude && formData.longitude && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                  ✓ Konum haritadan seçildi
                </div>
              )}

              {/* Title */}
              <Input
                label="Adres Başlığı"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={errors.title}
                placeholder="Örn: Ev, İş, Ofis"
              />

              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Ad Soyad"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  error={errors.fullName}
                  placeholder="Alıcı adı soyadı"
                />
                <Input
                  label="Telefon"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={errors.phone}
                  placeholder="5XX XXX XX XX"
                />
              </div>

              {/* Address Lines */}
              <Input
                label="Adres Satırı 1"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                error={errors.addressLine1}
                placeholder="Cadde, sokak, bina no, daire no"
              />

              <Input
                label="Adres Satırı 2 (Opsiyonel)"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                placeholder="Ek adres bilgisi"
              />

              {/* City & District */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şehir
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-mealora-primary focus:border-transparent transition-all`}
                  >
                    <option value="">Şehir seçiniz</option>
                    {TURKISH_CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <Input
                  label="İlçe"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  error={errors.district}
                  placeholder="İlçe adı"
                />
              </div>

              {/* Postal Code */}
              <Input
                label="Posta Kodu (Opsiyonel)"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                error={errors.postalCode}
                placeholder="34XXX"
                maxLength={5}
              />

              {/* Default Address Checkbox */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-5 h-5 text-mealora-primary rounded focus:ring-2 focus:ring-mealora-primary"
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Bu adresi varsayılan adres olarak ayarla
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setView('list');
                    resetForm();
                    setMessage(null);
                  }}
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
                  {loading ? 'Kaydediliyor...' : view === 'edit' ? 'Güncelle' : 'Kaydet'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
