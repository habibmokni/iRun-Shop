import {
	Component,
	NgZone,
	computed,
	inject,
	signal,
	ChangeDetectionStrategy,
	afterNextRender,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
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
import { StoreCardComponent } from '../../../stores/components/store-card/store-card.component';

export interface StoreAvailabilityDialogData {
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
	selector: 'app-store-availability',
	templateUrl: './store-availability.component.html',
	styleUrls: ['./store-availability.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		MatDividerModule,
		MatTabsModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatInputModule,
		MapsComponent,
		StoreCardComponent,
	],
})
export class StoreAvailabilityComponent {
	// Services
	private readonly ngZone = inject(NgZone);
	private readonly mapService = inject(MapsService);
	private readonly storeService = inject(StoreService);
	private readonly snackbarService = inject(SnackbarService);
	private readonly dialogRef = inject(MatDialogRef);
	private readonly cartService = inject(CartService);
	private readonly userService = inject(UserService);

	protected readonly data = inject<StoreAvailabilityDialogData>(MAT_DIALOG_DATA);

	protected readonly mapDimensions = computed(() => {
		const width = Math.min(window.innerWidth - 48, 700);
		return { height: 400, width };
	});

	protected readonly selectedSize = signal<number | null>(this.data.size ?? null);
	protected readonly nearByStores = signal<NearByStore[]>([]);
	protected readonly pendingStore = signal<Store | null>(null);
	protected readonly step = signal(this.data.size != null ? 1 : 0);

	protected readonly isSizeSelected = computed(() => this.selectedSize() !== null);
	private readonly stores = toSignal(this.storeService.store, { initialValue: [] as Store[] });

	constructor() {
		afterNextRender(() => {
			this.initAutocomplete();
		});
	}

	protected close(): void {
		this.dialogRef.close();
	}

	protected changeSize(size: number): void {
		this.selectedSize.set(size);
		this.nearByStores.set([]);
		this.step.set(1);
	}

	protected resetSize(): void {
		this.selectedSize.set(null);
		this.nearByStores.set([]);
		this.pendingStore.set(null);
		this.step.set(0);
	}

	protected onStoreTap(store: Store): void {
		this.pendingStore.set(store);
	}

	protected confirmStoreSelection(): void {
		const store = this.pendingStore();
		if (!store) return;

		this.userService.updateSelectedStore(store);
		this.userService.setFavoriteStore(store);
		this.snackbarService.success('Store updated');
		this.dialogRef.close();
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
