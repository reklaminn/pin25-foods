import { supabase } from './supabase';

export interface DeliveryLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

export interface CourierInfo {
  id: string;
  name: string;
  phone: string;
  vehicle_type: string;
  vehicle_plate: string;
  photo_url: string | null;
  rating: number;
}

export interface DeliveryTracking {
  id: string;
  order_id: string;
  courier_id: string | null;
  status: 'assigned' | 'picked_up' | 'in_transit' | 'nearby' | 'arrived' | 'delivered';
  current_location: DeliveryLocation | null;
  pickup_location: DeliveryLocation;
  delivery_location: DeliveryLocation;
  estimated_arrival: string | null;
  distance_remaining: number | null;
  route_polyline: string | null;
  started_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  delivery_photo_url: string | null;
  delivery_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeliveryTrackingWithDetails extends DeliveryTracking {
  courier?: CourierInfo;
  order?: any;
}

// Get delivery tracking for order
export async function getDeliveryTracking(orderId: string, memberId: string) {
  try {
    const { data, error } = await supabase
      .from('delivery_tracking')
      .select(`
        *,
        courier:couriers(*),
        order:orders(*)
      `)
      .eq('order_id', orderId)
      .single();

    if (error) {
      console.error('Get delivery tracking error:', error);
      return { success: false, error: 'Teslimat takibi bulunamadı' };
    }

    // Verify order belongs to member
    if (data.order.member_id !== memberId) {
      return { success: false, error: 'Yetkisiz erişim' };
    }

    return { success: true, tracking: data as DeliveryTrackingWithDetails };
  } catch (error) {
    console.error('Get delivery tracking error:', error);
    return { success: false, error: 'Teslimat takibi yüklenirken bir hata oluştu' };
  }
}

// Subscribe to real-time delivery location updates
export function subscribeToDeliveryLocation(
  orderId: string,
  callback: (location: DeliveryLocation) => void
) {
  const channel = supabase
    .channel(`delivery:${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'delivery_tracking',
        filter: `order_id=eq.${orderId}`
      },
      (payload) => {
        const tracking = payload.new as DeliveryTracking;
        if (tracking.current_location) {
          callback(tracking.current_location);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Calculate distance between two points (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Calculate ETA based on distance and average speed
export function calculateETA(distanceKm: number, averageSpeedKmh: number = 30): Date {
  const hours = distanceKm / averageSpeedKmh;
  const eta = new Date();
  eta.setMinutes(eta.getMinutes() + hours * 60);
  return eta;
}

// Format distance for display
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

// Format ETA for display
export function formatETA(eta: string | Date): string {
  const etaDate = typeof eta === 'string' ? new Date(eta) : eta;
  const now = new Date();
  const diffMinutes = Math.round((etaDate.getTime() - now.getTime()) / 60000);

  if (diffMinutes < 1) {
    return 'Çok yakında';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} dakika`;
  } else {
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours} saat ${minutes} dakika`;
  }
}

// Delivery status labels
export const DELIVERY_STATUS_LABELS = {
  assigned: 'Kurye Atandı',
  picked_up: 'Paket Alındı',
  in_transit: 'Yolda',
  nearby: 'Yakınınızda',
  arrived: 'Adresinizde',
  delivered: 'Teslim Edildi'
};

// Delivery status colors
export const DELIVERY_STATUS_COLORS = {
  assigned: 'bg-blue-100 text-blue-700',
  picked_up: 'bg-purple-100 text-purple-700',
  in_transit: 'bg-orange-100 text-orange-700',
  nearby: 'bg-yellow-100 text-yellow-700',
  arrived: 'bg-green-100 text-green-700',
  delivered: 'bg-green-100 text-green-700'
};

// Delivery status icons
export const DELIVERY_STATUS_ICONS = {
  assigned: '👤',
  picked_up: '📦',
  in_transit: '🚚',
  nearby: '📍',
  arrived: '🏠',
  delivered: '✅'
};
