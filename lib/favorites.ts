import { supabase } from './supabase';

export interface FavoriteMeal {
  id: string;
  member_id: string;
  meal_id: string;
  meal_name: string;
  meal_description: string | null;
  meal_image: string | null;
  meal_category: string;
  kcal: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  fiber: number | null;
  notes: string | null;
  created_at: string;
}

// Add meal to favorites
export async function addToFavorites(
  memberId: string,
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
  }
) {
  try {
    const { data, error } = await supabase
      .from('favorite_meals')
      .insert({
        member_id: memberId,
        meal_id: meal.id,
        meal_name: meal.name,
        meal_description: meal.description || null,
        meal_image: meal.image || null,
        meal_category: meal.category,
        kcal: meal.kcal || null,
        protein: meal.protein || null,
        carbs: meal.carbs || null,
        fat: meal.fat || null,
        fiber: meal.fiber || null
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'Bu yemek zaten favorilerinizde' };
      }
      console.error('Add to favorites error:', error);
      return { success: false, error: 'Favorilere eklenemedi' };
    }

    return { success: true, favorite: data };
  } catch (error) {
    console.error('Add to favorites error:', error);
    return { success: false, error: 'Favorilere eklenemedi' };
  }
}

// Remove meal from favorites
export async function removeFromFavorites(memberId: string, mealId: string) {
  try {
    const { error } = await supabase
      .from('favorite_meals')
      .delete()
      .eq('member_id', memberId)
      .eq('meal_id', mealId);

    if (error) {
      console.error('Remove from favorites error:', error);
      return { success: false, error: 'Favorilerden kaldırılamadı' };
    }

    return { success: true };
  } catch (error) {
    console.error('Remove from favorites error:', error);
    return { success: false, error: 'Favorilerden kaldırılamadı' };
  }
}

// Get all favorites for member
export async function getMemberFavorites(memberId: string, filters?: {
  category?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = supabase
      .from('favorite_meals')
      .select('*')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('meal_category', filters.category);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Get member favorites error:', error);
      return { success: false, error: 'Favoriler yüklenemedi' };
    }

    return { success: true, favorites: data as FavoriteMeal[] };
  } catch (error) {
    console.error('Get member favorites error:', error);
    return { success: false, error: 'Favoriler yüklenemedi' };
  }
}

// Check if meal is favorited
export async function isMealFavorited(memberId: string, mealId: string) {
  try {
    const { data, error } = await supabase
      .from('favorite_meals')
      .select('id')
      .eq('member_id', memberId)
      .eq('meal_id', mealId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: true, isFavorited: false };
      }
      console.error('Check favorite error:', error);
      return { success: false, error: 'Kontrol edilemedi' };
    }

    return { success: true, isFavorited: !!data };
  } catch (error) {
    console.error('Check favorite error:', error);
    return { success: false, error: 'Kontrol edilemedi' };
  }
}

// Get favorite count
export async function getFavoriteCount(memberId: string) {
  try {
    const { count, error } = await supabase
      .from('favorite_meals')
      .select('*', { count: 'exact', head: true })
      .eq('member_id', memberId);

    if (error) {
      console.error('Get favorite count error:', error);
      return { success: false, error: 'Sayı alınamadı' };
    }

    return { success: true, count: count || 0 };
  } catch (error) {
    console.error('Get favorite count error:', error);
    return { success: false, error: 'Sayı alınamadı' };
  }
}

// Update favorite notes
export async function updateFavoriteNotes(
  memberId: string,
  mealId: string,
  notes: string
) {
  try {
    const { data, error } = await supabase
      .from('favorite_meals')
      .update({ notes })
      .eq('member_id', memberId)
      .eq('meal_id', mealId)
      .select()
      .single();

    if (error) {
      console.error('Update favorite notes error:', error);
      return { success: false, error: 'Not güncellenemedi' };
    }

    return { success: true, favorite: data };
  } catch (error) {
    console.error('Update favorite notes error:', error);
    return { success: false, error: 'Not güncellenemedi' };
  }
}

// Get favorite statistics
export async function getFavoriteStatistics(memberId: string) {
  try {
    const { data, error } = await supabase
      .from('favorite_meals')
      .select('meal_category, kcal')
      .eq('member_id', memberId);

    if (error) {
      console.error('Get favorite statistics error:', error);
      return { success: false, error: 'İstatistikler alınamadı' };
    }

    const total = data.length;
    const byCategory = data.reduce((acc, fav) => {
      acc[fav.meal_category] = (acc[fav.meal_category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgCalories = data.length > 0
      ? data.reduce((sum, fav) => sum + (fav.kcal || 0), 0) / data.length
      : 0;

    return {
      success: true,
      statistics: {
        total,
        byCategory,
        avgCalories: Math.round(avgCalories)
      }
    };
  } catch (error) {
    console.error('Get favorite statistics error:', error);
    return { success: false, error: 'İstatistikler alınamadı' };
  }
}
