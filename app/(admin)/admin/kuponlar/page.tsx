'use client';

import React from 'react';
import { Plus, Edit, Trash2, Tag, Copy } from 'lucide-react';

const coupons = [
  { 
    id: '1', 
    code: 'YENI25', 
    discount: '25%', 
    type: 'percentage',
    minOrder: '500₺',
    maxDiscount: '200₺',
    usage: 45,
    limit: 100,
    validUntil: '2025-02-28',
    active: true 
  },
  { 
    id: '2', 
    code: 'ILKSIPARISIM', 
    discount: '50₺', 
    type: 'fixed',
    minOrder: '300₺',
    maxDiscount: '-',
    usage: 128,
    limit: 200,
    validUntil: '2025-03-31',
    active: true 
  },
  { 
    id: '3', 
    code: 'KURUMSAL10', 
    discount: '10%', 
    type: 'percentage',
    minOrder: '1000₺',
    maxDiscount: '500₺',
    usage: 23,
    limit: 50,
    validUntil: '2025-04-30',
    active: true 
  },
  { 
    id: '4', 
    code: 'OCAK2025', 
    discount: '15%', 
    type: 'percentage',
    minOrder: '400₺',
    maxDiscount: '150₺',
    usage: 89,
    limit: 100,
    validUntil: '2025-01-31',
    active: false 
  },
];

export default function CouponsPage() {
  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kuponlar & İndirimler</h1>
          <p className="mt-1 text-sm text-gray-600">
            İndirim kuponlarını yönetin
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-mealora-primary text-white rounded-lg hover:bg-mealora-primary/90 transition-colors">
          <Plus size={20} />
          <span>Yeni Kupon Oluştur</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Toplam Kupon</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{coupons.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Aktif Kupon</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {coupons.filter(c => c.active).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Toplam Kullanım</p>
          <p className="text-2xl font-bold text-mealora-primary mt-1">
            {coupons.reduce((sum, c) => sum + c.usage, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Toplam İndirim</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">₺18,450</p>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {coupons.map((coupon) => {
          const usagePercent = (coupon.usage / coupon.limit) * 100;
          
          return (
            <div
              key={coupon.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-mealora-primary/10 rounded-lg">
                    <Tag className="text-mealora-primary" size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900 font-mono">{coupon.code}</h3>
                      <button
                        onClick={() => copyCouponCode(coupon.code)}
                        className="p-1 text-gray-400 hover:text-mealora-primary transition-colors"
                        title="Kodu kopyala"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      {coupon.type === 'percentage' ? 'Yüzde İndirim' : 'Sabit İndirim'}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  coupon.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {coupon.active ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">İndirim Miktarı</span>
                  <span className="font-bold text-mealora-primary text-lg">{coupon.discount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Min. Sipariş</span>
                  <span className="font-semibold text-gray-900">{coupon.minOrder}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Maks. İndirim</span>
                  <span className="font-semibold text-gray-900">{coupon.maxDiscount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Geçerlilik</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(coupon.validUntil).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>

              {/* Usage Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Kullanım</span>
                  <span>{coupon.usage} / {coupon.limit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      usagePercent >= 90 ? 'bg-red-500' :
                      usagePercent >= 70 ? 'bg-orange-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-mealora-primary text-white rounded-lg hover:bg-mealora-primary/90 transition-colors">
                  <Edit size={18} />
                  <span>Düzenle</span>
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
