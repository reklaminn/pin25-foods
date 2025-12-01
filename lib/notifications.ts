import { supabase } from './supabase';

export type NotificationType = 
  | 'order_update' 
  | 'delivery_update' 
  | 'payment_update' 
  | 'promotion' 
  | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  member_id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  data: Record<string, any>;
  is_read: boolean;
  is_archived: boolean;
  action_url: string | null;
  created_at: string;
  read_at: string | null;
}

export interface PushSubscription {
  id: string;
  member_id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  user_agent: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

// Get member notifications
export async function getMemberNotifications(
  memberId: string,
  filters?: {
    type?: NotificationType;
    isRead?: boolean;
    limit?: number;
  }
) {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('member_id', memberId)
      .eq('is_archived', false)
      .order('created_at', { ascending: false });

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.isRead !== undefined) {
      query = query.eq('is_read', filters.isRead);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Get notifications error:', error);
      return { success: false, error: 'Bildirimler yüklenirken bir hata oluştu' };
    }

    return { success: true, notifications: data as Notification[] };
  } catch (error) {
    console.error('Get notifications error:', error);
    return { success: false, error: 'Bildirimler yüklenirken bir hata oluştu' };
  }
}

// Get unread notification count
export async function getUnreadNotificationCount(memberId: string) {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('member_id', memberId)
      .eq('is_read', false)
      .eq('is_archived', false);

    if (error) {
      console.error('Get unread count error:', error);
      return { success: false, count: 0 };
    }

    return { success: true, count: count || 0 };
  } catch (error) {
    console.error('Get unread count error:', error);
    return { success: false, count: 0 };
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string, memberId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .eq('member_id', memberId);

    if (error) {
      console.error('Mark as read error:', error);
      return { success: false, error: 'Bildirim güncellenemedi' };
    }

    return { success: true };
  } catch (error) {
    console.error('Mark as read error:', error);
    return { success: false, error: 'Bildirim güncellenemedi' };
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(memberId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('member_id', memberId)
      .eq('is_read', false);

    if (error) {
      console.error('Mark all as read error:', error);
      return { success: false, error: 'Bildirimler güncellenemedi' };
    }

    return { success: true };
  } catch (error) {
    console.error('Mark all as read error:', error);
    return { success: false, error: 'Bildirimler güncellenemedi' };
  }
}

// Archive notification
export async function archiveNotification(notificationId: string, memberId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_archived: true })
      .eq('id', notificationId)
      .eq('member_id', memberId);

    if (error) {
      console.error('Archive notification error:', error);
      return { success: false, error: 'Bildirim arşivlenemedi' };
    }

    return { success: true };
  } catch (error) {
    console.error('Archive notification error:', error);
    return { success: false, error: 'Bildirim arşivlenemedi' };
  }
}

// Create notification
export async function createNotification(notificationData: {
  memberId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: Record<string, any>;
  actionUrl?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        member_id: notificationData.memberId,
        type: notificationData.type,
        priority: notificationData.priority,
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data || {},
        action_url: notificationData.actionUrl || null
      })
      .select()
      .single();

    if (error) {
      console.error('Create notification error:', error);
      return { success: false, error: 'Bildirim oluşturulamadı' };
    }

    // Send push notification if user has subscriptions
    await sendPushNotification(notificationData.memberId, {
      title: notificationData.title,
      body: notificationData.message,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: {
        notificationId: data.id,
        url: notificationData.actionUrl || '/hesabim/bildirimler'
      }
    });

    return { success: true, notification: data };
  } catch (error) {
    console.error('Create notification error:', error);
    return { success: false, error: 'Bildirim oluşturulamadı' };
  }
}

// Subscribe to push notifications
export async function subscribeToPushNotifications(
  memberId: string,
  subscription: PushSubscriptionJSON
) {
  try {
    const { data, error } = await supabase
      .from('push_subscriptions')
      .insert({
        member_id: memberId,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        user_agent: navigator.userAgent
      })
      .select()
      .single();

    if (error) {
      console.error('Subscribe to push error:', error);
      return { success: false, error: 'Bildirim aboneliği oluşturulamadı' };
    }

    return { success: true, subscription: data };
  } catch (error) {
    console.error('Subscribe to push error:', error);
    return { success: false, error: 'Bildirim aboneliği oluşturulamadı' };
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotifications(
  memberId: string,
  endpoint: string
) {
  try {
    const { error } = await supabase
      .from('push_subscriptions')
      .update({ is_active: false })
      .eq('member_id', memberId)
      .eq('endpoint', endpoint);

    if (error) {
      console.error('Unsubscribe from push error:', error);
      return { success: false, error: 'Bildirim aboneliği iptal edilemedi' };
    }

    return { success: true };
  } catch (error) {
    console.error('Unsubscribe from push error:', error);
    return { success: false, error: 'Bildirim aboneliği iptal edilemedi' };
  }
}

// Send push notification via Edge Function
async function sendPushNotification(
  memberId: string,
  notification: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: Record<string, any>;
  }
) {
  try {
    const { error } = await supabase.functions.invoke('send-push-notification', {
      body: {
        memberId,
        notification
      }
    });

    if (error) {
      console.error('Send push notification error:', error);
    }
  } catch (error) {
    console.error('Send push notification error:', error);
  }
}

// Subscribe to real-time notifications
export function subscribeToNotifications(
  memberId: string,
  callback: (notification: Notification) => void
) {
  const channel = supabase
    .channel(`notifications:${memberId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `member_id=eq.${memberId}`
      },
      (payload) => {
        callback(payload.new as Notification);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Notification type labels
export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  order_update: 'Sipariş Güncelleme',
  delivery_update: 'Teslimat Güncelleme',
  payment_update: 'Ödeme Güncelleme',
  promotion: 'Kampanya',
  system: 'Sistem'
};

// Notification type colors
export const NOTIFICATION_TYPE_COLORS: Record<NotificationType, string> = {
  order_update: 'bg-blue-100 text-blue-700',
  delivery_update: 'bg-orange-100 text-orange-700',
  payment_update: 'bg-green-100 text-green-700',
  promotion: 'bg-purple-100 text-purple-700',
  system: 'bg-gray-100 text-gray-700'
};

// Notification type icons
export const NOTIFICATION_TYPE_ICONS: Record<NotificationType, string> = {
  order_update: '📦',
  delivery_update: '🚚',
  payment_update: '💳',
  promotion: '🎁',
  system: '⚙️'
};
