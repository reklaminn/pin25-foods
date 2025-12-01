'use client';

import React, { useState, useMemo } from 'react';
import Section from '@/components/ui/section';
import Badge from '@/components/ui/badge';
import { 
  weeklyMeals, 
  mealCategories, 
  generateWeekOptions,
  WeeklyMeal
} from '@/data/weekly-meals';

export default function WeeklyMenuPage() {
  const weekOptions = useMemo(() => generateWeekOptions(), []);
  const [selectedWeek, setSelectedWeek] = useState(weekOptions[0].weekNumber);
  
  const filteredMeals = weeklyMeals.filter(meal => meal.week === selectedWeek);
  
  // Get category info for a meal
  const getCategoryInfo = (categoryId: string) => {
    return mealCategories.find(cat => cat.id === categoryId);
  };

  // Get category badge color
  const getCategoryBadgeClass = (categoryId: string) => {
    const colors: Record<string, string> = {
      'ready-made': 'bg-orange-100 text-orange-700 border-orange-200',
      'breakfast': 'bg-amber-100 text-amber-700 border-amber-200',
      'salads': 'bg-green-100 text-green-700 border-green-200',
      'snacks': 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors[categoryId] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <>
      {/* Week Selector - Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <Section className="py-4">
          <div className="flex items-center justify-center gap-3">
            {weekOptions.slice(0, 4).map((week, index) => {
              const isSelected = selectedWeek === week.weekNumber;
              const isCurrent = index === 0;
              
              return (
                <button
                  key={week.weekNumber}
                  onClick={() => setSelectedWeek(week.weekNumber)}
                  className={`
                    relative px-6 py-3 rounded-xl transition-all duration-200 min-w-[120px]
                    ${isSelected 
                      ? 'bg-gray-900 text-white shadow-lg scale-105' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {isCurrent && !isSelected && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-mealora-primary text-white text-xs rounded-full whitespace-nowrap">
                      Bu Hafta
                    </div>
                  )}
                  <div className="text-xs font-medium mb-1 opacity-80">
                    {week.label}
                  </div>
                  <div className="text-sm font-bold">
                    {week.startDate}
                  </div>
                </button>
              );
            })}
          </div>
        </Section>
      </div>

      {/* Hero Section */}
      <Section background="cream" className="pt-12 pb-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Esnek Haftalık Menümüzü Keşfedin
          </h1>
          <p className="text-xl text-gray-600">
            Bu hafta için hazırlanmış <span className="font-bold text-mealora-primary">{filteredMeals.length} farklı yemek</span> seçeneği
          </p>
        </div>
      </Section>

      {/* All Meals Grid - Single Flow */}
      <Section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.map((meal) => {
            const categoryInfo = getCategoryInfo(meal.category);
            
            return (
              <div 
                key={meal.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-gray-200 overflow-hidden relative">
                  <img 
                    src={meal.image} 
                    alt={meal.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Badge - Top Left */}
                  <div className="absolute top-3 left-3">
                    <span className={`
                      inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold
                      border backdrop-blur-sm bg-white/90
                      ${getCategoryBadgeClass(meal.category)}
                    `}>
                      {categoryInfo?.icon} {categoryInfo?.name}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="font-bold text-xl mb-2 text-gray-900">
                    {meal.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {meal.description}
                  </p>
                  
                  {/* Nutritional Tags */}
                  <div className="flex flex-wrap gap-2">
                    {/* Protein Badge */}
                    {meal.protein >= 30 && (
                      <Badge variant="success" className="text-xs font-medium">
                        💪 Yüksek Protein
                      </Badge>
                    )}
                    
                    {/* Low Carb Badge */}
                    {meal.carbs <= 30 && (
                      <Badge variant="primary" className="text-xs font-medium">
                        🌾 Düşük Karbonhidrat
                      </Badge>
                    )}
                    
                    {/* Fiber Badge */}
                    {meal.fiber >= 8 && (
                      <Badge variant="neutral" className="text-xs font-medium">
                        🥗 Lif Açısından Zengin
                      </Badge>
                    )}
                    
                    {/* Calorie Smart Badge */}
                    {meal.kcal <= 450 && (
                      <Badge className="text-xs font-medium bg-cyan-100 text-cyan-700 border-cyan-200">
                        ⚡ Kalori Akıllı
                      </Badge>
                    )}
                  </div>
                  
                  {/* Calories Display */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Kalori</span>
                      <span className="font-bold text-gray-900">{meal.kcal} kcal</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Info Section */}
      <Section background="beige" className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="font-bold text-2xl mb-6 text-center text-gray-900">
              💡 Haftalık Menü Hakkında
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-lg mb-2 text-gray-900">
                  📅 Menü Yayın Takvimi
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Menülerimiz her hafta Cuma günü, bir sonraki hafta için yayınlanır. 
                  Böylece önceden planlama yapabilir ve tercihlerinizi belirleyebilirsiniz.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-gray-900">
                  ⚠️ Alerjen Bilgisi
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Alerjen içerikleri her yemeğin detayında açıkça belirtilmiştir. 
                  Özel beslenme ihtiyaçlarınız için bizimle iletişime geçebilirsiniz.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-gray-900">
                  🚚 Teslimat Günleri
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Hafta içi 5 gün (Pazartesi-Cuma) teslimat yapılmaktadır. 
                  Her sabah 06:00-08:00 arası yemekleriniz kapınızda!
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-gray-900">
                  ❄️ Tazelik Garantisi
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Porsiyonlar soğuk zincir ile teslim edilir ve buzdolabında 
                  2 gün boyunca tazeliğini korur. Her öğünün üzerinde son kullanma tarihi belirtilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
