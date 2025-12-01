'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { faqs } from '@/data/faq';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sık Sorulan Sorular</h1>
          <p className="mt-1 text-sm text-gray-600">
            SSS içeriklerini yönetin
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-mealora-primary text-white rounded-lg hover:bg-mealora-primary/90 transition-colors">
          <Plus size={20} />
          <span>Yeni Soru Ekle</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Soru veya cevap ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Toplam Soru</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{faqs.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Filtrelenmiş</p>
          <p className="text-2xl font-bold text-mealora-primary mt-1">{filteredFAQs.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Kategoriler</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredFAQs.map((faq) => {
          const isExpanded = expandedId === faq.id;
          
          return (
            <div
              key={faq.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-gray-900 flex-1">
                        {faq.question}
                      </h3>
                      {isExpanded ? (
                        <ChevronUp className="text-mealora-primary flex-shrink-0" size={20} />
                      ) : (
                        <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                      )}
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
