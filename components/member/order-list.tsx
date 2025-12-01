'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard,
  Eye,
  Star,
  Filter,
  Search
} from 'lucide-react';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import { 
  getMemberOrders,
  getOrderStatistics,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  type Order,
  type OrderStatus
} from '@/lib/orders';
import { getOrderReview } from '@/lib/reviews';

interface OrderListProps {
  memberId: string;
  onOrderClick?: (orderId: string) => void;
  onReviewClick?: (orderId: string) => void;
}

export default function OrderList({ memberId, onOrderClick, onReviewClick }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewedOrders, setReviewedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadOrders();
    loadStatistics();
  }, [memberId, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    const result = await getMemberOrders(memberId, {
      status: statusFilter !== 'all' ? statusFilter : undefined
    });
    
    if (result.success && result.orders) {
      setOrders(result.orders);
      
      // Check which orders have reviews
      const reviewChecks = await Promise.all(
        result.orders
          .filter(o => o.status === 'delivered')
          .map(async (order) => {
            const reviewResult = await getOrderReview(order.id, memberId);
            return { orderId: order.id, hasReview: !!reviewResult.review };
          })
      );
      
      const reviewed = new Set(
        reviewChecks.filter(r => r.hasReview).map(r => r.orderId)
      );
      setReviewedOrders(reviewed);
    }
    setLoading(false);
  };

  const loadStatistics = async () => {
    const result = await getOrderStatistics(memberId);
    if (result.success) {
      setStatistics(result.stats);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.order_number.toLowerCase().includes(query) ||
        order.package_type.toLowerCase().includes(query) ||
        order.diet_type.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const canReviewOrder = (order: Order) => {
    return order.status === 'delivered' && !reviewedOrders.has(order.id);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mealora-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Siparişler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Toplam Sipariş</p>
                <p className="text-3xl font-bold text-blue-900">{statistics.total}</p>
              </div>
              <Package className="w-12 h-12 text-blue-600 opacity-50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Teslim Edildi</p>
                <p className="text-3xl font-bold text-green-900">{statistics.delivered}</p>
              </div>
              <Package className="w-12 h-12 text-green-600 opacity-50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Devam Eden</p>
                <p className="text-3xl font-bold text-orange-900">
                  {statistics.confirmed + statistics.preparing + statistics.shipped}
                </p>
              </div>
              <Clock className="w-12 h-12 text-orange-600 opacity-50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Toplam Harcama</p>
                <p className="text-2xl font-bold text-purple-900">
                  {statistics.totalSpent.toFixed(2)} ₺
                </p>
              </div>
              <CreditCard className="w-12 h-12 text-purple-600 opacity-50" />
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sipariş numarası, paket veya diyet türü ara..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
            >
              <option value="all">Tüm Siparişler</option>
              {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sipariş Bulunamadı
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? 'Arama kriterlerinize uygun sipariş bulunamadı'
              : statusFilter !== 'all'
              ? 'Bu durumda sipariş bulunmuyor'
              : 'Henüz sipariş vermediniz'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Order Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {order.order_number}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.package_type} - {order.diet_type}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      ORDER_STATUS_COLORS[order.status]
                    }`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(order.created_at).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Package className="w-4 h-4" />
                      <span>{order.meal_count} öğün</span>
                    </div>

                    {order.delivery_date && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          Teslimat: {new Date(order.delivery_date).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-semibold text-mealora-primary">
                        {order.final_amount.toFixed(2)} ₺
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 md:w-48">
                  <Button
                    variant="primary"
                    icon={Eye}
                    onClick={() => onOrderClick?.(order.id)}
                    className="w-full"
                  >
                    Detaylar
                  </Button>

                  {canReviewOrder(order) && (
                    <Button
                      variant="outline"
                      icon={Star}
                      onClick={() => onReviewClick?.(order.id)}
                      className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                    >
                      Değerlendir
                    </Button>
                  )}

                  {reviewedOrders.has(order.id) && (
                    <div className="flex items-center justify-center gap-2 text-sm text-green-600 py-2">
                      <Star className="w-4 h-4 fill-green-600" />
                      <span>Değerlendirildi</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
