'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MapPin, Navigation, Clock, Phone, Star, Package, User } from 'lucide-react';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import {
  getDeliveryTracking,
  subscribeToDeliveryLocation,
  calculateDistance,
  formatDistance,
  formatETA,
  DELIVERY_STATUS_LABELS,
  DELIVERY_STATUS_COLORS,
  DELIVERY_STATUS_ICONS,
  type DeliveryTrackingWithDetails,
  type DeliveryLocation
} from '@/lib/delivery-tracking';

interface DeliveryTrackingMapProps {
  orderId: string;
  memberId: string;
}

export default function DeliveryTrackingMap({ orderId, memberId }: DeliveryTrackingMapProps) {
  const [tracking, setTracking] = useState<DeliveryTrackingWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<DeliveryLocation | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const courierMarkerRef = useRef<google.maps.Marker | null>(null);
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null);
  const deliveryMarkerRef = useRef<google.maps.Marker | null>(null);
  const routePolylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    loadTracking();
  }, [orderId, memberId]);

  useEffect(() => {
    if (tracking) {
      // Subscribe to real-time location updates
      const unsubscribe = subscribeToDeliveryLocation(orderId, (location) => {
        setCurrentLocation(location);
        updateCourierMarker(location);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [tracking, orderId]);

  useEffect(() => {
    if (tracking && mapRef.current && !mapInstanceRef.current) {
      initializeMap();
    }
  }, [tracking]);

  const loadTracking = async () => {
    setLoading(true);
    const result = await getDeliveryTracking(orderId, memberId);
    
    if (result.success && result.tracking) {
      setTracking(result.tracking);
      setCurrentLocation(result.tracking.current_location);
    }
    setLoading(false);
  };

  const initializeMap = () => {
    if (!tracking || !mapRef.current) return;

    const deliveryLoc = tracking.delivery_location as any;
    
    // Initialize map centered on delivery location
    const map = new google.maps.Map(mapRef.current, {
      center: {
        lat: deliveryLoc.latitude,
        lng: deliveryLoc.longitude
      },
      zoom: 14,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    });

    mapInstanceRef.current = map;

    // Add pickup marker
    const pickupLoc = tracking.pickup_location as any;
    pickupMarkerRef.current = new google.maps.Marker({
      position: {
        lat: pickupLoc.latitude,
        lng: pickupLoc.longitude
      },
      map,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#8b5cf6" stroke="white" stroke-width="2"/>
            <text x="20" y="26" text-anchor="middle" font-size="20" fill="white">🏪</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(40, 40)
      },
      title: 'Alış Noktası'
    });

    // Add delivery marker
    deliveryMarkerRef.current = new google.maps.Marker({
      position: {
        lat: deliveryLoc.latitude,
        lng: deliveryLoc.longitude
      },
      map,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#10b981" stroke="white" stroke-width="2"/>
            <text x="20" y="26" text-anchor="middle" font-size="20" fill="white">🏠</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(40, 40)
      },
      title: 'Teslimat Adresi'
    });

    // Add courier marker if location available
    if (currentLocation) {
      updateCourierMarker(currentLocation);
    }

    // Fit bounds to show all markers
    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: pickupLoc.latitude, lng: pickupLoc.longitude });
    bounds.extend({ lat: deliveryLoc.latitude, lng: deliveryLoc.longitude });
    if (currentLocation) {
      bounds.extend({ lat: currentLocation.latitude, lng: currentLocation.longitude });
    }
    map.fitBounds(bounds);
  };

  const updateCourierMarker = (location: DeliveryLocation) => {
    if (!mapInstanceRef.current) return;

    if (courierMarkerRef.current) {
      courierMarkerRef.current.setPosition({
        lat: location.latitude,
        lng: location.longitude
      });
    } else {
      courierMarkerRef.current = new google.maps.Marker({
        position: {
          lat: location.latitude,
          lng: location.longitude
        },
        map: mapInstanceRef.current,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#f97316" stroke="white" stroke-width="2"/>
              <text x="20" y="26" text-anchor="middle" font-size="20" fill="white">🚚</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40)
        },
        title: 'Kurye Konumu',
        animation: google.maps.Animation.DROP
      });
    }

    // Update distance and ETA
    if (tracking) {
      const deliveryLoc = tracking.delivery_location as any;
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        deliveryLoc.latitude,
        deliveryLoc.longitude
      );
      
      setTracking(prev => prev ? {
        ...prev,
        distance_remaining: distance
      } : null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mealora-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Teslimat bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!tracking) {
    return (
      <Card className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Teslimat Takibi Bulunamadı
        </h3>
        <p className="text-gray-600">
          Bu sipariş için henüz teslimat takibi başlatılmamış.
        </p>
      </Card>
    );
  }

  const deliveryLoc = tracking.delivery_location as any;
  const distance = currentLocation && tracking.distance_remaining
    ? formatDistance(tracking.distance_remaining)
    : 'Hesaplanıyor...';
  
  const eta = tracking.estimated_arrival
    ? formatETA(tracking.estimated_arrival)
    : 'Hesaplanıyor...';

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Teslimat Durumu
            </h3>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              DELIVERY_STATUS_COLORS[tracking.status]
            }`}>
              <span className="text-lg">{DELIVERY_STATUS_ICONS[tracking.status]}</span>
              {DELIVERY_STATUS_LABELS[tracking.status]}
            </span>
          </div>
          
          {tracking.courier && (
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Kuryeniz</p>
              <p className="font-semibold text-gray-900">{tracking.courier.name}</p>
              <div className="flex items-center justify-end gap-1 text-sm text-gray-600 mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>{tracking.courier.rating.toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Navigation className="w-5 h-5" />
              <span className="text-sm font-medium">Kalan Mesafe</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{distance}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Tahmini Süre</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{eta}</p>
          </div>
        </div>

        {tracking.courier && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              icon={Phone}
              className="w-full"
              onClick={() => window.location.href = `tel:${tracking.courier?.phone}`}
            >
              Kuryeyi Ara
            </Button>
          </div>
        )}
      </Card>

      {/* Map */}
      <Card className="p-0 overflow-hidden">
        <div 
          ref={mapRef}
          className="w-full h-96"
          style={{ minHeight: '400px' }}
        />
      </Card>

      {/* Timeline */}
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Teslimat Süreci
        </h3>
        
        <div className="space-y-4">
          {[
            { status: 'assigned', label: 'Kurye Atandı', time: tracking.created_at },
            { status: 'picked_up', label: 'Paket Alındı', time: tracking.picked_up_at },
            { status: 'in_transit', label: 'Yolda', time: tracking.started_at },
            { status: 'nearby', label: 'Yakınınızda', time: null },
            { status: 'arrived', label: 'Adresinizde', time: null },
            { status: 'delivered', label: 'Teslim Edildi', time: tracking.delivered_at }
          ].map((step, index) => {
            const isCompleted = tracking.status === step.status || 
              (index < ['assigned', 'picked_up', 'in_transit', 'nearby', 'arrived', 'delivered'].indexOf(tracking.status));
            const isCurrent = tracking.status === step.status;

            return (
              <div key={step.status} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? 'bg-green-100 text-green-700'
                    : isCurrent
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <span className="text-lg">✓</span>
                  ) : (
                    <span className="text-lg">{DELIVERY_STATUS_ICONS[step.status as keyof typeof DELIVERY_STATUS_ICONS]}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium ${
                    isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                  {step.time && (
                    <p className="text-sm text-gray-600">
                      {new Date(step.time).toLocaleString('tr-TR')}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Delivery Photo */}
      {tracking.delivery_photo_url && (
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Teslimat Fotoğrafı
          </h3>
          <img
            src={tracking.delivery_photo_url}
            alt="Teslimat Fotoğrafı"
            className="w-full rounded-lg"
          />
          {tracking.delivery_notes && (
            <p className="mt-4 text-sm text-gray-600">
              <strong>Not:</strong> {tracking.delivery_notes}
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
