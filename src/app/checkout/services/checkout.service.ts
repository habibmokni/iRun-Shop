import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup } from '@angular/forms';

import { CartProduct } from '../../shared/models/cart-product.model';
import { Product } from '../../shared/models/product.model';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { ProductService } from '../../shared/services/product.service';
import { Order, StockCheckResult } from '../types/checkout.types';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly db = inject(AngularFirestore);
  private readonly snackbar = inject(SnackbarService);
  private readonly productService = inject(ProductService);

  public checkOnlineStoreStock(
    cartProducts: readonly CartProduct[],
    onlineProducts: readonly Product[]
  ): StockCheckResult {
    const onlineStock = cartProducts.map((cartItem) => {
      const product = onlineProducts.find((p) => p.modelNo === cartItem.modelNo);
      if (!product) return 0;

      const variant = product.variants.find((v) => v.variantId === cartItem.variantId);
      if (!variant) return 0;

      const sizeIdx = variant.sizes.findIndex((s) => +s === cartItem.size);
      return sizeIdx >= 0 ? +variant.inStock[sizeIdx] : 0;
    });

    const unavailableItems = cartProducts.filter((_, i) => onlineStock[i] === 0);

    return {
      onlineStock,
      unavailableItems,
      allAvailable: unavailableItems.length === 0,
    };
  }

  public calculateOrderPrice(cartProducts: readonly CartProduct[]): number {
    return cartProducts.reduce((total, item) => total + item.price * item.noOfItems, 0);
  }

  public buildOrder(
    billing: FormGroup,
    shippingMethod: FormGroup,
    paymentMethod: FormGroup,
    orderPrice: number
  ): Order {
    return {
      orderId: Math.floor(Math.random() * 100_000_000),
      billingDetails: {
        name: billing.value.name ?? null,
        email: billing.value.email ?? null,
        phoneNo: billing.value.phoneNo ?? null,
        address1: billing.value.address1 ?? null,
      },
      productsOrdered: this.productService.getLocalCartProducts(),
      storeLocation: {
        id: 2020,
        address: shippingMethod.value.shippingAddress ?? null,
      },
      pickupDate: shippingMethod.value.pickupDate ?? null,
      pickupType: shippingMethod.value.type ?? null,
      pickupTime: shippingMethod.value.selectedTime ?? null,
      paymentOption: paymentMethod.value.paymentOption ?? null,
      orderPrice,
    };
  }

  public submitOrder(order: Order): void {
    this.db.collection<Order>('orderList').add({ ...order });
    this.productService.removeAllLocalCartProduct();
    this.snackbar.success('Order placed successfully');
  }
}
