'use client';

import React from 'react';
import { 
  UtensilsCrossed, 
  Package, 
  Users, 
  TrendingUp,
  Calendar,
  MapPin,
  Tag,
  MessageSquare
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
}

const stats: StatCard[] = [
  {
    title: 'Aktif Abonelikler',
    value: '247',
    change: '+12%',
    changeType: 'positive',
    icon: Users
  },
  {
    title: 'Bu Hafta Yemek',
    value: '1,235',
    change: '+8%',
    changeType: 'positive',
    icon: UtensilsCrossed
  },
  {
    title: 'Aylık Gelir',
    value: '₺432,500',
    change: '+23%',
    changeType: 'positive',
    icon: TrendingUp
  },
  {
    title: 'Aktif Kuponlar',
    value: '12',
    change: '0',
    changeType: 'neutral',
    icon: Tag
  }
];

const recentActivities = [
  { id: 1, type: 'order', message: 'Yeni abonelik: Ahmet Yılmaz - 10 Gün Paketi', time: '5 dakika önce' },
  { id: 2, type: 'menu', message: 'Haftalık menü güncellendi', time: '2 saat önce' },
  { id: 3, type: 'contact', message: 'Yeni kurumsal başvuru: ABC Şirketi', time: '4 saat önce' },
  { id: 4, type: 'meal', message: 'Yeni yemek eklendi: Izgara Levrek', time: '1 gün önce' },
  { id: 5, type: 'coupon', message: 'YENI25 kuponu oluşturuldu', time: '2 gün önce' }
];

const quickActions = [
  { name: 'Yeni Yemek Ekle', href: '/admin/yemekler', icon: UtensilsCrossed, color: 'bg-green-500' },
  { name: 'Menü Planla', href: '/admin/haftalik-menu', icon: Calendar, color: 'bg-blue-500' },
  { name: 'Paket Oluştur', href: '/admin/paketler', icon: Package, color: 'bg-purple-500' },
  { name: 'Kupon Ekle', href: '/admin/kuponlar', icon: Tag, color: 'bg-orange-500' }
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          P25 Foods yönetim paneline hoş geldiniz
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`mt-2 text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' :
                    stat.changeType === 'negative' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {stat.change} son aya göre
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-mealora-primary/10`}>
                  <Icon className="text-mealora-primary" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.name}
                href={action.href}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all hover:scale-105"
              >
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <Icon className="text-white" size={20} />
                </div>
                <span className="font-medium text-gray-900">{action.name}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h2>
            <button className="text-sm text-mealora-primary hover:text-mealora-primary/80">
              Tümünü Gör
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-mealora-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Bu Hafta</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="text-mealora-primary" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Menü Planı</p>
                  <p className="text-xs text-gray-600">10 yemek planlandı</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-mealora-primary">Tamamlandı</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Teslimat Bölgeleri</p>
                  <p className="text-xs text-gray-600">6 aktif bölge</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-blue-600">Aktif</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-orange-600" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Bekleyen Başvurular</p>
                  <p className="text-xs text-gray-600">3 kurumsal, 5 iletişim</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-orange-600">8 Yeni</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Tag className="text-purple-600" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Aktif Kampanyalar</p>
                  <p className="text-xs text-gray-600">12 kupon kullanımda</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-purple-600">Devam Ediyor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
