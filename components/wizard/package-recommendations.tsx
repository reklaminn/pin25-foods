'use client';

import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { UserSelections } from '@/data/wizard-data';

interface PackageRecommendationsProps {
  selections: UserSelections;
  onPackageSelect: (packageData: any) => void;
}

interface Package {
  id: string;
  name: string;
  icon: string;
  description: string;
  features: string[];
  calories: number;
  mealPlan: string;
  pricePerDay: number;
  duration: number;
  recommended?: boolean;
}

export default function PackageRecommendations({ selections, onPackageSelect }: PackageRecommendationsProps) {
  // Generate package recommendations based on selections
  const getRecommendedPackages = (): Package[] => {
    const packages: Package[] = [];

    // Determine diet type
    const dietType = selections.dietType || 'balanced';
    
    // Determine calories
    const caloriesMap: { [key: string]: number } = {
      '1200-1400': 1300,
      '1400-1600': 1500,
      '1600-1800': 1700,
      '1800-2000': 1900,
      '2000+': 2100
    };
    const targetCalories = caloriesMap[selections.calories || '1400-1600'];

    // Determine meal plan
    const mealPlanMap: { [key: string]: string } = {
      'breakfast-lunch-dinner': 'Sabah-Öğle-Akşam (3 ana + 2 ara öğün)',
      'breakfast-dinner': 'Sabah-Akşam (2 ana + 2 ara öğün)',
      'lunch-dinner': 'Öğle-Akşam (2 ana + 2 ara öğün)',
      'all-meals': 'Tüm Öğünler (3 ana + 3 ara öğün)'
    };
    const mealPlan = mealPlanMap[selections.mealPlan || 'breakfast-dinner'];

    // Base package structure
    const basePackages = [
      {
        id: 'mediterranean',
        name: 'Akdeniz Tipi Beslenme',
        icon: '🫒',
        description: 'Zeytinyağı, balık ve sebze ağırlıklı sağlıklı beslenme',
        features: [
          'Omega-3 açısından zengin',
          'Kalp sağlığını destekler',
          'Anti-inflamatuar etkili',
          'Taze sebze ve meyveler'
        ]
      },
      {
        id: 'protein-focused',
        name: 'Protein Odaklı',
        icon: '🥩',
        description: 'Yüksek protein içerikli, kas gelişimini destekleyen',
        features: [
          'Yüksek protein oranı',
          'Kas gelişimini destekler',
          'Tokluk hissi sağlar',
          'Spor yapanlar için ideal'
        ]
      },
      {
        id: 'vegetarian',
        name: 'Vejetaryen',
        icon: '🥗',
        description: 'Et içermeyen, bitkisel protein kaynaklı',
        features: [
          'Bitkisel protein kaynakları',
          'Lif açısından zengin',
          'Çevre dostu',
          'Hafif ve sağlıklı'
        ]
      },
      {
        id: 'balanced',
        name: 'Dengeli Beslenme',
        icon: '🍽️',
        description: 'Tüm besin gruplarından dengeli oranlarda',
        features: [
          'Dengeli makro oranları',
          'Çeşitli besin grupları',
          'Sürdürülebilir',
          'Herkes için uygun'
        ]
      }
    ];

    // Filter and customize packages based on selections
    let filteredPackages = basePackages;

    // Filter based on diet type
    if (dietType === 'vegetarian') {
      filteredPackages = filteredPackages.filter(p => 
        p.id === 'vegetarian' || p.id === 'mediterranean' || p.id === 'balanced'
      );
    } else if (dietType === 'keto') {
      filteredPackages = filteredPackages.filter(p => 
        p.id === 'protein-focused' || p.id === 'balanced'
      );
    }

    // Filter based on avoided proteins
    if (selections.avoidProteins.includes('red-meat')) {
      filteredPackages = filteredPackages.filter(p => p.id !== 'protein-focused');
    }

    // Add package details
    packages.push(...filteredPackages.map((pkg, index) => ({
      ...pkg,
      calories: targetCalories,
      mealPlan: mealPlan,
      pricePerDay: 300 + (index * 50),
      duration: 5,
      recommended: index === 0
    })));

    return packages;
  };

  const recommendedPackages = getRecommendedPackages();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-mealora-cream px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-5 h-5 text-mealora-primary" />
          <span className="text-sm font-medium text-mealora-primary">
            Sizin İçin Özel Seçtik
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Önerilen Paketler
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tercihlerinize göre en uygun beslenme paketlerini hazırladık
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {recommendedPackages.map((pkg) => (
          <Card 
            key={pkg.id}
            className={`relative ${pkg.recommended ? 'ring-2 ring-mealora-primary' : ''}`}
          >
            {pkg.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="primary" className="shadow-lg">
                  ⭐ Önerilen
                </Badge>
              </div>
            )}

            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{pkg.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
              <p className="text-gray-600">{pkg.description}</p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {pkg.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Package Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Kalori:</span>
                <span className="font-medium">{pkg.calories} kcal/gün</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Öğün Planı:</span>
                <span className="font-medium">{pkg.mealPlan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Süre:</span>
                <span className="font-medium">{pkg.duration} gün</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Günlük</p>
                <p className="text-3xl font-bold text-mealora-primary">
                  {pkg.pricePerDay}₺
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Toplam</p>
                <p className="text-xl font-bold">
                  {pkg.pricePerDay * pkg.duration}₺
                </p>
              </div>
            </div>

            {/* Select Button */}
            <Button
              variant={pkg.recommended ? 'primary' : 'outline'}
              size="lg"
              onClick={() => onPackageSelect({
                packageName: pkg.name,
                packageId: pkg.id,
                icon: pkg.icon,
                calories: pkg.calories,
                mealPlan: pkg.mealPlan,
                pricePerDay: pkg.pricePerDay,
                duration: pkg.duration
              })}
              className="w-full"
            >
              Bu Paketi Seç
            </Button>
          </Card>
        ))}
      </div>

      {/* Info Box */}
      <Card className="bg-gradient-to-br from-mealora-primary to-green-700 text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Tüm Paketlerde Dahil
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">🚚</div>
              <p className="font-medium mb-1">Ücretsiz Teslimat</p>
              <p className="text-sm text-white/80">Her gün kapınıza</p>
            </div>
            <div>
              <div className="text-3xl mb-2">👨‍🍳</div>
              <p className="font-medium mb-1">Profesyonel Şefler</p>
              <p className="text-sm text-white/80">Uzman ekip tarafından</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🥗</div>
              <p className="font-medium mb-1">Taze Malzemeler</p>
              <p className="text-sm text-white/80">Günlük tedarik</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
