'use client';

import React, { useEffect, useState } from 'react';
import { Bell, X, Check, Archive, ExternalLink, Filter } from 'lucide-react';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import {
  getMemberNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  archiveNotification,
  subscribeToNotifications,
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_TYPE_COLORS,
  NOTIFICATION_TYPE_ICONS,
  type Notification,
  type NotificationType
} from '@/lib/notifications';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface NotificationCenterProps {
  memberId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ memberId, isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      
      // Subscribe to real-time notifications
      const unsubscribe = subscribeToNotifications(memberId, (notification) => {
        setNotifications(prev => [notification, ...prev]);
        
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            tag: notification.id
          });
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [isOpen, memberId]);

  const loadNotifications = async () => {
    setLoading(true);
    const result = await getMemberNotifications(memberId, {
      isRead: filter === 'unread' ? false : undefined,
      type: typeFilter !== 'all' ? typeFilter : undefined
    });
    
    if (result.success) {
      setNotifications(result.notifications || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [filter, typeFilter]);

  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationAsRead(notificationId, memberId);
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead(memberId);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const handleArchive = async (notificationId: string) => {
    await archiveNotification(notificationId, memberId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id);
    }
    
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-mealora-primary to-green-600 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Bildirimler</h2>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600">{unreadCount} okunmamış</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-mealora-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-mealora-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Okunmamış
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="ml-auto px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <Check className="w-4 h-4 inline mr-1" />
                  Tümünü Okundu İşaretle
                </button>
              )}
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as NotificationType | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
            >
              <option value="all">Tüm Tipler</option>
              {Object.entries(NOTIFICATION_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {NOTIFICATION_TYPE_ICONS[value as NotificationType]} {label}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mealora-primary"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Bell className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Bildirim Yok
                </h3>
                <p className="text-gray-600">
                  {filter === 'unread' 
                    ? 'Okunmamış bildiriminiz bulunmuyor'
                    : 'Henüz bildiriminiz yok'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.is_read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 text-2xl">
                        {NOTIFICATION_TYPE_ICONS[notification.type]}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {notification.title}
                          </h4>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            NOTIFICATION_TYPE_COLORS[notification.type]
                          }`}>
                            {NOTIFICATION_TYPE_LABELS[notification.type]}
                          </span>
                          
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                              locale: tr
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        {!notification.is_read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                            title="Okundu işaretle"
                          >
                            <Check className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchive(notification.id);
                          }}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Arşivle"
                        >
                          <Archive className="w-4 h-4 text-gray-600" />
                        </button>

                        {notification.action_url && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = notification.action_url!;
                            }}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                            title="Git"
                          >
                            <ExternalLink className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
