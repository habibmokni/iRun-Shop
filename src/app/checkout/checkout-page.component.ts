import {
	Component,
	ChangeDetectionStrategy,
	inject,
	signal,
	computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, DecimalPipe, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';

import { CartProduct } from '../cart/types/cart.types';
import { Store } from '../stores/types/store.types';
import { Product } from '../products/types/product.types';
import { CartService } from '../cart/services/cart.service';
import { ProductService } from '../products/services/product.service';
import { StoreService } from '../stores/services/store.service';
import { UserService } from '../user/services/user.service';
import { SnackbarService } from '../shared/services/snackbar.service';

import { CheckoutService } from './services/checkout.service';
import {
	BillingFormValue,
	DeliveryType,
	Order,
	PaymentFormValue,
	ShippingFormValue,
} from './types/checkout.types';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { BillingDetailsComponent } from './components/billing-details/billing-details.component';
import { PaymentMethodsComponent } from './components/payment-methods/payment-methods.component';
import { ClickCollectComponent } from './components/click-collect/click-collect.component';

@Component({
	selector: 'app-checkout-page',
	templateUrl: './checkout-page.component.html',
	styleUrls: ['./checkout-page.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ReactiveFormsModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatExpansionModule,
		MatCardModule,
		NgOptimizedImage,
		BillingDetailsComponent,
		PaymentMethodsComponent,
		ClickCollectComponent,
		DatePipe,
		DecimalPipe,
	],
})
export class CheckoutPageComponent {
	private readonly cartService = inject(CartService);
	private readonly productService = inject(ProductService);
	private readonly storeService = inject(StoreService);
	private readonly userService = inject(UserService);
	private readonly checkoutService = inject(CheckoutService);
	private readonly snackbar = inject(SnackbarService);
	private readonly dialog = inject(MatDialog);

	// --- Signals from services ---

	protected readonly user = this.userService.user;
	protected readonly cartProducts = this.cartService.cart;

	private readonly onlineProducts = toSignal(this.productService.productList, {
		initialValue: [] as Product[],
	});

	private readonly stores = toSignal(this.storeService.store, {
		initialValue: [] as Store[],
	});

	protected readonly orderPrice = computed(() =>
		this.checkoutService.calculateOrderPrice(this.cartProducts()),
	);

	protected readonly onlineStockCheck = computed(() =>
		this.checkoutService.checkOnlineStoreStock(this.cartProducts(), this.onlineProducts()),
	);

	// --- Step navigation ---

	/** Which top-level step is active: 0 = Delivery, 1 = Billing & Payment, 2 = Overview */
	protected readonly activeStep = signal(0);

	protected readonly isClickNCollect = signal(true);
	protected readonly cncAllItemsAvailable = signal(true);

	/** Sub-step within the billing/payment step (for accordions). */
	protected readonly step = signal(0);

	protected readonly order = signal<Order | null>(null);

	// --- Forms ---

	protected readonly shippingMethod = new FormGroup({
		type: new FormControl<DeliveryType>('Click & Collect'),
		pickupDate: new FormControl<Date | null>(null, [Validators.required]),
		shippingAddress: new FormControl(this.user()?.storeSelected?.address ?? ''),
		selectedTime: new FormControl('No time selected'),
	});

	protected readonly billing = new FormGroup({
		name: new FormControl('', [Validators.required]),
		email: new FormControl('', [Validators.required]),
		phoneNo: new FormControl('', [Validators.required]),
		address1: new FormControl('', [Validators.required]),
	});

	protected readonly paymentMethod = new FormGroup({
		paymentOption: new FormControl('', [Validators.required]),
	});

	// --- Step navigation methods ---

	protected goToStep(index: number): void {
		if (index <= this.activeStep()) {
			this.activeStep.set(index);
		}
	}

	protected onCncContinue(): void {
		if (this.shippingMethod.invalid) {
			this.snackbar.info('Please select a store, date, and time to proceed');
			return;
		}
		this.activeStep.set(1);
	}

	protected onDeliveryContinue(): void {
		if (this.billing.invalid) {
			this.snackbar.info('Please enter all delivery fields');
			return;
		}
		this.activeStep.set(1);
	}

	protected onBillingContinue(): void {
		if (this.billing.invalid && this.isClickNCollect()) {
			this.snackbar.info('Please enter billing details');
			return;
		}
		if (this.paymentMethod.invalid) {
			this.snackbar.info('Please select a payment method');
			return;
		}
		this.onSubmit();
		this.activeStep.set(2);
	}

	// --- Delivery handlers ---

	protected selectDelivery(type: DeliveryType, index: number): void {
		this.shippingMethod.patchValue({ type });
		this.isClickNCollect.set(index === 0);
		this.shippingMethod.patchValue({
			pickupDate: index === 1 ? new Date() : null,
		});
	}

	protected onStoreChange(store: Store): void {
		this.userService.updateSelectedStore(store);
		this.shippingMethod.patchValue({ shippingAddress: store.address });
	}

	protected onDateSelected(date: Date): void {
		this.shippingMethod.patchValue({ pickupDate: date });
	}

	protected onTimeSelected(time: string): void {
		this.shippingMethod.patchValue({ selectedTime: time });
	}

	protected onProductsToRemove(cartItems: CartProduct[]): void {
		cartItems.forEach((item) => {
			this.cartService.removeLocalCartProduct(item);
		});
	}

	protected onCncItemsAvailable(value: boolean): void {
		this.cncAllItemsAvailable.set(value);
	}

	protected removeProductsUnavailable(): void {
		this.onlineStockCheck().unavailableItems.forEach((item) => {
			this.cartService.removeLocalCartProduct(item);
		});
	}

	// --- Billing sub-step ---

	protected setStep(index: number): void {
		this.step.set(index);
	}

	protected nextStep(): void {
		if (this.billing.valid) {
			this.step.update((current) => current + 1);
		} else {
			this.snackbar.info('Please enter billing details to proceed further');
		}
	}

	protected prevStep(): void {
		this.step.update((current) => current - 1);
	}

	// --- Submit ---

	private onSubmit(): void {
		this.order.set(
			this.checkoutService.buildOrder(
				this.billing.value as BillingFormValue,
				this.shippingMethod.value as ShippingFormValue,
				this.paymentMethod.value as PaymentFormValue,
				this.orderPrice(),
				this.user()?.storeSelected?.id ?? null,
			),
		);
	}

	protected onOrderConfirmation(): void {
		const currentOrder = this.order();
		if (!currentOrder) return;

		this.checkoutService.submitOrder(currentOrder);
		this.userService.addOrder(currentOrder);
		this.dialog.open(OrderSuccessComponent);
	}
}
