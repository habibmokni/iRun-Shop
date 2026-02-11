import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Location } from '../models/location.model';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  private storeService = inject(StoreService);

  currentLocation: google.maps.LatLngLiteral = { lat: 51.44157584725519, lng: 7.565725496333208 };
  storeDirectionsResults$!: Observable<google.maps.DirectionsResult | undefined>;
  closestMarker: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  distanceInKm: number[] = [];


  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  getDirections(destination: Location): void {
    const request: google.maps.DirectionsRequest = {
      origin: this.currentLocation,
      destination: { lat: destination.lat, lng: destination.lng },
      travelMode: google.maps.TravelMode.DRIVING
    };

    const directionsService = new google.maps.DirectionsService();

    this.storeDirectionsResults$ = new Observable((observer) => {
      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          observer.next(result);
        } else {
          observer.next(undefined);
        }
        observer.complete();
      });
    });
  }

  find_closest_marker(lat: number, lng: number): void {
    const userLocation = { lat, lng };
    const storeLocations = this.storeService.storeLocations;

    this.distanceInKm = [];
    let minDistance = Infinity;
    let closestMarkerIndex = 0;

    // Calculate distance to each store
    storeLocations.forEach((storeLocation, index) => {
      const distance = this.calculateDistance(
        userLocation.lat,
        userLocation.lng,
        storeLocation.lat,
        storeLocation.lng
      );

      this.distanceInKm.push(distance);

      if (distance < minDistance) {
        minDistance = distance;
        closestMarkerIndex = index;
      }
    });

    // Set the closest marker
    if (storeLocations.length > 0) {
      this.closestMarker = storeLocations[closestMarkerIndex];
    }
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    // Haversine formula to calculate distance between two coordinates
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
