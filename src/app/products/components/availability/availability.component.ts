import {
	Component,
	NgZone,
	computed,
	inject,
	signal,
	ChangeDetectionStrategy,
	afterNextRender,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { toSignal } from '@angular/core/rxjs-interop';

import { Store } from '../../../stores/types/store.types';
import { CartProduct } from '../../../cart/types/cart.types';
import { MapsService } from '../../../stores/services/maps.service';
import { StoreService } from '../../../stores/services/store.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { CartService } from '../../../cart/services/cart.service';
import { UserService } from '../../../user/services/user.service';
import { MapsComponent } from '../../../stores/components/maps/maps.component';

export interface AvailabilityDialogData {
	readonly call: 'product' | 'checkout';
	readonly size: number | null;
	readonly modelNo: string;
	readonly sizes: number[];
}

export interface NearByStore {
	readonly store: Store;
	readonly distance: number;
	readonly stock: number;
}

@Component({
	selector: 'app-availability',
	templateUrl: './availability.component.html',
	styleUrls: ['./availability.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		MatDividerModule,
		MatTabsModule,
		MatFormFieldModule,
		MatInputModule,
		MapsComponent,
	],
})
export class AvailabilityComponent {
	// Services
	private readonly ngZone = inject(NgZone);
	private readonly mapService = inject(MapsService);
	private readonly storeService = inject(StoreService);
	private readonly snackbarService = inject(SnackbarService);
	private readonly dialog = inject(MatDialog);
	private readonly cartService = inject(CartService);
	private readonly userService = inject(UserService);

	protected readonly data = inject<AvailabilityDialogData>(MAT_DIALOG_DATA);

	protected readonly mapDimensions = computed(() =>
		window.innerWidth <= 599 ? { height: 350, width: 250 } : { height: 410, width: 700 },
	);

	protected readonly selectedSize = signal<number | null>(this.data.size ?? null);
	protected readonly nearByStores = signal<NearByStore[]>([]);

	protected readonly isSizeSelected = computed(() => this.selectedSize() !== null);
	private readonly stores = toSignal(this.storeService.store, { initialValue: [] as Store[] });

	constructor() {
		afterNextRender(() => {
			this.initAutocomplete();
		});
	}

	protected changeSize(size: number): void {
		this.selectedSize.set(size);
		this.nearByStores.set([]);
	}

	protected resetSize(): void {
		this.selectedSize.set(null);
		this.nearByStores.set([]);
	}

	protected onStoreSelect(store: Store): void {
		this.userService.updateSelectedStore(store);
		this.userService.setFavoriteStore(store);
		this.snackbarService.success('Store selected as preferred');
		this.dialog.closeAll();
	}

	protected currentLocation(): void {
		this.mapService.getCurrentLocation();
		setTimeout(() => {
			const loc = this.mapService.currentLocation;
			this.mapService.findClosestMarker(loc.lat, loc.lng);
			this.runAvailabilityCheck();
		}, 1000);
	}

	private initAutocomplete(): void {
		const input = document.getElementById('search') as HTMLInputElement;
		if (!input) return;

		const autocomplete = new google.maps.places.Autocomplete(input, {
			fields: ['formatted_address', 'geometry', 'name'],
			strictBounds: false,
			types: ['establishment'],
		});

		autocomplete.addListener('place_changed', () => {
			this.ngZone.run(() => {
				const place = autocomplete.getPlace();
				if (!place.geometry?.location) return;

				const lat = place.geometry.location.lat();
				const lng = place.geometry.location.lng();

				this.mapService.findClosestMarker(lat, lng);
				this.runAvailabilityCheck();
			});
		});
	}

	private runAvailabilityCheck(): void {
		this.nearByStores.set([]);
		const size = this.selectedSize();

		if (this.data.call === 'product' && size) {
			this.nearByStores.set(this.findNearByStoresForProduct(this.data.modelNo, size));
		}

		if (this.data.call === 'checkout') {
			this.nearByStores.set(
				this.findNearByStoresForCart(this.cartService.cart()),
			);
		}
	}

	private findNearByStoresForProduct(modelNo: string, size: number): NearByStore[] {
		return this.stores()
			.map((store, storeIndex) => {
				const matchedProduct = store.products.find(
					(product) => product.modelNo === modelNo,
				);
				if (!matchedProduct?.variants?.[0]) return null;

				const variant = matchedProduct.variants[0];
				const sizeIndex = variant.sizes.findIndex((shoeSize) => +shoeSize === size);
				if (sizeIndex === -1) return null;

				return {
					store,
					stock: +(variant.inStock[sizeIndex] ?? 0),
					distance: this.mapService.distanceInKm[storeIndex] ?? 0,
				};
			})
			.filter((result): result is NearByStore => result !== null)
			.sort((storeA, storeB) => storeA.distance - storeB.distance);
	}

	private findNearByStoresForCart(cartProducts: CartProduct[]): NearByStore[] {
		return this.stores()
			.map((store, storeIndex) => {
				let allItemsAvailable = true;

				for (const cartProduct of cartProducts) {
					const matchedProduct = store.products.find(
						(product) => product.modelNo === cartProduct.modelNo,
					);
					if (!matchedProduct?.variants?.[0]) {
						allItemsAvailable = false;
						break;
					}

					const variant = matchedProduct.variants[0];
					const sizeIndex = variant.sizes.findIndex(
						(shoeSize) => shoeSize === cartProduct.size,
					);

					if (sizeIndex === -1 || +variant.inStock[sizeIndex] < cartProduct.noOfItems) {
						allItemsAvailable = false;
						break;
					}
				}

				return {
					store,
					stock: allItemsAvailable ? 10 : 0,
					distance: this.mapService.distanceInKm[storeIndex] ?? 0,
				};
			})
			.sort((storeA, storeB) => storeA.distance - storeB.distance);
	}
}
