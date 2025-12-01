'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { dietTypes, mealConfigs, dietPackages } from '@/data/diet-packages';

export default function PackagesPage() {
  const [selectedDietType, setSelectedDietType] = useState('all');
  const [selectedMealConfig, setSelectedMealConfig] = useState('all');

  const filteredPackages = dietPackages.filter(pkg => {
    const matchesDiet = selectedDietType === 'all' || pkg.dietType === selectedDietType;
    const matchesMeal = selectedMealConfig === 'all' || pkg.mealConfig.id === selectedMealConfig;
    return matchesDiet && matchesMeal;
  });

  // Group packages by diet type and meal config
  const groupedPackages = dietTypes.map(diet => ({
    diet,
    mealConfigs: mealConfigs.map(config => ({
      config,
      packages: filteredPackages.filter(
        pkg => pkg.dietType === diet.id && pkg.mealConfig.id === config.id
      )
    })).filter(group => group.packages.length > 0)
  })).filter(group => group.mealConfigs.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Günlük Paketler</h1>
          <p className="mt-1 text-sm text-gray-600">
            Beslenme programlarını ve fiyatlandırmayı yönetin
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-mealora-primary text-white rounded-lg hover:bg-mealora-primary/90 transition-colors">
          <Plus size={20} />
          <span>Yeni Paket Ekle</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={selectedDietType}
              onChange={(e) => setSelectedDietType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
            >
              <option value="all">Tüm Beslenme Tipleri</option>
              {dietTypes.map(diet => (
                <option key={diet.id} value={diet.id}>
                  {diet.icon} {diet.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedMealConfig}
              onChange={(e) => setSelectedMealConfig(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
            >
              <option value="all">Tüm Öğün Düzenleri</option>
              {mealConfigs.map(config => (
                <option key={config.id} value={config.id}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Toplam Paket</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{dietPackages.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Beslenme Tipi</p>
          <p className="text-2xl font-bold text-mealora-primary mt-1">{dietTypes.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Öğün Düzeni</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{mealConfigs.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Filtrelenmiş</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{filteredPackages.length}</p>
        </div>
      </div>

      {/* Packages by Diet Type */}
      <div className="space-y-8">
        {groupedPackages.map(({ diet, mealConfigs: configs }) => (
          <div key={diet.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <span className="text-3xl">{diet.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{diet.name}</h2>
                <p className="text-sm text-gray-600">{diet.description}</p>
              </div>
            </div>

            <div className="space-y-6">
              {configs.map(({ config, packages: pkgs }) => (
                <div key={config.id}>
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg text-gray-900">{config.name}</h3>
                    <p className="text-sm text-gray-600">{config.description}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {pkgs.map((pkg) => (
                      <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        {pkg.highlight && (
                          <div className="inline-flex items-center px-2 py-1 rounded-full bg-mealora-primary text-white text-xs font-semibold mb-3">
                            ⭐ Popüler
                          </div>
                        )}

                        <div className="space-y-3 mb-4">
                          {pkg.calorieTiers.map((tier, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-semibold text-gray-900">{tier.calories} kalori</p>
                                <p className="text-xs text-gray-500">Günlük paket</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-mealora-primary">{tier.price}₺</p>
                                <p className="text-xs text-gray-500">/ gün</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-gray-200 pt-3 mb-4">
                          <p className="text-xs font-medium text-gray-700 mb-2">Örnek Menü:</p>
                          <ul className="space-y-1">
                            {pkg.sampleMenu.slice(0, 3).map((item, idx) => (
                              <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                                <span className="text-mealora-primary">•</span>
                                <span className="line-clamp-1">{item}</span>
                              </li>
                            ))}
                            {pkg.sampleMenu.length > 3 && (
                              <li className="text-xs text-gray-500 italic">
                                +{pkg.sampleMenu.length - 3} öğün daha...
                              </li>
                            )}
                          </ul>
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                            <Eye size={16} />
                            <span>Detay</span>
                          </button>
                          <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-mealora-primary text-white rounded-lg hover:bg-mealora-primary/90 transition-colors text-sm">
                            <Edit size={16} />
                            <span>Düzenle</span>
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
