import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  // Signals for reactive state
  currentLocation = signal<UserLocation | null>(null);
  locationStatus = signal<'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable'>('idle');
  showPrompt = signal<boolean>(false);

  private readonly LOCATION_KEY = 'gw_user_location';
  private readonly PROMPT_DISMISSED_KEY = 'gw_location_prompt_dismissed';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkExistingLocation();
    }
  }

  // Check if we already have a stored location
  private checkExistingLocation() {
    const stored = localStorage.getItem(this.LOCATION_KEY);
    const dismissed = localStorage.getItem(this.PROMPT_DISMISSED_KEY);

    if (stored) {
      try {
        const location = JSON.parse(stored);
        this.currentLocation.set(location);
        this.locationStatus.set('granted');
      } catch {
        localStorage.removeItem(this.LOCATION_KEY);
      }
    } else if (!dismissed) {
      // Show prompt after a short delay for better UX
      setTimeout(() => {
        this.showPrompt.set(true);
      }, 2000);
    }
  }

  // Request location permission
  requestLocation(): Promise<UserLocation | null> {
    return new Promise((resolve) => {
      if (!isPlatformBrowser(this.platformId)) {
        resolve(null);
        return;
      }

      if (!navigator.geolocation) {
        this.locationStatus.set('unavailable');
        resolve(null);
        return;
      }

      this.locationStatus.set('requesting');

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          // Try to get city/state from coordinates (reverse geocoding)
          const enrichedLocation = await this.reverseGeocode(location);

          this.currentLocation.set(enrichedLocation);
          this.locationStatus.set('granted');
          this.showPrompt.set(false);

          // Save to localStorage
          localStorage.setItem(this.LOCATION_KEY, JSON.stringify(enrichedLocation));

          resolve(enrichedLocation);
        },
        (error) => {
          console.error('Location error:', error);
          this.locationStatus.set('denied');
          this.showPrompt.set(false);
          resolve(null);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 600000 // Cache for 10 minutes
        }
      );
    });
  }

  // Reverse geocode coordinates to get city/state
  private async reverseGeocode(location: UserLocation): Promise<UserLocation> {
    try {
      // Using free OpenStreetMap Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`,
        {
          headers: {
            'User-Agent': 'GW-Trailer-Rentals-App'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return {
          ...location,
          city: data.address?.city || data.address?.town || data.address?.village || data.address?.county,
          state: data.address?.state,
          country: data.address?.country
        };
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }

    return location;
  }

  // Dismiss the prompt without granting permission
  dismissPrompt() {
    this.showPrompt.set(false);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.PROMPT_DISMISSED_KEY, 'true');
    }
  }

  // Clear stored location and reset
  clearLocation() {
    this.currentLocation.set(null);
    this.locationStatus.set('idle');
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.LOCATION_KEY);
      localStorage.removeItem(this.PROMPT_DISMISSED_KEY);
    }
  }

  // Get formatted location string
  getFormattedLocation(): string {
    const loc = this.currentLocation();
    if (!loc) return '';

    if (loc.city && loc.state) {
      return `${loc.city}, ${loc.state}`;
    } else if (loc.city) {
      return loc.city;
    } else if (loc.state) {
      return loc.state;
    }

    return 'Location detected';
  }
}
