'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';
import { 
  weeklyMeals, 
  mealCategories, 
  generateWeekOptions,
  WeeklyMeal 
} from '@/data/weekly-meals';

interface MealFormData {
  name: string;
  description: string;
  category: string;
  image: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  allergens: string[];
}

const allergenOptions = [
  'Gluten', 'Süt', 'Yumurta', 'Balık', 'Fındık', 'Susam', 'Soya', 'Kabuklu Deniz Ürünleri'
];

export default function AdminWeeklyMenuPage() {
  const weekOptions = useMemo(() => generateWeekOptions(), []);
  const [selectedWeek, setSelectedWeek] = useState(weekOptions[0].weekNumber);
  const [showMealModal, setShowMealModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<WeeklyMeal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<MealFormData>({
    name: '',
    description: '',
    category: '',
    image: '',
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    allergens: []
  });

  const filteredMeals = weeklyMeals.filter(meal => meal.week === selectedWeek);
  
  const getMealsByCategory = (categoryId: string) => {
    return filteredMeals.filter(meal => meal.category === categoryId);
  };

  const handleAddMeal = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setEditingMeal(null);
    setFormData({
      name: '',
      description: '',
      category: categoryId,
      image: '',
      kcal: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      allergens: []
    });
    setShowMealModal(true);
  };

  const handleEditMeal = (meal: WeeklyMeal) => {
    setEditingMeal(meal);
    setFormData({
      name: meal.name,
      description: meal.description,
      category: meal.category,
      image: meal.image,
      kcal: meal.kcal,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      allergens: meal.allergens
    });
    setShowMealModal(true);
  };

  const handleSaveMeal = () => {
    // Mock save operation
    console.log('Saving meal:', formData);
    setShowMealModal(false);
  };

  const handleDeleteMeal = (mealId: string) => {
    if (confirm('Bu yemeği silmek istediğinizden emin misiniz?')) {
      console.log('Deleting meal:', mealId);
    }
  };

  const toggleAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const totalMeals = filteredMeals.length;
  const categoryStats = mealCategories.map(cat => ({
    ...cat,
    count: getMealsByCategory(cat.id).length
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Haftalık Menü Yönetimi</h1>
          <p className="mt-1 text-sm text-gray-600">
            Haftalık menü planlaması yapın ve yönetin
          </p>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Hafta Seçin</h3>
        <div className="flex flex-wrap gap-2">
          {weekOptions.map((week, index) => {
            const isSelected = selectedWeek === week.weekNumber;
            const isCurrent = index === 0;
            
            return (
              <button
                key={week.weekNumber}
                onClick={() => setSelectedWeek(week.weekNumber)}
                className={`
                  relative px-4 py-3 rounded-lg transition-all duration-200 border-2
                  ${isSelected 
                    ? 'bg-mealora-primary text-white border-mealora-primary' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-mealora-primary'
                  }
                `}
              >
                {isCurrent && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full whitespace-nowrap">
                    Bu Hafta
                  </div>
                )}
                <div className="text-xs font-medium mb-1">
                  {week.label}
                </div>
                <div className="text-sm font-bold">
                  {week.startDate}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Toplam Yemek</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalMeals}</p>
        </div>
        {categoryStats.map((cat) => (
          <div key={cat.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span>{cat.icon}</span>
              {cat.name}
            </p>
            <p className="text-2xl font-bold text-mealora-primary mt-1">{cat.count}</p>
          </div>
        ))}
      </div>

      {/* Meal Categories */}
      {mealCategories.map((category) => {
        const categoryMeals = getMealsByCategory(category.id);
        
        return (
          <div key={category.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Category Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {category.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddMeal(category.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-mealora-primary text-white rounded-lg hover:bg-mealora-primary/90 transition-colors"
                >
                  <Plus size={20} />
                  <span>Yemek Ekle</span>
                </button>
              </div>
            </div>

            {/* Meals Grid */}
            <div className="p-6">
              {categoryMeals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-3">
                    <ImageIcon size={48} className="mx-auto" />
                  </div>
                  <p className="text-gray-500 mb-4">
                    Bu kategoride henüz yemek eklenmemiş
                  </p>
                  <button
                    onClick={() => handleAddMeal(category.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-mealora-primary text-white rounded-lg hover:bg-mealora-primary/90 transition-colors"
                  >
                    <Plus size={20} />
                    <span>İlk Yemeği Ekle</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Image */}
                      <div className="aspect-video bg-gray-200 relative group">
                        <img 
                          src={meal.image} 
                          alt={meal.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditMeal(meal)}
                            className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Edit2 size={18} className="text-gray-700" />
                          </button>
                          <button
                            onClick={() => handleDeleteMeal(meal.id)}
                            className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-1">
                          {meal.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {meal.description}
                        </p>

                        {/* Nutrition */}
                        <div className="grid grid-cols-4 gap-2 mb-3">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Kalori</p>
                            <p className="text-sm font-bold text-mealora-primary">
                              {meal.kcal}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Protein</p>
                            <p className="text-sm font-bold text-gray-900">
                              {meal.protein}g
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Karb</p>
                            <p className="text-sm font-bold text-gray-900">
                              {meal.carbs}g
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Yağ</p>
                            <p className="text-sm font-bold text-gray-900">
                              {meal.fat}g
                            </p>
                          </div>
                        </div>

                        {/* Allergens */}
                        {meal.allergens.length > 0 && (
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">Alerjenler:</p>
                            <div className="flex flex-wrap gap-1">
                              {meal.allergens.map((allergen) => (
                                <span
                                  key={allergen}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                >
                                  {allergen}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Meal Modal */}
      {showMealModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingMeal ? 'Yemek Düzenle' : 'Yeni Yemek Ekle'}
              </h2>
              <button
                onClick={() => setShowMealModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yemek Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
                    placeholder="Örn: Izgara Somon & Kinoa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
                    placeholder="Yemeğin içeriğini kısaca açıklayın"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
                  >
                    <option value="">Kategori Seçin</option>
                    {mealCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Görsel URL *
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
                    placeholder="https://images.pexels.com/..."
                  />
                  {formData.image && (
                    <div className="mt-3 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={formData.image} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Nutrition Values */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Besin Değerleri
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Kalori (kcal) *
                    </label>
                    <input
                      type="number"
                      value={formData.kcal}
                      onChange={(e) => setFormData({ ...formData, kcal: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Protein (g) *
                    </label>
                    <input
                      type="number"
                      value={formData.protein}
                      onChange={(e) => setFormData({ ...formData, protein: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Karbonhidrat (g) *
                    </label>
                    <input
                      type="number"
                      value={formData.carbs}
                      onChange={(e) => setFormData({ ...formData, carbs: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Yağ (g) *
                    </label>
                    <input
                      type="number"
                      value={formData.fat}
                      onChange={(e) => setFormData({ ...formData, fat: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Allergens */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Alerjenler
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allergenOptions.map((allergen) => (
                    <button
                      key={allergen}
                      onClick={() => toggleAllergen(allergen)}
                      className={`
                        px-4 py-2 rounded-lg border-2 transition-colors
                        ${formData.allergens.includes(allergen)
                          ? 'bg-mealora-primary text-white border-mealora-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-mealora-primary'
                        }
                      `}
                    >
                      {allergen}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowMealModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSaveMeal}
                className="inline-flex items-center gap-2 px-6 py-2 bg-mealora-primary text-white rounded-lg hover:bg-mealora-primary/90 transition-colors"
              >
                <Save size={20} />
                <span>{editingMeal ? 'Güncelle' : 'Kaydet'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
