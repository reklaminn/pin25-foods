'use client';

import React, { useState, useEffect } from 'react';
import { Star, Filter, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/card';
import ReviewDisplay from '@/components/member/review-display';
import ReviewStatistics from '@/components/member/review-statistics';
import { getAllReviews, type ReviewWithDetails } from '@/lib/reviews';
import { getCurrentUser } from '@/lib/auth';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [minRating, setMinRating] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.userType === 'member') {
      setCurrentUser(user.user);
    }
    loadReviews();
  }, [minRating]);

  const loadReviews = async () => {
    setLoading(true);
    const result = await getAllReviews({
      minRating: minRating > 0 ? minRating : undefined,
      limit: 20
    });
    
    if (result.success && result.reviews) {
      setReviews(result.reviews);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
            <Star className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Müşteri Değerlendirmeleri
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            MEALORA deneyimini yaşayan müşterilerimizin görüşleri
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Statistics */}
            <ReviewStatistics />

            {/* Filters */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <Filter className="w-5 h-5 text-mealora-primary" />
                <h3 className="text-lg font-bold text-gray-900">Filtrele</h3>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setMinRating(0)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    minRating === 0
                      ? 'bg-mealora-primary text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Tüm Değerlendirmeler
                </button>

                {[5, 4, 3].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      minRating === rating
                        ? 'bg-mealora-primary text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{rating} ve üzeri</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Trust Badge */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-green-900 mb-2">
                  Güvenilir Değerlendirmeler
                </h3>
                <p className="text-sm text-green-700">
                  Tüm değerlendirmeler doğrulanmış alıcılarımız tarafından yapılmıştır
                </p>
              </div>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mealora-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Değerlendirmeler yükleniyor...</p>
              </div>
            ) : reviews.length === 0 ? (
              <Card className="text-center py-12">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Değerlendirme Bulunamadı
                </h3>
                <p className="text-gray-600">
                  {minRating > 0
                    ? `${minRating} yıldız ve üzeri değerlendirme bulunmuyor`
                    : 'Henüz değerlendirme yapılmamış'}
                </p>
              </Card>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewDisplay
                    key={review.id}
                    review={review}
                    memberId={currentUser?.id}
                    showVoting={!!currentUser}
                    onVoteUpdate={loadReviews}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
