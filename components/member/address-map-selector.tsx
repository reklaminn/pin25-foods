'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, Loader } from 'lucide-react';
import Button from '@/components/ui/button';
import {
  initGoogleMaps,
  getCurrentLocation,
  reverseGeocode,
  geocodeAddress,
  type MapLocation,
  type PlaceResult
} from '@/lib/maps';

interface AddressMapSelectorProps {
  apiKey: string;
  initialLocation?: MapLocation;
  onLocationSelect: (result: PlaceResult) => void;
  onClose?: () => void;
}

export default function AddressMapSelector({
  apiKey,
  initialLocation,
  onLocationSelect,
  onClose
}: AddressMapSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(
    initialLocation || null
  );
  const [selectedAddress, setSelectedAddress] = useState<PlaceResult | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    loadMap();
  }, []);

  const loadMap = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize Google Maps
      await initGoogleMaps(apiKey);

      // Default location (Istanbul)
      const defaultLocation: MapLocation = initialLocation || {
        lat: 41.0082,
        lng: 28.9784
      };

      // Create map
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: defaultLocation,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        mapInstanceRef.current = map;

        // Create marker
        const marker = new google.maps.Marker({
          map,
          position: defaultLocation,
          draggable: true,
          animation: google.maps.Animation.DROP
        });

        markerRef.current = marker;

        // Add marker drag listener
        marker.addListener('dragend', async () => {
          const position = marker.getPosition();
          if (position) {
            const location: MapLocation = {
              lat: position.lat(),
              lng: position.lng()
            };
            await handleLocationChange(location);
          }
        });

        // Add map click listener
        map.addListener('click', async (e: any) => {
          const location: MapLocation = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
          };
          marker.setPosition(location);
          await handleLocationChange(location);
        });

        // Initialize autocomplete
        const input = document.getElementById('map-search-input') as HTMLInputElement;
        if (input) {
          const autocomplete = new google.maps.places.Autocomplete(input, {
            componentRestrictions: { country: 'tr' },
            fields: ['formatted_address', 'geometry', 'address_components']
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
              const location: MapLocation = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              };
              map.setCenter(location);
              marker.setPosition(location);
              handleLocationChange(location);
            }
          });

          autocompleteRef.current = autocomplete;
        }

        // Get initial address if location provided
        if (initialLocation) {
          await handleLocationChange(initialLocation);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Map load error:', err);
      setError('Harita yüklenemedi. Lütfen sayfayı yenileyin.');
      setLoading(false);
    }
  };

  const handleLocationChange = async (location: MapLocation) => {
    setSelectedLocation(location);

    try {
      const result = await reverseGeocode(location);
      if (result) {
        setSelectedAddress(result);
      }
    } catch (err) {
      console.error('Reverse geocode error:', err);
    }
  };

  const handleGetCurrentLocation = async () => {
    try {
      setGettingLocation(true);
      setError(null);

      const location = await getCurrentLocation();

      if (mapInstanceRef.current && markerRef.current) {
        mapInstanceRef.current.setCenter(location);
        markerRef.current.setPosition(location);
        await handleLocationChange(location);
      }

      setGettingLocation(false);
    } catch (err) {
      console.error('Get location error:', err);
      setError('Konumunuz alınamadı. Lütfen konum izni verin.');
      setGettingLocation(false);
    }
  };

  const handleConfirm = () => {
    if (selectedAddress) {
      onLocationSelect(selectedAddress);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-mealora-primary to-green-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Adres Seçimi</h2>
                <p className="text-white/80 text-sm">
                  Haritadan teslimat adresinizi seçin
                </p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-4 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="map-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Adres ara..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mealora-primary focus:border-transparent"
              />
            </div>
            <Button
              variant="outline"
              icon={Navigation}
              onClick={handleGetCurrentLocation}
              disabled={gettingLocation}
            >
              {gettingLocation ? 'Alınıyor...' : 'Konumum'}
            </Button>
          </div>

          {/* Map Container */}
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center z-10">
                <div className="text-center">
                  <Loader className="w-12 h-12 text-mealora-primary animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Harita yükleniyor...</p>
                </div>
              </div>
            )}
            <div
              ref={mapRef}
              className="w-full h-96 rounded-xl border-2 border-gray-200"
            />
          </div>

          {/* Selected Address */}
          {selectedAddress && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-green-900 mb-1">Seçili Adres:</p>
                  <p className="text-sm text-green-800">{selectedAddress.address}</p>
                  {selectedAddress.components.city && (
                    <p className="text-xs text-green-700 mt-1">
                      {selectedAddress.components.district},{' '}
                      {selectedAddress.components.city}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>İpucu:</strong> Haritayı tıklayarak veya işaretçiyi
              sürükleyerek tam konumunuzu belirleyin. Arama çubuğunu kullanarak
              adres arayabilirsiniz.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            {onClose && (
              <Button variant="outline" onClick={onClose} className="flex-1">
                İptal
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={!selectedAddress}
              className="flex-1"
            >
              Adresi Onayla
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
