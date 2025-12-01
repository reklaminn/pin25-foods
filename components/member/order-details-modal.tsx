'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard,
  CheckCircle,
  Truck,
  ChefHat,
  FileText,
  AlertCircle
} from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { 
  getOrderDetails, 
  cancelOrder,
  type OrderWithDetails,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_METHOD_LABELS
} from '@/lib/orders';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  memberId: string;
  onUpdate?: () => void;
}

export default function OrderDetailsModal({ 
  isOpen, 
  onClose, 
  orderId,
  memberId,
  onUpdate 
}: OrderDetailsModalProps) {
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (isOpen && orderId) {
      loadOrderDetails();
    }
  }, [isOpen, orderId]);

  const loadOrderDetails = async () => {
    setLoading(true);
    const result = await getOrderDetails(orderId, memberId);
    setLoading(false);

    if (result.success) {
      setOrder(result.order);
    } else {
      setMessage({ type: 'error', text: result.error || 'Sipariş detayları yüklenemedi' });
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      setMessage({ type: 'error', text: 'Lütfen iptal nedenini belirtin' });
      return;
    }

    setCancelling(true);
    setMessage(null);

    const result = await cancelOrder(orderId, memberId, cancelReason);
    
    setCancelling(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Sipariş başarıyla iptal edildi' });
      await loadOrderDetails();
      if (onUpdate) onUpdate();
      setTimeout(() => {
        setShowCancelConfirm(false);
        setCancelReason('');
      }, 1500);
    } else {
      setMessage({ type: 'error', text: result.error || 'Sipariş iptal edilemedi' });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'preparing':
        return <ChefHat className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const canCancelOrder = order && ['pending', 'confirmed'].includes(order.status);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-mealora-primary to-green-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Sipariş Detayları</h2>
                {order && (
                  <p className="text-white/80 text-sm">{order.order_number}</p>
                )}
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
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mealora-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Yükleniyor...</p>
            </div>
          ) : !order ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <p className="text-gray-600">Sipariş bulunamadı</p>
            </div>
          ) : (
            <div className="space-y-6">
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

              {/* Order Status */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Sipariş Durumu</h3>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    ORDER_STATUS_COLORS[order.status]
                  }`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>

                {/* Status Timeline */}
                {order.status_history && order.status_history.length > 0 && (
                  <div className="space-y-4">
                    {order.status_history.map((history, index) => (
                      <div key={history.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            ORDER_STATUS_COLORS[history.status]
                          }`}>
                            {getStatusIcon(history.status)}
                          </div>
                          {index < order.status_history!.length - 1 && (
                            <div className="w-0.5 h-12 bg-gray-200 my-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-semibold text-gray-900">
                            {ORDER_STATUS_LABELS[history.status]}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(history.created_at).toLocaleString('tr-TR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {history.notes && (
                            <p className="text-sm text-gray-500 mt-1">{history.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Order Summary */}
              <Card>
                <h3 className="text-lg font-bold mb-4">Sipariş Özeti</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paket Türü</span>
                    <span className="font-medium">{order.package_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diyet Türü</span>
                    <span className="font-medium">{order.diet_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Öğün Sayısı</span>
                    <span className="font-medium">{order.meal_count} öğün</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Teslimat Günleri</span>
                    <span className="font-medium">{order.delivery_days.join(', ')}</span>
                  </div>
                </div>
              </Card>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <Card>
                  <h3 className="text-lg font-bold mb-4">Sipariş Kalemleri</h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div 
                        key={item.id}
                        className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.meal_name}</h4>
                          <p className="text-sm text-gray-600">{item.meal_category}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            {item.calories && <span>{item.calories} kcal</span>}
                            {item.protein && <span>P: {item.protein}g</span>}
                            {item.carbs && <span>K: {item.carbs}g</span>}
                            {item.fat && <span>Y: {item.fat}g</span>}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Teslimat: {new Date(item.delivery_date).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-mealora-primary">
                            {item.total_price.toFixed(2)} ₺
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} x {item.unit_price.toFixed(2)} ₺
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Delivery Information */}
              {order.delivery_address && (
                <Card>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-mealora-primary" />
                    Teslimat Bilgileri
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.delivery_address.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.delivery_address.full_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.delivery_address.phone}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {order.delivery_address.address_line1}
                      </p>
                      {order.delivery_address.address_line2 && (
                        <p className="text-sm text-gray-600">
                          {order.delivery_address.address_line2}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        {order.delivery_address.district}, {order.delivery_address.city}
                      </p>
                      {order.delivery_address.postal_code && (
                        <p className="text-sm text-gray-600">
                          Posta Kodu: {order.delivery_address.postal_code}
                        </p>
                      )}
                    </div>
                    {order.delivery_date && (
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(order.delivery_date).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        {order.delivery_time_slot && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Clock className="w-4 h-4" />
                            <span>{order.delivery_time_slot}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {order.delivery_notes && (
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-1">Teslimat Notu:</p>
                        <p className="text-sm text-gray-600">{order.delivery_notes}</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Payment Information */}
              <Card>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-mealora-primary" />
                  Ödeme Bilgileri
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ödeme Yöntemi</span>
                    <span className="font-medium">
                      {PAYMENT_METHOD_LABELS[order.payment_method]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ödeme Durumu</span>
                    <span className={`font-medium ${
                      order.payment_status === 'completed' 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                    }`}>
                      {order.payment_status === 'completed' ? 'Ödendi' : 'Beklemede'}
                    </span>
                  </div>
                  {order.payment_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ödeme Tarihi</span>
                      <span className="font-medium">
                        {new Date(order.payment_date).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  )}
                  {order.transaction_id && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">İşlem No</span>
                      <span className="font-medium font-mono text-sm">
                        {order.transaction_id}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Ara Toplam</span>
                    <span>{order.total_amount.toFixed(2)} ₺</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>İndirim</span>
                      <span>-{order.discount_amount.toFixed(2)} ₺</span>
                    </div>
                  )}
                  {order.promo_code && order.promo_discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Promosyon ({order.promo_code})</span>
                      <span>-{order.promo_discount.toFixed(2)} ₺</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Toplam</span>
                    <span className="text-mealora-primary">
                      {order.final_amount.toFixed(2)} ₺
                    </span>
                  </div>
                </div>
              </Card>

              {/* Cancel Order */}
              {canCancelOrder && !showCancelConfirm && (
                <Button
                  variant="outline"
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full text-red-600 border-red-600 hover:bg-red-50"
                >
                  Siparişi İptal Et
                </Button>
              )}

              {/* Cancel Confirmation */}
              {showCancelConfirm && (
                <Card className="border-red-200 bg-red-50">
                  <h3 className="text-lg font-bold text-red-900 mb-4">
                    Siparişi İptal Et
                  </h3>
                  <p className="text-sm text-red-800 mb-4">
                    Bu siparişi iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                  </p>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="İptal nedenini belirtin..."
                    className="w-full px-4 py-3 rounded-lg border border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCancelConfirm(false);
                        setCancelReason('');
                      }}
                      className="flex-1"
                      disabled={cancelling}
                    >
                      Vazgeç
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleCancelOrder}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      disabled={cancelling || !cancelReason.trim()}
                    >
                      {cancelling ? 'İptal Ediliyor...' : 'İptal Et'}
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
