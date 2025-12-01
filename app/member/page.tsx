'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getMemberAddresses } from '@/lib/addresses';
import { getOrderStatistics } from '@/lib/orders';
import { 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  Settings,
  Calendar,
  Clock,
  TrendingUp,
  Heart,
  Bell,
  ChevronRight,
  ShoppingBag,
  Award
} from 'lucide-react';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import ProfileEditModal from '@/components/member/profile-edit-modal';
import AddressManagementModal from '@/components/member/address-management-modal';

export default function MemberDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressCount, setAddressCount] = useState(0);
  const [orderStats, setOrderStats] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    
    if (!currentUser || currentUser.userType !== 'member') {
      router.push('/member/login');
      return;
    }

    setUser(currentUser.user);
    loadData(currentUser.user.id);
    setLoading(false);
  }, [router]);

  const loadData = async (memberId: string) => {
    // Load address count
    const addressResult = await getMemberAddresses(memberId);
    if (addressResult.success) {
      setAddressCount(addressResult.addresses?.length || 0);
    }

    // Load order statistics
    const statsResult = await getOrderStatistics(memberId);
    if (statsResult.success) {
      setOrderStats(statsResult.stats);
    }
  };

  const handleProfileUpdate = (updatedUser: any) => {
    setUser(updatedUser);
  };

  const handleAddressUpdate = () => {
    if (user) {
      loadData(user.id);
    }
  };

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

  // Mock upcoming deliveries - will be replaced with real data
  const upcomingDeliveries = [
    {
      id: 1,
      date: '2025-01-20',
      time: '12:00 - 14:00',
      package: 'Haftalık Paket - Klasik',
      meals: 5,
      status: 'confirmed'
    },
    {
      id: 2,
      date: '2025-01-22',
      time: '12:00 - 14:00',
      package: 'Haftalık Paket - Klasik',
      meals: 5,
      status: 'preparing'
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Hoş Geldiniz, {user?.first_name}! 👋
                </h1>
                <p className="text-gray-600">Hesap bilgilerinizi ve siparişlerinizi buradan yönetebilirsiniz</p>
              </div>
              <Button variant="outline" icon={Bell} className="hidden md:flex">
                Bildirimler
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card 
              className="text-center hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => router.push('/member/siparislerim')}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-mealora-primary to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-700">Aktif Paketler</h3>
              <p className="text-3xl font-bold text-mealora-primary">
                {orderStats?.confirmed || 0}
              </p>
              <p className="text-sm text-gray-500 mt-2">Devam eden sipariş</p>
            </Card>

            <Card 
              className="text-center hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => router.push('/member/siparislerim')}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-700">Toplam Sipariş</h3>
              <p className="text-3xl font-bold text-blue-600">
                {orderStats?.total || 0}
              </p>
              <p className="text-sm text-gray-500 mt-2">Tamamlanan sipariş</p>
            </Card>

            <Card 
              className="text-center hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setShowAddressModal(true)}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-700">Kayıtlı Adres</h3>
              <p className="text-3xl font-bold text-green-600">{addressCount}</p>
              <p className="text-sm text-gray-500 mt-2">Teslimat adresi</p>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-700">Toplam Harcama</h3>
              <p className="text-3xl font-bold text-purple-600">
                {orderStats?.totalSpent?.toFixed(0) || 0} ₺
              </p>
              <p className="text-sm text-gray-500 mt-2">Tüm zamanlar</p>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Deliveries */}
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-mealora-primary" />
                    Yaklaşan Teslimatlar
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => router.push('/member/siparislerim')}
                  >
                    Tümünü Gör
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {upcomingDeliveries.map((delivery) => (
                    <div 
                      key={delivery.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-mealora-primary transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{delivery.package}</h4>
                          <p className="text-sm text-gray-600">{delivery.meals} öğün</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          delivery.status === 'confirmed' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {delivery.status === 'confirmed' ? 'Onaylandı' : 'Hazırlanıyor'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(delivery.date).toLocaleDateString('tr-TR', { 
                            day: 'numeric', 
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {delivery.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Order Statistics */}
              {orderStats && (
                <Card>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-mealora-primary" />
                    Sipariş İstatistikleri
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
                      <p className="text-sm text-gray-600 mt-1">Beklemede</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{orderStats.confirmed}</p>
                      <p className="text-sm text-gray-600 mt-1">Onaylandı</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{orderStats.preparing}</p>
                      <p className="text-sm text-gray-600 mt-1">Hazırlanıyor</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{orderStats.shipped}</p>
                      <p className="text-sm text-gray-600 mt-1">Kargoda</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
                      <p className="text-sm text-gray-600 mt-1">Teslim Edildi</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{orderStats.cancelled}</p>
                      <p className="text-sm text-gray-600 mt-1">İptal Edildi</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-mealora-primary to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Telefon</span>
                    <span className="text-sm font-medium">{user?.phone || 'Belirtilmemiş'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Üyelik Tarihi</span>
                    <span className="text-sm font-medium">
                      {new Date(user?.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Durum</span>
                    <span className="text-sm font-medium text-green-600">Aktif</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  icon={Settings} 
                  className="w-full"
                  onClick={() => setShowProfileModal(true)}
                >
                  Profili Düzenle
                </Button>
              </Card>

              {/* Addresses Card */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-mealora-primary" />
                    Adreslerim
                  </h3>
                  <span className="text-sm font-medium text-mealora-primary">
                    {addressCount} adres
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Teslimat adreslerinizi yönetin
                </p>
                <Button 
                  variant="primary" 
                  icon={MapPin}
                  className="w-full"
                  onClick={() => setShowAddressModal(true)}
                >
                  Adresleri Yönet
                </Button>
              </Card>

              {/* Quick Actions */}
              <Card>
                <h3 className="text-lg font-bold mb-4">Hızlı İşlemler</h3>
                <div className="space-y-2">
                  <Button 
                    variant="primary" 
                    className="w-full justify-start" 
                    onClick={() => router.push('/paket-sec')}
                  >
                    <Package className="w-5 h-5 mr-2" />
                    Yeni Paket Sipariş Et
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/member/siparislerim')}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Siparişlerim
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/menu')}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Haftanın Menüsü
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Favorilerim
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Ödeme Yöntemlerim
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfileEditModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onUpdate={handleProfileUpdate}
      />

      <AddressManagementModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        memberId={user?.id}
        onUpdate={handleAddressUpdate}
      />
    </>
  );
}
