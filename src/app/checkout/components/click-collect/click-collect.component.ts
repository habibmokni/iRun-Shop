import {
	Component,
	ChangeDetectionStrategy,
	inject,
	input,
	output,
	signal,
	computed,
	OnInit,
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

import { Store } from '../../../stores/types/store.types';
import { StoreService } from '../../../stores/services/store.service';
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
	],
	templateUrl: './click-collect.component.html',
	styleUrl: './click-collect.component.css',
})
export class ClickCollectComponent implements OnInit {
	private readonly storeService = inject(StoreService);
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

	/** Currently selected store. */
	protected readonly selectedStore = signal<Store | null>(null);

	/** Selected date. */
	protected readonly selectedDate = signal<Date | null>(null);

	/** Selected time slot. */
	protected readonly selectedTime = signal<string | null>(null);

	/** Minimum date is today. */
	protected readonly minDate = new Date();

	/** Maximum date is 14 days out. */
	protected readonly maxDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

	/** Available time slots for the selected store. */
	protected readonly timeSlots = computed<string[]>(() => {
		const store = this.selectedStore();
		if (!store) return [];

		const open = parseInt(store.openingTime?.open ?? '9', 10);
		const close = parseInt(store.openingTime?.close ?? '18', 10);
		const slots: string[] = [];
		for (let hour = open; hour < close; hour++) {
			slots.push(`${hour.toString().padStart(2, '0')}:00`);
			slots.push(`${hour.toString().padStart(2, '0')}:30`);
		}
		return slots;
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
	protected readonly allAvailable = computed(
		() => this.unavailableProducts().length === 0,
	);

	/** Whether the step is fully complete: store + date + time selected. */
	protected readonly isComplete = computed(
		() =>
			this.selectedStore() !== null &&
			this.selectedDate() !== null &&
			this.selectedTime() !== null &&
			this.allAvailable(),
	);

	ngOnInit(): void {
		// Pre-select the user's preferred store if available.
		const userStore = this.user()?.storeSelected;
		if (userStore) {
			this.selectedStore.set(userStore);
		}
	}

	protected onSelectStore(store: Store): void {
		this.selectedStore.set(store);
		this.selectedTime.set(null);
		this.storeChanged.emit(store);

		// Emit availability immediately.
		const unavailable = this.unavailableProducts();
		this.isAllItemsAvailable.emit(unavailable.length === 0);
		if (unavailable.length > 0) {
			this.productsToRemove.emit(unavailable);
		}
	}

	protected onDateChange(date: Date | null): void {
		if (!date) return;
		this.selectedDate.set(date);
		this.dateSelected.emit(date);
	}

	protected onTimeSelect(time: string): void {
		this.selectedTime.set(time);
		this.timeSelected.emit(time);
	}

	protected removeUnavailable(): void {
		this.productsToRemove.emit(this.unavailableProducts());
	}
}
