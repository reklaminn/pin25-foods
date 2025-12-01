'use client';

import React, { useState, useEffect } from 'react';
import { X, Star, Upload, Image as ImageIcon, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
  createReview,
  updateReview,
  canReviewOrder,
  RATING_CATEGORIES,
  type OrderReview
} from '@/lib/reviews';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  memberId: string;
  existingReview?: OrderReview | null;
  onSuccess?: () => void;
}

export default function ReviewFormModal({
  isOpen,
  onClose,
  orderId,
  memberId,
  existingReview,
  onSuccess
}: ReviewFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [canReview, setCanReview] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form state
  const [overallRating, setOverallRating] = useState(existingReview?.overall_rating || 0);
  const [categoryRatings, setCategoryRatings] = useState({
    food_quality: existingReview?.food_quality_rating || 0,
    portion_size: existingReview?.portion_size_rating || 0,
    packaging: existingReview?.packaging_rating || 0,
    delivery: existingReview?.delivery_rating || 0,
    value: existingReview?.value_rating || 0
  });
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [photos, setPhotos] = useState<Array<{ url: string; caption: string }>>([]);

  useEffect(() => {
    if (isOpen && !existingReview) {
      checkCanReview();
    }
  }, [isOpen, orderId, memberId]);

  const checkCanReview = async () => {
    const result = await canReviewOrder(orderId, memberId);
    setCanReview(result.canReview);
    if (!result.canReview) {
      setMessage({ type: 'error', text: result.reason || 'Bu sipariş değerlendirilemez' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (overallRating === 0) {
      setMessage({ type: 'error', text: 'Lütfen genel puanınızı verin' });
      return;
    }

    if (comment && comment.length < 10) {
      setMessage({ type: 'error', text: 'Yorumunuz en az 10 karakter olmalıdır' });
      return;
    }

    setLoading(true);
    setMessage(null);

    let result;
    if (existingReview) {
      // Update existing review
      result = await updateReview(existingReview.id, memberId, {
        overallRating,
        foodQualityRating: categoryRatings.food_quality || undefined,
        portionSizeRating: categoryRatings.portion_size || undefined,
        packagingRating: categoryRatings.packaging || undefined,
        deliveryRating: categoryRatings.delivery || undefined,
        valueRating: categoryRatings.value || undefined,
        title: title || undefined,
        comment: comment || undefined
      });
    } else {
      // Create new review
      result = await createReview({
        orderId,
        memberId,
        overallRating,
        foodQualityRating: categoryRatings.food_quality || undefined,
        portionSizeRating: categoryRatings.portion_size || undefined,
        packagingRating: categoryRatings.packaging || undefined,
        deliveryRating: categoryRatings.delivery || undefined,
        valueRating: categoryRatings.value || undefined,
        title: title || undefined,
        comment: comment || undefined,
        photos: photos.length > 0 ? photos : undefined
      });
    }

    setLoading(false);

    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: existingReview 
          ? 'Değerlendirmeniz güncellendi!' 
          : 'Değerlendirmeniz alındı! Onaylandıktan sonra yayınlanacaktır.' 
      });
      
      if (onSuccess) onSuccess();
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Bir hata oluştu' });
    }
  };

  const renderStarRating = (
    rating: number,
    onChange: (rating: number) => void,
    label: string
  ) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-600 self-center">
              {rating}/5
            </span>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-mealora-primary to-green-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  {existingReview ? 'Değerlendirmeyi Düzenle' : 'Sipariş Değerlendirmesi'}
                </h2>
                <p className="text-white/80 text-sm">Deneyiminizi bizimle paylaşın</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {!canReview && !existingReview ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <p className="text-gray-600">{message?.text}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Message */}
              {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <p className="font-medium">{message.text}</p>
                </div>
              )}

              {/* Overall Rating */}
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Genel Değerlendirme *
                </h3>
                {renderStarRating(overallRating, setOverallRating, 'Genel puanınız')}
              </Card>

              {/* Category Ratings */}
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Detaylı Değerlendirme
                </h3>
                <div className="space-y-4">
                  {Object.entries(RATING_CATEGORIES).map(([key, label]) => (
                    <div key={key}>
                      {renderStarRating(
                        categoryRatings[key as keyof typeof categoryRatings],
                        (rating) => setCategoryRatings(prev => ({ ...prev, [key]: rating })),
                        label
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık (İsteğe Bağlı)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Değerlendirmenize bir başlık verin"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
                  maxLength={100}
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yorumunuz (İsteğe Bağlı)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Deneyiminizi detaylı olarak anlatın (en az 10 karakter)"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
                  rows={5}
                  minLength={10}
                />
                {comment && (
                  <p className="text-sm text-gray-600 mt-1">
                    {comment.length} karakter
                  </p>
                )}
              </div>

              {/* Photos (only for new reviews) */}
              {!existingReview && (
                <Card>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Fotoğraf Ekle (İsteğe Bağlı)
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Yemeklerinizin fotoğraflarını paylaşın
                  </p>
                  
                  {photos.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo.url}
                            alt={`Fotoğraf ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    icon={Upload}
                    className="w-full"
                    disabled={photos.length >= 5}
                  >
                    Fotoğraf Yükle (Maks. 5)
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Not: Fotoğraf yükleme özelliği yakında aktif olacaktır
                  </p>
                </Card>
              )}

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={loading || overallRating === 0}
                >
                  {loading ? 'Gönderiliyor...' : existingReview ? 'Güncelle' : 'Gönder'}
                </Button>
              </div>

              {!existingReview && (
                <p className="text-xs text-gray-500 text-center">
                  Değerlendirmeniz moderasyon sonrası yayınlanacaktır
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
