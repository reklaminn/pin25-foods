'use client';

import React, { useState } from 'react';
import { ShoppingCart, User, MapPin, CreditCard, Check, AlertCircle, Tag, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';

interface CheckoutFormData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Address
  address: string;
  district: string;
  city: string;
  postalCode: string;
  
  // Payment
  paymentMethod: 'credit-card' | 'bank-transfer' | 'cash-on-delivery' | '';
  
  // Credit Card
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  
  // Promo Code
  promoCode: string;
  
  // Terms
  termsAccepted: boolean;
  marketingAccepted: boolean;
}

const initialFormData: CheckoutFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  district: '',
  city: 'İstanbul',
  postalCode: '',
  paymentMethod: '',
  cardNumber: '',
  cardName: '',
  cardExpiry: '',
  cardCvv: '',
  promoCode: '',
  termsAccepted: false,
  marketingAccepted: false
};

// Mock promo codes
const PROMO_CODES = {
  'ILKSIPARIS': { discount: 15, description: 'İlk sipariş %15 indirim' },
  'YENI25': { discount: 25, description: 'Yeni müşteri %25 indirim' },
  'SAGLIK10': { discount: 10, description: '%10 indirim' },
};

// Mock cart data
const mockCartItem = {
  packageName: 'Akdeniz Tipi Beslenme',
  mealPlan: 'Sabah-Akşam (3 ana + 2 ara öğün)',
  calories: 1500,
  duration: 5,
  pricePerDay: 350,
  icon: '🫒'
};

export default function CheckoutPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [currentSection, setCurrentSection] = useState<'info' | 'address' | 'payment' | 'review'>('info');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; description: string } | null>(null);
  const [promoError, setPromoError] = useState('');

  // Calculate prices
  const subtotal = mockCartItem.pricePerDay * mockCartItem.duration;
  const discountAmount = appliedPromo ? Math.round(subtotal * appliedPromo.discount / 100) : 0;
  const deliveryFee = 0;
  const total = subtotal - discountAmount + deliveryFee;

  // Handle input change
  const handleChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Apply promo code
  const applyPromoCode = () => {
    const code = formData.promoCode.toUpperCase().trim();
    if (!code) {
      setPromoError('Lütfen bir promosyon kodu girin');
      return;
    }

    const promo = PROMO_CODES[code as keyof typeof PROMO_CODES];
    if (promo) {
      setAppliedPromo({ code, ...promo });
      setPromoError('');
    } else {
      setPromoError('Geçersiz promosyon kodu');
      setAppliedPromo(null);
    }
  };

  // Remove promo code
  const removePromoCode = () => {
    setAppliedPromo(null);
    setFormData(prev => ({ ...prev, promoCode: '' }));
    setPromoError('');
  };

  // Format card number
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  // Format expiry date
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  // Validate section
  const validateSection = (section: typeof currentSection): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (section === 'info') {
      if (!formData.firstName.trim()) newErrors.firstName = 'Ad gerekli';
      if (!formData.lastName.trim()) newErrors.lastName = 'Soyad gerekli';
      if (!formData.email.trim()) newErrors.email = 'Email gerekli';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Geçerli bir email girin';
      if (!formData.phone.trim()) newErrors.phone = 'Telefon gerekli';
      else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Geçerli bir telefon numarası girin';
    }

    if (section === 'address') {
      if (!formData.address.trim()) newErrors.address = 'Adres gerekli';
      if (!formData.district.trim()) newErrors.district = 'İlçe gerekli';
      if (!formData.city.trim()) newErrors.city = 'Şehir gerekli';
    }

    if (section === 'payment') {
      if (!formData.paymentMethod) newErrors.paymentMethod = 'Ödeme yöntemi seçin' as any;
      
      if (formData.paymentMethod === 'credit-card') {
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Kart numarası gerekli';
        else if (formData.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Geçerli bir kart numarası girin';
        if (!formData.cardName.trim()) newErrors.cardName = 'Kart üzerindeki isim gerekli';
        if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Son kullanma tarihi gerekli';
        else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) newErrors.cardExpiry = 'Geçerli bir tarih girin (AA/YY)';
        if (!formData.cardCvv.trim()) newErrors.cardCvv = 'CVV gerekli';
        else if (!/^\d{3,4}$/.test(formData.cardCvv)) newErrors.cardCvv = 'Geçerli bir CVV girin';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle section navigation
  const goToSection = (section: typeof currentSection) => {
    const sectionsOrder: (typeof currentSection)[] = ['info', 'address', 'payment', 'review'];
    const currentIndex = sectionsOrder.indexOf(currentSection);
    const targetIndex = sectionsOrder.indexOf(section);

    if (targetIndex > currentIndex) {
      if (!validateSection(currentSection)) {
        return;
      }
    }

    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      alert('Lütfen kullanım koşullarını kabul edin');
      return;
    }

    if (!validateSection('payment')) {
      return;
    }

    // Generate order number
    const orderNumber = 'MEA' + Date.now().toString().slice(-8);
    
    // Store order data in sessionStorage
    sessionStorage.setItem('lastOrder', JSON.stringify({
      orderNumber,
      customer: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone
      },
      address: {
        full: formData.address,
        district: formData.district,
        city: formData.city,
        postalCode: formData.postalCode
      },
      package: mockCartItem,
      payment: {
        method: formData.paymentMethod,
        subtotal,
        discount: discountAmount,
        total
      },
      promoCode: appliedPromo?.code || null,
      date: new Date().toISOString()
    }));

    // Redirect to success page
    router.push('/checkout/success');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Siparişi Tamamla
          </h1>
          <p className="text-lg text-gray-600">
            Sağlıklı yaşama bir adım kaldı
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentSection === 'info' ? 'bg-mealora-primary text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    <User className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold">Kişisel Bilgiler</h2>
                </div>
                {currentSection !== 'info' && formData.firstName && (
                  <button
                    onClick={() => setCurrentSection('info')}
                    className="text-mealora-primary hover:underline text-sm"
                  >
                    Düzenle
                  </button>
                )}
              </div>

              {currentSection === 'info' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Ad"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      error={errors.firstName}
                      placeholder="Adınız"
                    />
                    <Input
                      label="Soyad"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      error={errors.lastName}
                      placeholder="Soyadınız"
                    />
                  </div>
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email}
                    placeholder="ornek@email.com"
                  />
                  <Input
                    label="Telefon"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    error={errors.phone}
                    placeholder="5XX XXX XX XX"
                  />
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => goToSection('address')}
                    className="w-full"
                  >
                    Devam Et
                  </Button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">
                    <strong>{formData.firstName} {formData.lastName}</strong>
                  </p>
                  <p className="text-gray-600 text-sm">{formData.email}</p>
                  <p className="text-gray-600 text-sm">{formData.phone}</p>
                </div>
              )}
            </Card>

            {/* Delivery Address */}
            {(currentSection === 'address' || (currentSection !== 'info' && formData.address)) && (
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentSection === 'address' ? 'bg-mealora-primary text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold">Teslimat Adresi</h2>
                  </div>
                  {currentSection !== 'address' && formData.address && (
                    <button
                      onClick={() => setCurrentSection('address')}
                      className="text-mealora-primary hover:underline text-sm"
                    >
                      Düzenle
                    </button>
                  )}
                </div>

                {currentSection === 'address' ? (
                  <div className="space-y-4">
                    <Input
                      label="Adres"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      error={errors.address}
                      placeholder="Sokak, mahalle, bina no, daire no"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="İlçe"
                        value={formData.district}
                        onChange={(e) => handleChange('district', e.target.value)}
                        error={errors.district}
                        placeholder="Örn: Maslak"
                      />
                      <Input
                        label="Şehir"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        error={errors.city}
                        placeholder="İstanbul"
                      />
                    </div>
                    <Input
                      label="Posta Kodu (Opsiyonel)"
                      value={formData.postalCode}
                      onChange={(e) => handleChange('postalCode', e.target.value)}
                      placeholder="34000"
                    />
                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => setCurrentSection('info')}
                        className="flex-1"
                      >
                        Geri
                      </Button>
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => goToSection('payment')}
                        className="flex-1"
                      >
                        Devam Et
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{formData.address}</p>
                    <p className="text-gray-600 text-sm">
                      {formData.district}, {formData.city} {formData.postalCode}
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* Payment Method */}
            {(currentSection === 'payment' || currentSection === 'review') && (
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentSection === 'payment' ? 'bg-mealora-primary text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold">Ödeme Yöntemi</h2>
                  </div>
                  {currentSection === 'review' && formData.paymentMethod && (
                    <button
                      onClick={() => setCurrentSection('payment')}
                      className="text-mealora-primary hover:underline text-sm"
                    >
                      Düzenle
                    </button>
                  )}
                </div>

                {currentSection === 'payment' ? (
                  <div className="space-y-6">
                    {/* Payment Options */}
                    <div className="space-y-3">
                      {/* Credit Card */}
                      <button
                        onClick={() => handleChange('paymentMethod', 'credit-card')}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          formData.paymentMethod === 'credit-card'
                            ? 'border-mealora-primary bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-gray-600" />
                            <div>
                              <div className="font-bold">Kredi Kartı</div>
                              <div className="text-sm text-gray-600">Güvenli ödeme</div>
                            </div>
                          </div>
                          {formData.paymentMethod === 'credit-card' && (
                            <Check className="w-6 h-6 text-mealora-primary" />
                          )}
                        </div>
                      </button>

                      {/* Credit Card Form */}
                      {formData.paymentMethod === 'credit-card' && (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                          <Input
                            label="Kart Numarası"
                            value={formData.cardNumber}
                            onChange={(e) => {
                              const formatted = formatCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16));
                              handleChange('cardNumber', formatted);
                            }}
                            error={errors.cardNumber}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                          <Input
                            label="Kart Üzerindeki İsim"
                            value={formData.cardName}
                            onChange={(e) => handleChange('cardName', e.target.value.toUpperCase())}
                            error={errors.cardName}
                            placeholder="AD SOYAD"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Son Kullanma Tarihi"
                              value={formData.cardExpiry}
                              onChange={(e) => {
                                const formatted = formatExpiry(e.target.value);
                                handleChange('cardExpiry', formatted);
                              }}
                              error={errors.cardExpiry}
                              placeholder="AA/YY"
                              maxLength={5}
                            />
                            <Input
                              label="CVV"
                              type="password"
                              value={formData.cardCvv}
                              onChange={(e) => handleChange('cardCvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                              error={errors.cardCvv}
                              placeholder="123"
                              maxLength={4}
                            />
                          </div>
                        </div>
                      )}

                      {/* Bank Transfer */}
                      <button
                        onClick={() => handleChange('paymentMethod', 'bank-transfer')}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          formData.paymentMethod === 'bank-transfer'
                            ? 'border-mealora-primary bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 text-gray-600">🏦</div>
                            <div>
                              <div className="font-bold">Havale / EFT</div>
                              <div className="text-sm text-gray-600">Banka hesabına transfer</div>
                            </div>
                          </div>
                          {formData.paymentMethod === 'bank-transfer' && (
                            <Check className="w-6 h-6 text-mealora-primary" />
                          )}
                        </div>
                      </button>

                      {/* Bank Transfer Info */}
                      {formData.paymentMethod === 'bank-transfer' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-bold text-blue-900 mb-3">Banka Hesap Bilgileri</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-blue-700">Banka:</span>
                              <span className="font-medium text-blue-900">Garanti BBVA</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Hesap Adı:</span>
                              <span className="font-medium text-blue-900">MEALORA GIDA A.Ş.</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">IBAN:</span>
                              <span className="font-medium text-blue-900">TR12 3456 7890 1234 5678 9012 34</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Açıklama:</span>
                              <span className="font-medium text-blue-900">Ad Soyad - Telefon</span>
                            </div>
                          </div>
                          <p className="text-xs text-blue-700 mt-3">
                            * Havale/EFT sonrası dekont fotoğrafını WhatsApp üzerinden gönderiniz.
                          </p>
                        </div>
                      )}

                      {/* Cash on Delivery */}
                      <button
                        onClick={() => handleChange('paymentMethod', 'cash-on-delivery')}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          formData.paymentMethod === 'cash-on-delivery'
                            ? 'border-mealora-primary bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 text-gray-600">💵</div>
                            <div>
                              <div className="font-bold">Kapıda Ödeme</div>
                              <div className="text-sm text-gray-600">Nakit veya kart ile</div>
                            </div>
                          </div>
                          {formData.paymentMethod === 'cash-on-delivery' && (
                            <Check className="w-6 h-6 text-mealora-primary" />
                          )}
                        </div>
                      </button>

                      {/* Cash on Delivery Info */}
                      {formData.paymentMethod === 'cash-on-delivery' && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <h4 className="font-bold text-amber-900 mb-2">Kapıda Ödeme Bilgileri</h4>
                          <ul className="space-y-2 text-sm text-amber-800">
                            <li className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <span>İlk teslimat sırasında nakit veya kredi kartı ile ödeme yapabilirsiniz</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <span>Kurye yanında POS cihazı bulunmaktadır</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <span>Ödeme sonrası fatura email adresinize gönderilecektir</span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {errors.paymentMethod && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.paymentMethod}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => setCurrentSection('address')}
                        className="flex-1"
                      >
                        Geri
                      </Button>
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => goToSection('review')}
                        className="flex-1"
                      >
                        Devam Et
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 font-medium">
                      {formData.paymentMethod === 'credit-card' && '💳 Kredi Kartı'}
                      {formData.paymentMethod === 'bank-transfer' && '🏦 Havale / EFT'}
                      {formData.paymentMethod === 'cash-on-delivery' && '💵 Kapıda Ödeme'}
                    </p>
                    {formData.paymentMethod === 'credit-card' && formData.cardNumber && (
                      <p className="text-sm text-gray-600 mt-1">
                        **** **** **** {formData.cardNumber.slice(-4)}
                      </p>
                    )}
                  </div>
                )}
              </Card>
            )}

            {/* Terms & Submit */}
            {currentSection === 'review' && (
              <Card>
                <h2 className="text-2xl font-bold mb-6">Sipariş Onayı</h2>
                
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => handleChange('termsAccepted', e.target.checked)}
                      className="mt-1 w-5 h-5 text-mealora-primary rounded focus:ring-mealora-primary"
                    />
                    <span className="text-sm text-gray-700">
                      <a href="/kullanim-kosullari" className="text-mealora-primary hover:underline">
                        Kullanım koşullarını
                      </a>
                      {' '}ve{' '}
                      <a href="/gizlilik-politikasi" className="text-mealora-primary hover:underline">
                        gizlilik politikasını
                      </a>
                      {' '}okudum ve kabul ediyorum.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.marketingAccepted}
                      onChange={(e) => handleChange('marketingAccepted', e.target.checked)}
                      className="mt-1 w-5 h-5 text-mealora-primary rounded focus:ring-mealora-primary"
                    />
                    <span className="text-sm text-gray-700">
                      Kampanya ve duyurulardan haberdar olmak istiyorum.
                    </span>
                  </label>

                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => setCurrentSection('payment')}
                      className="flex-1"
                    >
                      Geri
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleSubmit}
                      disabled={!formData.termsAccepted}
                      className="flex-1"
                    >
                      Siparişi Tamamla
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card>
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingCart className="w-6 h-6 text-mealora-primary" />
                  <h2 className="text-2xl font-bold">Sipariş Özeti</h2>
                </div>

                {/* Package Details */}
                <div className="bg-mealora-cream rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-4xl">{mockCartItem.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{mockCartItem.packageName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{mockCartItem.mealPlan}</p>
                      <Badge variant="primary">{mockCartItem.calories} kalori</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Süre:</span>
                    <span className="font-medium">{mockCartItem.duration} gün</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promosyon Kodu
                  </label>
                  {appliedPromo ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">{appliedPromo.code}</p>
                          <p className="text-xs text-green-700">{appliedPromo.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.promoCode}
                        onChange={(e) => {
                          handleChange('promoCode', e.target.value.toUpperCase());
                          setPromoError('');
                        }}
                        placeholder="Kod giriniz"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
                      />
                      <Button
                        variant="outline"
                        onClick={applyPromoCode}
                        className="px-4"
                      >
                        Uygula
                      </Button>
                    </div>
                  )}
                  {promoError && (
                    <p className="text-sm text-red-600 mt-1">{promoError}</p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Ara Toplam</span>
                    <span>{subtotal}₺</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>İndirim ({appliedPromo?.discount}%)</span>
                      <span>-{discountAmount}₺</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-700">
                    <span>Teslimat</span>
                    <span className="text-green-600 font-medium">Ücretsiz</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold">Toplam</span>
                  <span className="text-3xl font-bold text-mealora-primary">{total}₺</span>
                </div>

                {/* Trust Badges */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Güvenli ödeme</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Ücretsiz teslimat</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>7/24 müşteri desteği</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
