import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { CartProduct } from '../../cart/types/cart.types';
import { Product } from '../../products/types/product.types';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { CartService } from '../../cart/services/cart.service';
import {
	BillingFormValue,
	Order,
	PaymentFormValue,
	ShippingFormValue,
	StockCheckResult,
} from '../types/checkout.types';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
	private readonly db = inject(AngularFirestore);
	private readonly snackbar = inject(SnackbarService);
	private readonly cartService = inject(CartService);

	public checkOnlineStoreStock(
		cartProducts: readonly CartProduct[],
		onlineProducts: readonly Product[],
	): StockCheckResult {
		const onlineStock = cartProducts.map((cartItem) => {
			const matchedProduct = onlineProducts.find(
				(product) => product.modelNo === cartItem.modelNo,
			);
			if (!matchedProduct) return 0;

			const matchedVariant = matchedProduct.variants.find(
				(variant) => variant.variantId === cartItem.variantId,
			);
			if (!matchedVariant) return 0;

			const sizeIndex = matchedVariant.sizes.findIndex(
				(shoeSize) => +shoeSize === cartItem.size,
			);
			return sizeIndex >= 0 ? +matchedVariant.inStock[sizeIndex] : 0;
		});

		const unavailableItems = cartProducts.filter(
			(_item, index) => onlineStock[index] === 0,
		);

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
		billing: BillingFormValue,
		shipping: ShippingFormValue,
		payment: PaymentFormValue,
		orderPrice: number,
		storeId: string | null,
	): Order {
		return {
			orderId: Math.floor(Math.random() * 100_000_000),
			billingDetails: {
				name: billing.name ?? null,
				email: billing.email ?? null,
				phoneNo: billing.phoneNo ?? null,
				address1: billing.address1 ?? null,
			},
			productsOrdered: this.cartService.getLocalCartProducts(),
			storeLocation: {
				id: storeId,
				address: shipping.shippingAddress ?? null,
			},
			pickupDate: shipping.pickupDate ?? null,
			pickupType: shipping.type ?? null,
			pickupTime: shipping.selectedTime ?? null,
			paymentOption: payment.paymentOption ?? null,
			orderPrice,
		};
	}

	public submitOrder(order: Order): void {
		this.db.collection<Order>('orderList').add({ ...order });
		this.cartService.removeAllLocalCartProduct();
		this.snackbar.success('Order placed successfully');
	}
}
