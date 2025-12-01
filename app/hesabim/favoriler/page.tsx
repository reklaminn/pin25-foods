'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import FavoritesList from '@/components/member/favorites-list';

export default function FavoritesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser || currentUser.userType !== 'member') {
      router.push('/');
      return;
    }

    setUser(currentUser.user);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mealora-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Favori Yemeklerim</h1>
              <p className="text-gray-600">
                Beğendiğiniz yemeklere hızlıca erişin
              </p>
            </div>
          </div>
        </div>

        {/* Favorites List */}
        <FavoritesList
          memberId={user.id}
          onAddToCart={(meal) => {
            // TODO: Implement add to cart functionality
            console.log('Add to cart:', meal);
          }}
        />
      </div>
    </div>
  );
}
