'use client';

import React from 'react';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';

const deliveryZones = [
  { id: '1', name: 'Maslak', active: true, minOrder: '0₺', deliveryFee: 'Ücretsiz', estimatedTime: '30-45 dk' },
  { id: '2', name: 'Levent', active: true, minOrder: '0₺', deliveryFee: 'Ücretsiz', estimatedTime: '30-45 dk' },
  { id: '3', name: 'Etiler', active: true, minOrder: '0₺', deliveryFee: 'Ücretsiz', estimatedTime: '35-50 dk' },
  { id: '4', name: 'Bomonti', active: true, minOrder: '0₺', deliveryFee: 'Ücretsiz', estimatedTime: '25-40 dk' },
  { id: '5', name: 'Kağıthane', active: true, minOrder: '0₺', deliveryFee: 'Ücretsiz', estimatedTime: '30-45 dk' },
  { id: '6', name: 'Zekeriyaköy', active: true, minOrder: '0₺', deliveryFee: 'Ücretsiz', estimatedTime: '40-55 dk' },
];

export default function DeliveryZonesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teslimat Bölgeleri</h1>
          <p className="mt-1 text-sm text-gray-600">
            Teslimat yapılan bölgeleri yönetin
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-mealora-primary text-white rounded-lg hover:bg-mealora-primary/90 transition-colors">
          <Plus size={20} />
          <span>Yeni Bölge Ekle</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Toplam Bölge</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{deliveryZones.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Aktif Bölge</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {deliveryZones.filter(z => z.active).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Ortalama Teslimat</p>
          <p className="text-2xl font-bold text-mealora-primary mt-1">35 dk</p>
        </div>
      </div>

      {/* Zones Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bölge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min. Sipariş
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teslimat Ücreti
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tahmini Süre
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deliveryZones.map((zone) => (
                <tr key={zone.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-mealora-primary/10 rounded-lg">
                        <MapPin className="text-mealora-primary" size={20} />
                      </div>
                      <span className="font-medium text-gray-900">{zone.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      zone.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {zone.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {zone.minOrder}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {zone.deliveryFee}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {zone.estimatedTime}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
