import {
  Component,
  ChangeDetectionStrategy,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  inject,
  signal,
  computed,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { CartProduct } from '../cart/types/cart.types';
import { Store } from '../stores/types/store.types';
import { Product } from '../products/types/product.types';
import { CartService } from '../cart/services/cart.service';
import { ProductService } from '../products/services/product.service';
import { StoreService } from '../stores/services/store.service';
import { UserService } from '../user/services/user.service';
import { SnackbarService } from '../shared/services/snackbar.service';

import { CheckoutService } from './services/checkout.service';
import { DeliveryType, Order } from './types/checkout.types';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { BillingDetailsComponent } from './components/billing-details/billing-details.component';
import { PaymentMethodsComponent } from './components/payment-methods/payment-methods.component';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule,
    MatCardModule,
    MatDividerModule,
    NgOptimizedImage,
    BillingDetailsComponent,
    PaymentMethodsComponent,
    DatePipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CheckoutPageComponent {
  private readonly cartService = inject(CartService);
  private readonly productService = inject(ProductService);
  private readonly storeService = inject(StoreService);
  private readonly userService = inject(UserService);
  private readonly checkoutService = inject(CheckoutService);
  private readonly snackbar = inject(SnackbarService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  // --- Signals from services ---

  protected readonly user = this.userService.user;
  protected readonly cartProducts = this.cartService.cart;

  private readonly onlineProducts = toSignal(this.productService.productList, {
    initialValue: [] as Product[],
  });

  private readonly stores = toSignal(this.storeService.store, {
    initialValue: [] as Store[],
  });

  // --- Derived state ---

  protected readonly orderPrice = computed(() =>
    this.checkoutService.calculateOrderPrice(this.cartProducts())
  );

  protected readonly onlineStockCheck = computed(() =>
    this.checkoutService.checkOnlineStoreStock(this.cartProducts(), this.onlineProducts())
  );

  // --- Local UI state ---

  protected readonly isClickNCollect = signal(true);
  protected readonly cncAllItemsAvailable = signal(true);
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

  constructor() {
    // Sync store address when cnc package emits store selection
    this.storeService.selectedStore
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((store) => {
        this.shippingMethod.patchValue({ shippingAddress: store.address });
      });
  }

  // --- Delivery ---

  protected selectDelivery(type: DeliveryType, index: number): void {
    this.shippingMethod.patchValue({ type });
    this.isClickNCollect.set(index === 0);
    this.shippingMethod.patchValue({
      pickupDate: index === 1 ? new Date() : null,
    });
  }

  // --- CNC package bridge ---

  protected onStoreChange(store: Store): void {
    this.userService.updateSelectedStore({ name: 'Anonymous', storeSelected: store });
    this.shippingMethod.patchValue({ shippingAddress: store.address });
  }

  protected onDateSelected(date: Date): void {
    this.shippingMethod.patchValue({ pickupDate: date });
  }

  protected onTimeSelected(time: string): void {
    this.shippingMethod.patchValue({ selectedTime: time });
  }

  protected onProductsToRemove(cartItems: CartProduct[]): void {
    cartItems.forEach((item) => this.cartService.removeLocalCartProduct(item));
  }

  protected onCncItemsAvailable(value: boolean): void {
    this.cncAllItemsAvailable.set(value);
  }

  // --- Remove unavailable products ---

  protected removeProductsUnavailable(): void {
    this.onlineStockCheck().unavailableItems.forEach((item) =>
      this.cartService.removeLocalCartProduct(item)
    );
  }

  // --- Billing accordion ---

  protected setStep(index: number): void {
    this.step.set(index);
  }

  protected nextStep(): void {
    if (this.billing.valid) {
      this.step.update((s) => s + 1);
    } else {
      this.snackbar.info('Please enter billing details to proceed further');
    }
  }

  protected prevStep(): void {
    this.step.update((s) => s - 1);
  }

  // --- Validation hints ---

  protected onCncNext(): void {
    if (this.shippingMethod.invalid) {
      this.snackbar.info('Please select date to proceed');
    }
  }

  protected onDeliveryNext(): void {
    if (this.billing.invalid) {
      this.snackbar.info('Please enter all the fields of delivery');
    }
  }

  // --- Order ---

  protected onSubmit(): void {
    this.order.set(
      this.checkoutService.buildOrder(
        this.billing,
        this.shippingMethod,
        this.paymentMethod,
        this.orderPrice()
      )
    );
  }

  protected onOrderConfirmation(): void {
    const currentOrder = this.order();
    if (!currentOrder) return;

    this.checkoutService.submitOrder(currentOrder);
    this.dialog.open(OrderSuccessComponent);
  }
}
