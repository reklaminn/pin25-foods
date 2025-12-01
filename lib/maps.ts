// Google Maps integration for address selection

export interface MapLocation {
  lat: number;
  lng: number;
}

export interface AddressComponents {
  street?: string;
  neighborhood?: string;
  district?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface PlaceResult {
  address: string;
  location: MapLocation;
  components: AddressComponents;
}

// Initialize Google Maps
export function initGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'));
      return;
    }

    // Check if already loaded
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=tr&region=TR`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps'));

    document.head.appendChild(script);
  });
}

// Get current location
export function getCurrentLocation(): Promise<MapLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

// Geocode address to location
export async function geocodeAddress(address: string): Promise<PlaceResult | null> {
  if (!window.google || !window.google.maps) {
    throw new Error('Google Maps not loaded');
  }

  const geocoder = new google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode(
      {
        address,
        region: 'TR',
        language: 'tr'
      },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const result = results[0];
          const location = result.geometry.location;

          const components: AddressComponents = {};
          result.address_components.forEach((component) => {
            const types = component.types;

            if (types.includes('route')) {
              components.street = component.long_name;
            } else if (types.includes('neighborhood')) {
              components.neighborhood = component.long_name;
            } else if (types.includes('administrative_area_level_2')) {
              components.district = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              components.city = component.long_name;
            } else if (types.includes('postal_code')) {
              components.postalCode = component.long_name;
            } else if (types.includes('country')) {
              components.country = component.long_name;
            }
          });

          resolve({
            address: result.formatted_address,
            location: {
              lat: location.lat(),
              lng: location.lng()
            },
            components
          });
        } else {
          resolve(null);
        }
      }
    );
  });
}

// Reverse geocode location to address
export async function reverseGeocode(location: MapLocation): Promise<PlaceResult | null> {
  if (!window.google || !window.google.maps) {
    throw new Error('Google Maps not loaded');
  }

  const geocoder = new google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode(
      {
        location: { lat: location.lat, lng: location.lng },
        language: 'tr',
        region: 'TR'
      },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const result = results[0];

          const components: AddressComponents = {};
          result.address_components.forEach((component) => {
            const types = component.types;

            if (types.includes('route')) {
              components.street = component.long_name;
            } else if (types.includes('neighborhood')) {
              components.neighborhood = component.long_name;
            } else if (types.includes('administrative_area_level_2')) {
              components.district = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              components.city = component.long_name;
            } else if (types.includes('postal_code')) {
              components.postalCode = component.long_name;
            } else if (types.includes('country')) {
              components.country = component.long_name;
            }
          });

          resolve({
            address: result.formatted_address,
            location,
            components
          });
        } else {
          resolve(null);
        }
      }
    );
  });
}

// Calculate distance between two points (Haversine formula)
export function calculateDistance(
  point1: MapLocation,
  point2: MapLocation
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) *
      Math.cos(toRad(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Check if location is within delivery area
export function isWithinDeliveryArea(
  location: MapLocation,
  centerPoint: MapLocation,
  radiusKm: number
): boolean {
  const distance = calculateDistance(location, centerPoint);
  return distance <= radiusKm;
}

// Format address for display
export function formatAddress(components: AddressComponents): string {
  const parts: string[] = [];

  if (components.street) parts.push(components.street);
  if (components.neighborhood) parts.push(components.neighborhood);
  if (components.district) parts.push(components.district);
  if (components.city) parts.push(components.city);
  if (components.postalCode) parts.push(components.postalCode);

  return parts.join(', ');
}

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
  }
}
