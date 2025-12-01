'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingCart, Filter, Search } from 'lucide-react';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import {
  getMemberFavorites,
  removeFromFavorites,
  getFavoriteStatistics,
  type FavoriteMeal
} from '@/lib/favorites';
import { mealCategories } from '@/data/weekly-meals';

interface FavoritesListProps {
  memberId: string;
  onAddToCart?: (meal: FavoriteMeal) => void;
}

export default function FavoritesList({ memberId, onAddToCart }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<FavoriteMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
    loadStatistics();
  }, [memberId, categoryFilter]);

  const loadFavorites = async () => {
    setLoading(true);
    const result = await getMemberFavorites(memberId, {
      category: categoryFilter !== 'all' ? categoryFilter : undefined
    });

    if (result.success && result.favorites) {
      setFavorites(result.favorites);
    }
    setLoading(false);
  };

  const loadStatistics = async () => {
    const result = await getFavoriteStatistics(memberId);
    if (result.success) {
      setStatistics(result.statistics);
    }
  };

  const handleRemove = async (mealId: string) => {
    setDeletingId(mealId);
    const result = await removeFromFavorites(memberId, mealId);

    if (result.success) {
      await loadFavorites();
      await loadStatistics();
    }
    setDeletingId(null);
  };

  const filteredFavorites = favorites.filter((fav) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        fav.meal_name.toLowerCase().includes(query) ||
        fav.meal_description?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getCategoryInfo = (categoryId: string) => {
    return mealCategories.find((cat) => cat.id === categoryId);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mealora-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Favoriler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-red-50 to-pink-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Toplam Favori</p>
                <p className="text-3xl font-bold text-red-900">{statistics.total}</p>
              </div>
              <Heart className="w-12 h-12 text-red-500 opacity-50 fill-current" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Ortalama Kalori</p>
                <p className="text-3xl font-bold text-orange-900">
                  {statistics.avgCalories}
                </p>
              </div>
              <div className="text-4xl opacity-50">🔥</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">En Çok Favori</p>
                <p className="text-lg font-bold text-green-900">
                  {Object.entries(statistics.byCategory).sort(
                    ([, a], [, b]) => (b as number) - (a as number)
                  )[0]?.[0] || '-'}
                </p>
              </div>
              <div className="text-4xl opacity-50">⭐</div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Favori yemek ara..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
            >
              <option value="all">Tüm Kategoriler</option>
              {mealCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Favorites Grid */}
      {filteredFavorites.length === 0 ? (
        <Card className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery || categoryFilter !== 'all'
              ? 'Favori Bulunamadı'
              : 'Henüz Favori Eklemediniz'}
          </h3>
          <p className="text-gray-600">
            {searchQuery || categoryFilter !== 'all'
              ? 'Arama kriterlerinize uygun favori bulunamadı'
              : 'Beğendiğiniz yemekleri favorilere ekleyerek hızlıca erişebilirsiniz'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((favorite) => {
            const categoryInfo = getCategoryInfo(favorite.meal_category);

            return (
              <Card
                key={favorite.id}
                className="group hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-gray-200 overflow-hidden rounded-t-xl relative">
                  {favorite.meal_image ? (
                    <img
                      src={favorite.meal_image}
                      alt={favorite.meal_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {categoryInfo?.icon || '🍽️'}
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="neutral" className="backdrop-blur-sm bg-white/90">
                      {categoryInfo?.icon} {categoryInfo?.name}
                    </Badge>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(favorite.meal_id)}
                    disabled={deletingId === favorite.meal_id}
                    className="absolute top-3 right-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                  >
                    {deletingId === favorite.meal_id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">
                    {favorite.meal_name}
                  </h3>

                  {favorite.meal_description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {favorite.meal_description}
                    </p>
                  )}

                  {/* Nutritional Info */}
                  {favorite.kcal && (
                    <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-gray-100">
                      <span className="text-gray-600">Kalori</span>
                      <span className="font-bold text-gray-900">
                        {favorite.kcal} kcal
                      </span>
                    </div>
                  )}

                  {/* Notes */}
                  {favorite.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-yellow-800">{favorite.notes}</p>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  {onAddToCart && (
                    <Button
                      variant="primary"
                      icon={ShoppingCart}
                      onClick={() => onAddToCart(favorite)}
                      className="w-full"
                    >
                      Sepete Ekle
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
