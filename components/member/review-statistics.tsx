'use client';

import React, { useEffect, useState } from 'react';
import { Star, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/card';
import { getReviewStatistics } from '@/lib/reviews';

export default function ReviewStatistics() {
  const [statistics, setStatistics] = useState<{
    total: number;
    average: number;
    distribution: Record<number, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    const result = await getReviewStatistics();
    
    if (result.success && result.statistics) {
      setStatistics(result.statistics);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!statistics) {
    return null;
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getPercentage = (count: number) => {
    return statistics.total > 0 ? (count / statistics.total) * 100 : 0;
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <Star className="w-6 h-6 text-white fill-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Müşteri Değerlendirmeleri
          </h3>
          <p className="text-sm text-gray-600">
            {statistics.total} değerlendirme
          </p>
        </div>
      </div>

      {/* Average Rating */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 mb-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {statistics.average}
          </div>
          <div className="flex justify-center mb-2">
            {renderStars(Math.round(statistics.average))}
          </div>
          <p className="text-sm text-gray-600">
            5 üzerinden {statistics.average} puan
          </p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = statistics.distribution[rating] || 0;
          const percentage = getPercentage(count);

          return (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium text-gray-700">{rating}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
              
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <span className="text-sm text-gray-600 w-12 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Trend Indicator */}
      {statistics.average >= 4.5 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-5 h-5" />
            <p className="text-sm font-medium">
              Müşterilerimiz MEALORA'yı çok seviyor! 🎉
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
