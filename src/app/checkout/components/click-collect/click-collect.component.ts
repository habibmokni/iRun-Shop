import {
	Component,
	ChangeDetectionStrategy,
	inject,
	input,
	output,
	signal,
	computed,
	OnInit,
	afterNextRender,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTimepickerModule } from '@angular/material/timepicker';

import { Store } from '../../../stores/types/store.types';
import { StoreCardComponent } from '../../../stores/components/store-card/store-card.component';
import { StoreService } from '../../../stores/services/store.service';
import { MapsService } from '../../../stores/services/maps.service';
import { CartProduct } from '../../../cart/types/cart.types';
import { CartService } from '../../../cart/services/cart.service';
import { User } from '../../../user/types/user.types';

@Component({
	selector: 'app-click-collect',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		DatePipe,
		MatButtonModule,
		MatIconModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatNativeDateModule,
		MatChipsModule,
		MatTimepickerModule,
		StoreCardComponent,
	],
	templateUrl: './click-collect.component.html',
	styleUrl: './click-collect.component.css',
})
export class ClickCollectComponent implements OnInit {
	private readonly storeService = inject(StoreService);
	private readonly mapsService = inject(MapsService);
	private readonly cartService = inject(CartService);

	/** The current user (with optional preselected store). */
	readonly user = input<User | null>(null);

	/** Emitted when the user picks a store. */
	readonly storeChanged = output<Store>();

	/** Emitted when the user picks a date. */
	readonly dateSelected = output<Date>();

	/** Emitted when the user picks a time slot. */
	readonly timeSelected = output<string>();

	/** Emitted with products that are not available at the chosen store. */
	readonly productsToRemove = output<CartProduct[]>();

	/** Emitted with true/false for overall stock availability. */
	readonly isAllItemsAvailable = output<boolean>();

	/** All stores from Firestore. */
	protected readonly stores = toSignal(this.storeService.store, {
		initialValue: [] as Store[],
	});

	/** Cart products. */
	protected readonly cartProducts = this.cartService.cart;

	/** User's current coordinates (null until geolocation resolves). */
	private readonly userLocation = signal<google.maps.LatLngLiteral | null>(null);

	/** Distance in km from the user to each store, keyed by store id. */
	protected readonly distanceMap = computed<Record<string, number>>(() => {
		const loc = this.userLocation();
		const allStores = this.stores();
		if (!loc || !allStores.length) return {};

		const map: Record<string, number> = {};
		for (const store of allStores) {
			if (store.location) {
				map[store.id] = this.mapsService.calculateDistance(
					loc.lat,
					loc.lng,
					store.location.lat,
					store.location.lng,
				);
			}
		}
		return map;
	});

	/** Stock status per store: number of available cart items out of total. Uses 10 for "all available", 0 for "none". */
	protected readonly stockMap = computed<Record<string, number>>(() => {
		const allStores = this.stores();
		const cartItems = this.cartProducts();
		if (!allStores.length || !cartItems.length) return {};

		const map: Record<string, number> = {};
		for (const store of allStores) {
			let allAvailable = true;
			for (const cartItem of cartItems) {
				const storeProduct = store.products?.find((p) => p.modelNo === cartItem.modelNo);
				if (!storeProduct?.variants?.[0]) {
					allAvailable = false;
					break;
				}
				const variant =
					storeProduct.variants.find((v) => v.variantId === cartItem.variantId) ??
					storeProduct.variants[0];
				const sizeIndex = variant.sizes?.indexOf(cartItem.size) ?? -1;
				const stock = sizeIndex >= 0 ? +(variant.inStock?.[sizeIndex] ?? 0) : 0;
				if (stock < cartItem.noOfItems) {
					allAvailable = false;
					break;
				}
			}
			map[store.id] = allAvailable ? 10 : 0;
		}
		return map;
	});

	/** Currently selected store ID. */
	private readonly selectedStoreId = signal<string | null>(null);

	/** Full store object (with products) resolved from the store service. */
	protected readonly selectedStore = computed<Store | null>(() => {
		const id = this.selectedStoreId();
		if (!id) return null;
		return this.stores().find((s) => s.id === id) ?? null;
	});

	/** Selected date. */
	protected readonly selectedDate = signal<Date | null>(null);

	/** Selected time slot. */
	protected readonly selectedTime = signal<string | null>(null);

	/** Minimum date is today. */
	protected readonly minDate = new Date();

	/** Maximum date is 14 days out. */
	protected readonly maxDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

	/** Block weekends (Saturday = 6, Sunday = 0). */
	protected readonly weekdayFilter = (date: Date | null): boolean => {
		const day = (date ?? new Date()).getDay();
		return day !== 0 && day !== 6;
	};

	/** Minimum time based on selected store's opening hours (fallback: 10:00). */
	protected readonly minTime = computed<Date>(() => {
		const store = this.selectedStore();
		const hour = store?.openingTime?.open ? parseInt(store.openingTime.open, 10) : 10;
		const d = new Date();
		d.setHours(isNaN(hour) ? 10 : hour, 0, 0, 0);
		return d;
	});

	/** Maximum time based on selected store's closing hours (fallback: 19:00). */
	protected readonly maxTime = computed<Date>(() => {
		const store = this.selectedStore();
		const hour = store?.openingTime?.close ? parseInt(store.openingTime.close, 10) : 19;
		const d = new Date();
		d.setHours(isNaN(hour) ? 19 : hour, 0, 0, 0);
		return d;
	});

	/** Products from cart that are unavailable at the selected store. */
	protected readonly unavailableProducts = computed<CartProduct[]>(() => {
		const store = this.selectedStore();
		if (!store) return [];

		const cartItems = this.cartProducts();
		const unavailable: CartProduct[] = [];

		for (const cartItem of cartItems) {
			const storeProduct = store.products?.find(
				(product) => product.modelNo === cartItem.modelNo,
			);
			if (!storeProduct) {
				unavailable.push(cartItem);
				continue;
			}

			const variant = storeProduct.variants?.find(
				(variant) => variant.variantId === cartItem.variantId,
			);
			if (!variant) {
				unavailable.push(cartItem);
				continue;
			}

			const sizeIndex = variant.sizes?.indexOf(cartItem.size) ?? -1;
			const stock = sizeIndex >= 0 ? (variant.inStock?.[sizeIndex] ?? 0) : 0;
			if (stock < cartItem.noOfItems) {
				unavailable.push(cartItem);
			}
		}

		return unavailable;
	});

	/** Whether all items are available at the selected store. */
	protected readonly allAvailable = computed(() => this.unavailableProducts().length === 0);

	/** Whether the step is fully complete: store + date + time selected. */
	protected readonly isComplete = computed(
		() =>
			this.selectedStore() !== null &&
			this.selectedDate() !== null &&
			this.selectedTime() !== null &&
			this.allAvailable(),
	);

	constructor() {
		afterNextRender(() => {
			this.mapsService.requestGeolocation().then((coords) => {
				if (coords) this.userLocation.set(coords);
			});
		});
	}

	ngOnInit(): void {
		// Pre-select the user's preferred store if available.
		const userStore = this.user()?.storeSelected;
		if (userStore) {
			this.selectedStoreId.set(userStore.id);

			// Emit initial availability status for the preselected store.
			const unavailable = this.unavailableProducts();
			this.isAllItemsAvailable.emit(unavailable.length === 0);
		}
	}

	protected onSelectStore(store: Store): void {
		this.selectedStoreId.set(store.id);
		this.selectedTime.set(null);
		this.storeChanged.emit(store);

		const unavailable = this.unavailableProducts();
		this.isAllItemsAvailable.emit(unavailable.length === 0);
	}

	protected onDateChange(date: Date | null): void {
		if (!date) return;
		this.selectedDate.set(date);
		this.dateSelected.emit(date);
	}

	protected onTimeChange(value: Date | null): void {
		if (!value) return;
		const hours = value.getHours().toString().padStart(2, '0');
		const minutes = value.getMinutes().toString().padStart(2, '0');
		const time = `${hours}:${minutes}`;
		this.selectedTime.set(time);
		this.timeSelected.emit(time);
	}

	protected removeUnavailable(): void {
		this.productsToRemove.emit(this.unavailableProducts());
	}
}
