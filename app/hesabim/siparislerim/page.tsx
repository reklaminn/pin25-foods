'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import OrderList from '@/components/member/order-list';
import OrderDetailsModal from '@/components/member/order-details-modal';
import ReviewFormModal from '@/components/member/review-form-modal';

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    
    if (!currentUser || currentUser.userType !== 'member') {
      router.push('/');
      return;
    }

    setUser(currentUser.user);
    setLoading(false);
  }, [router]);

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

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <OrderList 
            memberId={user.id}
            onOrderClick={(orderId) => setSelectedOrderId(orderId)}
            onReviewClick={(orderId) => setReviewOrderId(orderId)}
          />
        </div>
      </div>

      <OrderDetailsModal
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        orderId={selectedOrderId || ''}
        memberId={user?.id}
        onUpdate={() => {
          // Refresh order list if needed
        }}
      />

      <ReviewFormModal
        isOpen={!!reviewOrderId}
        onClose={() => setReviewOrderId(null)}
        orderId={reviewOrderId || ''}
        memberId={user?.id}
        onSuccess={() => {
          // Refresh order list
          setReviewOrderId(null);
        }}
      />
    </>
  );
}
