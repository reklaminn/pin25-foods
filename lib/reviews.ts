import { supabase } from './supabase';

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

export interface OrderReview {
  id: string;
  order_id: string;
  member_id: string;
  overall_rating: number;
  food_quality_rating: number | null;
  portion_size_rating: number | null;
  packaging_rating: number | null;
  delivery_rating: number | null;
  value_rating: number | null;
  title: string | null;
  comment: string | null;
  status: ReviewStatus;
  moderation_notes: string | null;
  moderated_by: string | null;
  moderated_at: string | null;
  helpful_count: number;
  not_helpful_count: number;
  is_verified_purchase: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewPhoto {
  id: string;
  review_id: string;
  photo_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

export interface ReviewResponse {
  id: string;
  review_id: string;
  admin_id: string;
  response_text: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewWithDetails extends OrderReview {
  photos?: ReviewPhoto[];
  response?: ReviewResponse;
  member?: {
    first_name: string;
    last_name: string;
  };
  order?: {
    order_number: string;
    package_type: string;
    diet_type: string;
  };
  user_vote?: {
    is_helpful: boolean;
  };
}

// Check if order can be reviewed
export async function canReviewOrder(orderId: string, memberId: string) {
  try {
    // Check if order exists and is delivered
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status, delivered_at, member_id')
      .eq('id', orderId)
      .eq('member_id', memberId)
      .single();

    if (orderError || !order) {
      return { success: false, canReview: false, reason: 'Sipariş bulunamadı' };
    }

    if (order.status !== 'delivered') {
      return { success: false, canReview: false, reason: 'Sipariş henüz teslim edilmedi' };
    }

    // Check if already reviewed
    const { data: existingReview } = await supabase
      .from('order_reviews')
      .select('id')
      .eq('order_id', orderId)
      .single();

    if (existingReview) {
      return { success: false, canReview: false, reason: 'Bu sipariş için zaten değerlendirme yapılmış' };
    }

    return { success: true, canReview: true };
  } catch (error) {
    console.error('Can review order error:', error);
    return { success: false, canReview: false, reason: 'Bir hata oluştu' };
  }
}

// Create review
export async function createReview(reviewData: {
  orderId: string;
  memberId: string;
  overallRating: number;
  foodQualityRating?: number;
  portionSizeRating?: number;
  packagingRating?: number;
  deliveryRating?: number;
  valueRating?: number;
  title?: string;
  comment?: string;
  photos?: Array<{
    url: string;
    caption?: string;
  }>;
}) {
  try {
    // Check if can review
    const canReview = await canReviewOrder(reviewData.orderId, reviewData.memberId);
    if (!canReview.canReview) {
      return { success: false, error: canReview.reason };
    }

    // Create review
    const { data: review, error: reviewError } = await supabase
      .from('order_reviews')
      .insert({
        order_id: reviewData.orderId,
        member_id: reviewData.memberId,
        overall_rating: reviewData.overallRating,
        food_quality_rating: reviewData.foodQualityRating || null,
        portion_size_rating: reviewData.portionSizeRating || null,
        packaging_rating: reviewData.packagingRating || null,
        delivery_rating: reviewData.deliveryRating || null,
        value_rating: reviewData.valueRating || null,
        title: reviewData.title || null,
        comment: reviewData.comment || null,
        status: 'pending'
      })
      .select()
      .single();

    if (reviewError) {
      console.error('Create review error:', reviewError);
      return { success: false, error: 'Değerlendirme oluşturulamadı' };
    }

    // Add photos if provided
    if (reviewData.photos && reviewData.photos.length > 0) {
      const photos = reviewData.photos.map((photo, index) => ({
        review_id: review.id,
        photo_url: photo.url,
        caption: photo.caption || null,
        display_order: index
      }));

      const { error: photosError } = await supabase
        .from('review_photos')
        .insert(photos);

      if (photosError) {
        console.error('Add review photos error:', photosError);
      }
    }

    return { success: true, review };
  } catch (error) {
    console.error('Create review error:', error);
    return { success: false, error: 'Değerlendirme oluşturulamadı' };
  }
}

// Get review for order
export async function getOrderReview(orderId: string, memberId: string) {
  try {
    const { data: review, error } = await supabase
      .from('order_reviews')
      .select(`
        *,
        photos:review_photos(*),
        response:review_responses(*)
      `)
      .eq('order_id', orderId)
      .eq('member_id', memberId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: true, review: null };
      }
      console.error('Get order review error:', error);
      return { success: false, error: 'Değerlendirme yüklenemedi' };
    }

    return { success: true, review: review as ReviewWithDetails };
  } catch (error) {
    console.error('Get order review error:', error);
    return { success: false, error: 'Değerlendirme yüklenemedi' };
  }
}

// Update review
export async function updateReview(
  reviewId: string,
  memberId: string,
  updates: {
    overallRating?: number;
    foodQualityRating?: number;
    portionSizeRating?: number;
    packagingRating?: number;
    deliveryRating?: number;
    valueRating?: number;
    title?: string;
    comment?: string;
  }
) {
  try {
    const { data, error } = await supabase
      .from('order_reviews')
      .update({
        overall_rating: updates.overallRating,
        food_quality_rating: updates.foodQualityRating || null,
        portion_size_rating: updates.portionSizeRating || null,
        packaging_rating: updates.packagingRating || null,
        delivery_rating: updates.deliveryRating || null,
        value_rating: updates.valueRating || null,
        title: updates.title || null,
        comment: updates.comment || null
      })
      .eq('id', reviewId)
      .eq('member_id', memberId)
      .eq('status', 'pending')
      .select()
      .single();

    if (error) {
      console.error('Update review error:', error);
      return { success: false, error: 'Değerlendirme güncellenemedi' };
    }

    return { success: true, review: data };
  } catch (error) {
    console.error('Update review error:', error);
    return { success: false, error: 'Değerlendirme güncellenemedi' };
  }
}

// Delete review
export async function deleteReview(reviewId: string, memberId: string) {
  try {
    const { error } = await supabase
      .from('order_reviews')
      .delete()
      .eq('id', reviewId)
      .eq('member_id', memberId)
      .eq('status', 'pending');

    if (error) {
      console.error('Delete review error:', error);
      return { success: false, error: 'Değerlendirme silinemedi' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete review error:', error);
    return { success: false, error: 'Değerlendirme silinemedi' };
  }
}

// Vote on review (helpful/not helpful)
export async function voteOnReview(
  reviewId: string,
  memberId: string,
  isHelpful: boolean
) {
  try {
    // Check if already voted
    const { data: existingVote } = await supabase
      .from('review_helpful_votes')
      .select('id, is_helpful')
      .eq('review_id', reviewId)
      .eq('member_id', memberId)
      .single();

    if (existingVote) {
      // Update existing vote
      if (existingVote.is_helpful === isHelpful) {
        // Remove vote if same
        const { error } = await supabase
          .from('review_helpful_votes')
          .delete()
          .eq('id', existingVote.id);

        if (error) {
          console.error('Remove vote error:', error);
          return { success: false, error: 'Oy kaldırılamadı' };
        }
      } else {
        // Change vote
        const { error } = await supabase
          .from('review_helpful_votes')
          .update({ is_helpful: isHelpful })
          .eq('id', existingVote.id);

        if (error) {
          console.error('Update vote error:', error);
          return { success: false, error: 'Oy güncellenemedi' };
        }
      }
    } else {
      // Create new vote
      const { error } = await supabase
        .from('review_helpful_votes')
        .insert({
          review_id: reviewId,
          member_id: memberId,
          is_helpful: isHelpful
        });

      if (error) {
        console.error('Create vote error:', error);
        return { success: false, error: 'Oy verilemedi' };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Vote on review error:', error);
    return { success: false, error: 'Oy verilemedi' };
  }
}

// Get all reviews (for public display)
export async function getAllReviews(filters?: {
  minRating?: number;
  status?: ReviewStatus;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = supabase
      .from('order_reviews')
      .select(`
        *,
        photos:review_photos(*),
        response:review_responses(*),
        member:members(first_name, last_name),
        order:orders(order_number, package_type, diet_type)
      `)
      .eq('status', filters?.status || 'approved')
      .order('created_at', { ascending: false });

    if (filters?.minRating) {
      query = query.gte('overall_rating', filters.minRating);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Get all reviews error:', error);
      return { success: false, error: 'Değerlendirmeler yüklenemedi' };
    }

    return { success: true, reviews: data as ReviewWithDetails[] };
  } catch (error) {
    console.error('Get all reviews error:', error);
    return { success: false, error: 'Değerlendirmeler yüklenemedi' };
  }
}

// Get review statistics
export async function getReviewStatistics() {
  try {
    const { data: reviews, error } = await supabase
      .from('order_reviews')
      .select('overall_rating')
      .eq('status', 'approved');

    if (error) {
      console.error('Get review statistics error:', error);
      return { success: false, error: 'İstatistikler yüklenemedi' };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.overall_rating, 0);
    const average = total > 0 ? sum / total : 0;

    const distribution = {
      5: reviews.filter(r => r.overall_rating === 5).length,
      4: reviews.filter(r => r.overall_rating === 4).length,
      3: reviews.filter(r => r.overall_rating === 3).length,
      2: reviews.filter(r => r.overall_rating === 2).length,
      1: reviews.filter(r => r.overall_rating === 1).length
    };

    return {
      success: true,
      statistics: {
        total,
        average: Number(average.toFixed(1)),
        distribution
      }
    };
  } catch (error) {
    console.error('Get review statistics error:', error);
    return { success: false, error: 'İstatistikler yüklenemedi' };
  }
}

// Rating category labels
export const RATING_CATEGORIES = {
  food_quality: 'Yemek Kalitesi',
  portion_size: 'Porsiyon Büyüklüğü',
  packaging: 'Paketleme',
  delivery: 'Teslimat',
  value: 'Fiyat/Performans'
};

// Review status labels
export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: 'Onay Bekliyor',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
  flagged: 'İşaretlendi'
};

// Review status colors
export const REVIEW_STATUS_COLORS: Record<ReviewStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  flagged: 'bg-orange-100 text-orange-700'
};
