'use client';

import React, { useState } from 'react';
import { Search, Filter, Eye, Trash2, Mail, Phone, Calendar, MessageSquare } from 'lucide-react';

const contactSubmissions = [
  {
    id: '1',
    name: 'Elif Yılmaz',
    email: 'elif@example.com',
    phone: '+90 532 111 2233',
    subject: 'Paket fiyatları hakkında',
    message: 'Merhaba, 10 günlük paket fiyatları hakkında detaylı bilgi alabilir miyim?',
    date: '2025-01-15 14:30',
    status: 'new'
  },
  {
    id: '2',
    name: 'Can Demir',
    email: 'can@example.com',
    phone: '+90 533 222 3344',
    subject: 'Teslimat bölgesi',
    message: 'Beşiktaş bölgesine teslimat yapıyor musunuz?',
    date: '2025-01-15 11:20',
    status: 'replied'
  },
  {
    id: '3',
    name: 'Selin Kaya',
    email: 'selin@example.com',
    phone: '+90 534 333 4455',
    subject: 'Alerji bilgisi',
    message: 'Gluten alerjim var, menülerinizde gluten içermeyen seçenekler var mı?',
    date: '2025-01-14 16:45',
    status: 'new'
  },
  {
    id: '4',
    name: 'Burak Arslan',
    email: 'burak@example.com',
    phone: '+90 535 444 5566',
    subject: 'İptal işlemi',
    message: 'Aboneliğimi iptal etmek istiyorum, nasıl bir işlem yapmalıyım?',
    date: '2025-01-14 09:15',
    status: 'replied'
  },
  {
    id: '5',
    name: 'Deniz Öztürk',
    email: 'deniz@example.com',
    phone: '+90 536 555 6677',
    subject: 'Menü değişikliği',
    message: 'Bu haftaki menüde değişiklik yapabilir miyim?',
    date: '2025-01-13 13:00',
    status: 'new'
  },
];

const statusConfig = {
  new: { label: 'Yeni', color: 'bg-blue-100 text-blue-800' },
  replied: { label: 'Cevaplandı', color: 'bg-green-100 text-green-800' },
  archived: { label: 'Arşivlendi', color: 'bg-gray-100 text-gray-800' },
};

export default function ContactSubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredSubmissions = contactSubmissions.filter(submission => {
    const matchesSearch = 
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">İletişim Formları</h1>
        <p className="mt-1 text-sm text-gray-600">
          Gelen iletişim form başvurularını yönetin
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="İsim, e-posta veya konu ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="new">Yeni</option>
              <option value="replied">Cevaplandı</option>
              <option value="archived">Arşivlendi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Toplam Mesaj</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{contactSubmissions.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Yeni</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {contactSubmissions.filter(s => s.status === 'new').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Cevaplandı</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {contactSubmissions.filter(s => s.status === 'replied').length}
          </p>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <div
            key={submission.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Contact Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-mealora-primary/10 rounded-lg">
                      <MessageSquare className="text-mealora-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{submission.name}</h3>
                      <p className="text-sm font-medium text-mealora-primary">{submission.subject}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[submission.status as keyof typeof statusConfig].color}`}>
                    {statusConfig[submission.status as keyof typeof statusConfig].label}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} className="text-gray-400" />
                    <span>{submission.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={16} className="text-gray-400" />
                    <span>{submission.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{submission.date}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-700 font-medium mb-1">Mesaj:</p>
                  <p className="text-sm text-gray-600">{submission.message}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-2">
                <button className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-mealora-primary text-white rounded-lg hover:bg-mealora-primary/90 transition-colors">
                  <Eye size={18} />
                  <span>Detay</span>
                </button>
                <button className="flex-1 lg:flex-none p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
