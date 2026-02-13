import {
	Component,
	ChangeDetectionStrategy,
	computed,
	inject,
	input,
	signal,
	viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MapInfoWindow, MapMarker, GoogleMapsModule } from '@angular/google-maps';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Store } from '../../types/store.types';
import { Location } from '../../types/location.types';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { StoreService } from '../../services/store.service';
import { UserService } from '../../../user/services/user.service';
import { MapsService } from '../../services/maps.service';

interface MapStore {
	readonly store: Store;
	readonly position: google.maps.LatLngLiteral;
}

@Component({
	selector: 'app-maps',
	templateUrl: './maps.component.html',
	styleUrls: ['./maps.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [GoogleMapsModule, MatDialogModule, MatButtonModule, MatIconModule],
})
export class MapsComponent {
	private readonly storeService = inject(StoreService);
	private readonly mapsService = inject(MapsService);
	private readonly snackbar = inject(SnackbarService);
	private readonly dialog = inject(MatDialog);
	private readonly userService = inject(UserService);

	protected readonly infoWindow = viewChild.required(MapInfoWindow);

	readonly mapHeight = input<number>(450);
	readonly mapWidth = input<number>(screen.width);
	readonly ModelNo = input<string>();
	readonly size = input<number>(0);

	// Constants
	private static readonly DEFAULT_CENTER: google.maps.LatLngLiteral = {
		lat: 51.44157584725519,
		lng: 7.565725496333208,
	};

	protected readonly defaultMarkerPosition = MapsComponent.DEFAULT_CENTER;
	protected readonly markerIcon = {
		url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
	} as const;

	protected readonly mapOptions = signal<google.maps.MapOptions>({
		center: MapsComponent.DEFAULT_CENTER,
		zoom: 8,
	});
	protected readonly currentStore = signal<Store | null>(null);
	protected readonly currentUserLocation = signal<google.maps.LatLngLiteral>({
		lat: 31.4914,
		lng: 74.2385,
	});
	protected readonly directionsResults = signal<google.maps.DirectionsResult | null>(null);

	private readonly allStores = toSignal(this.storeService.store, {
		initialValue: [] as Store[],
	});

	private readonly user = this.userService.user;
	protected readonly hasUser = computed(() => !!this.user());

	protected readonly mapStores = computed<MapStore[]>(() => {
		const stores = this.allStores();
		const locations = this.storeService.storeLocations;
		const modelNo = this.ModelNo();
		const productSize = this.size();

		const paired = stores
			.map((store, storeIndex) => ({ store, position: locations[storeIndex] }))
			.filter(({ position }) => !!position);

		if (!modelNo || !productSize) return paired;

		return paired.filter(({ store }) => this.hasProductInStock(store, modelNo, productSize));
	});

	constructor() {
		const user = this.userService.user();
		if (user?.storeSelected) {
			this.currentStore.set(user.storeSelected);
		}
	}

	protected openInfoWindow(
		marker: MapMarker,
		store: Store,
		_event: google.maps.MapMouseEvent,
	): void {
		this.currentStore.set(store);
		this.infoWindow().open(marker);
	}

	protected onSelectStore(store: Store): void {
		const userUpdate = { name: 'Anonymous', storeSelected: store };
		if (!this.userService.user()) {
			this.userService.addUser(userUpdate);
		} else {
			this.userService.updateSelectedStore(userUpdate);
		}
		this.snackbar.success('Store Selected Successfully');
		this.infoWindow().close();
		this.dialog.closeAll();
	}

	protected onGetCurrentLocation(): void {
		this.mapsService.getCurrentLocation();
		setTimeout(() => {
			const location = this.mapsService.currentLocation;
			this.mapOptions.set({ center: location, zoom: 12 });
			this.currentUserLocation.set(location);
		}, 500);
	}

	protected onGetDirections(location: Location): void {
		this.mapsService.getDirections(location);
		this.mapsService.storeDirectionsResults$.subscribe((result) => {
			this.directionsResults.set(result ?? null);
		});
		this.mapOptions.update((options) => ({ ...options, zoom: 2 }));
	}

	private hasProductInStock(store: Store, modelNo: string, size: number): boolean {
		return store.products.some((product) => {
			if (product.modelNo !== modelNo) return false;
			return product.variants.some((variant) =>
				variant.sizes.some(
					(shoeSize, sizeIndex) => +shoeSize === +size && +variant.inStock[sizeIndex] > 0,
				),
			);
		});
	}
}
