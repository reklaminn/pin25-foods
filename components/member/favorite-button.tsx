'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { addToFavorites, removeFromFavorites, isMealFavorited } from '@/lib/favorites';

interface FavoriteButtonProps {
  memberId: string;
  meal: {
    id: string;
    name: string;
    description?: string;
    image?: string;
    category: string;
    kcal?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onToggle?: (isFavorited: boolean) => void;
}

export default function FavoriteButton({
  memberId,
  meal,
  size = 'md',
  showLabel = false,
  onToggle
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkFavoriteStatus();
  }, [memberId, meal.id]);

  const checkFavoriteStatus = async () => {
    setChecking(true);
    const result = await isMealFavorited(memberId, meal.id);
    if (result.success) {
      setIsFavorited(result.isFavorited || false);
    }
    setChecking(false);
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);

    let result;
    if (isFavorited) {
      result = await removeFromFavorites(memberId, meal.id);
    } else {
      result = await addToFavorites(memberId, meal);
    }

    setLoading(false);

    if (result.success) {
      const newStatus = !isFavorited;
      setIsFavorited(newStatus);
      if (onToggle) onToggle(newStatus);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (checking) {
    return (
      <button
        disabled
        className={`${sizeClasses[size]} rounded-full bg-gray-100 flex items-center justify-center`}
      >
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-transparent"></div>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`
        ${sizeClasses[size]} rounded-full flex items-center justify-center gap-2
        transition-all duration-200 hover:scale-110
        ${isFavorited
          ? 'bg-red-500 text-white shadow-lg'
          : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 shadow-md'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${showLabel ? 'px-4 w-auto' : ''}
      `}
      title={isFavorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
    >
      <Heart
        className={`${iconSizes[size]} ${isFavorited ? 'fill-current' : ''}`}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {isFavorited ? 'Favorilerde' : 'Favorilere Ekle'}
        </span>
      )}
    </button>
  );
}
