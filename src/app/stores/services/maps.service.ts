import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Location } from '../types/location.types';
import { StoreService } from './store.service';

@Injectable({ providedIn: 'root' })
export class MapsService {
	private readonly storeService = inject(StoreService);

	currentLocation: google.maps.LatLngLiteral = {
		lat: 51.44157584725519,
		lng: 7.565725496333208,
	};
	storeDirectionsResults$!: Observable<google.maps.DirectionsResult | undefined>;
	closestMarker: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
	distanceInKm: number[] = [];

	getCurrentLocation(): void {
		if (!navigator.geolocation) {
			console.error('Geolocation is not supported by this browser.');
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				this.currentLocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};
			},
			(error) => {
				console.error('Error getting location:', error);
			},
		);
	}

	getDirections(destination: Location): void {
		const request: google.maps.DirectionsRequest = {
			origin: this.currentLocation,
			destination: { lat: destination.lat, lng: destination.lng },
			travelMode: google.maps.TravelMode.DRIVING,
		};

		const directionsService = new google.maps.DirectionsService();

		this.storeDirectionsResults$ = new Observable((observer) => {
			directionsService.route(request, (result, status) => {
				observer.next(
					status === google.maps.DirectionsStatus.OK && result ? result : undefined,
				);
				observer.complete();
			});
		});
	}

	findClosestMarker(lat: number, lng: number): void {
		const storeLocations = this.storeService.storeLocations;

		this.distanceInKm = storeLocations.map((loc) =>
			this.calculateDistance(lat, lng, loc.lat, loc.lng),
		);

		const minIndex = this.distanceInKm.reduce(
			(minIdx, dist, idx, arr) => (dist < arr[minIdx] ? idx : minIdx),
			0,
		);

		if (storeLocations.length > 0) {
			this.closestMarker = storeLocations[minIndex];
		}
	}

	calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
		const R = 6371; // Earth's radius in km
		const dLat = this.toRadians(lat2 - lat1);
		const dLng = this.toRadians(lng2 - lng1);

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(this.toRadians(lat1)) *
				Math.cos(this.toRadians(lat2)) *
				Math.sin(dLng / 2) *
				Math.sin(dLng / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return Math.round(R * c * 100) / 100;
	}

	/** Requests the user's geolocation and returns a Promise with the coordinates. */
	requestGeolocation(): Promise<google.maps.LatLngLiteral | null> {
		return new Promise((resolve) => {
			if (!navigator.geolocation) {
				resolve(null);
				return;
			}
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const coords = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					};
					this.currentLocation = coords;
					resolve(coords);
				},
				() => resolve(null),
			);
		});
	}

	private toRadians(degrees: number): number {
		return degrees * (Math.PI / 180);
	}
}
