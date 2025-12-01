'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Calendar, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import { voteOnReview, type ReviewWithDetails } from '@/lib/reviews';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ReviewDisplayProps {
  review: ReviewWithDetails;
  memberId?: string;
  showVoting?: boolean;
  onVoteUpdate?: () => void;
}

export default function ReviewDisplay({ 
  review, 
  memberId,
  showVoting = true,
  onVoteUpdate 
}: ReviewDisplayProps) {
  const [voting, setVoting] = useState(false);
  const [userVote, setUserVote] = useState(review.user_vote?.is_helpful);

  const handleVote = async (isHelpful: boolean) => {
    if (!memberId || voting) return;

    setVoting(true);
    const result = await voteOnReview(review.id, memberId, isHelpful);
    setVoting(false);

    if (result.success) {
      // Toggle vote if same, otherwise change
      if (userVote === isHelpful) {
        setUserVote(undefined);
      } else {
        setUserVote(isHelpful);
      }
      
      if (onVoteUpdate) onVoteUpdate();
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-mealora-primary to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {review.member?.first_name?.[0]}{review.member?.last_name?.[0]}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {review.member?.first_name} {review.member?.last_name}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDistanceToNow(new Date(review.created_at), {
                    addSuffix: true,
                    locale: tr
                  })}
                </span>
                {review.is_verified_purchase && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Doğrulanmış Alıcı</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          {renderStars(review.overall_rating, 'lg')}
          <p className="text-sm text-gray-600 mt-1">
            {review.overall_rating}/5
          </p>
        </div>
      </div>

      {/* Order Info */}
      {review.order && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Sipariş:</span> {review.order.order_number}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Paket:</span> {review.order.package_type} - {review.order.diet_type}
          </p>
        </div>
      )}

      {/* Title */}
      {review.title && (
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {review.title}
        </h3>
      )}

      {/* Comment */}
      {review.comment && (
        <p className="text-gray-700 mb-4 leading-relaxed">
          {review.comment}
        </p>
      )}

      {/* Category Ratings */}
      {(review.food_quality_rating || review.portion_size_rating || 
        review.packaging_rating || review.delivery_rating || review.value_rating) && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {review.food_quality_rating && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Yemek Kalitesi</p>
              {renderStars(review.food_quality_rating, 'sm')}
            </div>
          )}
          {review.portion_size_rating && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Porsiyon Büyüklüğü</p>
              {renderStars(review.portion_size_rating, 'sm')}
            </div>
          )}
          {review.packaging_rating && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Paketleme</p>
              {renderStars(review.packaging_rating, 'sm')}
            </div>
          )}
          {review.delivery_rating && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Teslimat</p>
              {renderStars(review.delivery_rating, 'sm')}
            </div>
          )}
          {review.value_rating && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Fiyat/Performans</p>
              {renderStars(review.value_rating, 'sm')}
            </div>
          )}
        </div>
      )}

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {review.photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.photo_url}
                alt={photo.caption || 'Değerlendirme fotoğrafı'}
                className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              />
            </div>
          ))}
        </div>
      )}

      {/* Admin Response */}
      {review.response && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-blue-900 mb-1">
                MEALORA Yanıtı
              </p>
              <p className="text-sm text-blue-800 leading-relaxed">
                {review.response.response_text}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                {formatDistanceToNow(new Date(review.response.created_at), {
                  addSuffix: true,
                  locale: tr
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Voting */}
      {showVoting && memberId && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Bu değerlendirme yardımcı oldu mu?
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={ThumbsUp}
              onClick={() => handleVote(true)}
              disabled={voting}
              className={userVote === true ? 'bg-green-50 border-green-500 text-green-700' : ''}
            >
              Evet ({review.helpful_count})
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={ThumbsDown}
              onClick={() => handleVote(false)}
              disabled={voting}
              className={userVote === false ? 'bg-red-50 border-red-500 text-red-700' : ''}
            >
              Hayır ({review.not_helpful_count})
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
