'use client';

import React, { useState } from 'react';
import { Search, Filter, Eye, Trash2, Building2, Mail, Phone, Calendar } from 'lucide-react';

const corporateLeads = [
  {
    id: '1',
    company: 'ABC Teknoloji A.Ş.',
    contact: 'Ahmet Yılmaz',
    email: 'ahmet@abcteknoloji.com',
    phone: '+90 532 123 4567',
    employees: 150,
    message: 'Ofisimiz için günlük yemek servisi almak istiyoruz.',
    date: '2025-01-15',
    status: 'new'
  },
  {
    id: '2',
    company: 'XYZ Danışmanlık Ltd.',
    contact: 'Ayşe Demir',
    email: 'ayse@xyzdanismanlik.com',
    phone: '+90 533 234 5678',
    employees: 75,
    message: 'Haftalık paket fiyatları hakkında bilgi almak istiyorum.',
    date: '2025-01-14',
    status: 'contacted'
  },
  {
    id: '3',
    company: 'DEF Holding',
    contact: 'Mehmet Kaya',
    email: 'mehmet@defholding.com',
    phone: '+90 534 345 6789',
    employees: 300,
    message: '3 farklı lokasyonumuz için toplu anlaşma yapmak istiyoruz.',
    date: '2025-01-13',
    status: 'proposal'
  },
  {
    id: '4',
    company: 'GHI Yazılım',
    contact: 'Zeynep Arslan',
    email: 'zeynep@ghiyazilim.com',
    phone: '+90 535 456 7890',
    employees: 50,
    message: 'Startup ekibimiz için esnek paket seçenekleri arıyoruz.',
    date: '2025-01-12',
    status: 'new'
  },
];

const statusConfig = {
  new: { label: 'Yeni', color: 'bg-blue-100 text-blue-800' },
  contacted: { label: 'İletişimde', color: 'bg-yellow-100 text-yellow-800' },
  proposal: { label: 'Teklif Gönderildi', color: 'bg-purple-100 text-purple-800' },
  closed: { label: 'Anlaşma Yapıldı', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Reddedildi', color: 'bg-red-100 text-red-800' },
};

export default function CorporateLeadsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLeads = corporateLeads.filter(lead => {
    const matchesSearch = 
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kurumsal Başvurular</h1>
        <p className="mt-1 text-sm text-gray-600">
          Kurumsal müşteri başvurularını yönetin
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
                placeholder="Şirket, kişi veya e-posta ara..."
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
              <option value="contacted">İletişimde</option>
              <option value="proposal">Teklif Gönderildi</option>
              <option value="closed">Anlaşma Yapıldı</option>
              <option value="rejected">Reddedildi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Toplam Başvuru</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{corporateLeads.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Yeni</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {corporateLeads.filter(l => l.status === 'new').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Teklif Aşamasında</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {corporateLeads.filter(l => l.status === 'proposal').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Anlaşma Yapıldı</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {corporateLeads.filter(l => l.status === 'closed').length}
          </p>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Company Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-mealora-primary/10 rounded-lg">
                      <Building2 className="text-mealora-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{lead.company}</h3>
                      <p className="text-sm text-gray-600">{lead.employees} çalışan</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[lead.status as keyof typeof statusConfig].color}`}>
                    {statusConfig[lead.status as keyof typeof statusConfig].label}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} className="text-gray-400" />
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={16} className="text-gray-400" />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{new Date(lead.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-700 font-medium mb-1">Mesaj:</p>
                  <p className="text-sm text-gray-600">{lead.message}</p>
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
