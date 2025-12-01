'use client';

import React from 'react';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';

const timeSlots = [
  { id: '1', name: 'Sabah Erken', time: '06:00 - 08:00', active: true, capacity: 50, booked: 38 },
  { id: '2', name: 'Sabah', time: '08:00 - 10:00', active: true, capacity: 40, booked: 32 },
  { id: '3', name: 'Öğle', time: '12:00 - 14:00', active: true, capacity: 30, booked: 28 },
  { id: '4', name: 'Akşam', time: '18:00 - 20:00', active: false, capacity: 25, booked: 0 },
];

export default function DeliveryTimeSlotsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teslimat Saatleri</h1>
          <p className="mt-1 text-sm text-gray-600">
            Teslimat zaman dilimlerini yönetin
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-mealora-primary text-white rounded-lg hover:bg-mealora-primary/90 transition-colors">
          <Plus size={20} />
          <span>Yeni Saat Ekle</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Toplam Slot</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{timeSlots.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Aktif Slot</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {timeSlots.filter(s => s.active).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Toplam Kapasite</p>
          <p className="text-2xl font-bold text-mealora-primary mt-1">
            {timeSlots.reduce((sum, slot) => sum + slot.capacity, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Doluluk Oranı</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">68%</p>
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {timeSlots.map((slot) => {
          const utilizationPercent = (slot.booked / slot.capacity) * 100;
          
          return (
            <div
              key={slot.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-mealora-primary/10 rounded-lg">
                    <Clock className="text-mealora-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{slot.name}</h3>
                    <p className="text-sm text-gray-600">{slot.time}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  slot.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {slot.active ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Kapasite</span>
                  <span className="font-semibold text-gray-900">{slot.capacity} teslimat</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rezerve</span>
                  <span className="font-semibold text-gray-900">{slot.booked} teslimat</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Müsait</span>
                  <span className="font-semibold text-mealora-primary">
                    {slot.capacity - slot.booked} teslimat
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Doluluk</span>
                  <span>{utilizationPercent.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      utilizationPercent >= 90 ? 'bg-red-500' :
                      utilizationPercent >= 70 ? 'bg-orange-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${utilizationPercent}%` }}
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
