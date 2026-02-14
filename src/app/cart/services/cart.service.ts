import { Injectable, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CartProduct } from '../types/cart.types';
import { SnackbarService } from '../../shared/services/snackbar.service';

const CART_STORAGE_KEY = 'avct_item';

@Injectable()
export class CartService {
	private readonly snackbar = inject(SnackbarService);

	private readonly cartState = signal<CartProduct[]>(this.readCartFromStorage());

	readonly cart = this.cartState.asReadonly();

	readonly cart$ = toObservable(this.cartState);

	addToCart(data: CartProduct): void {
		const cart = this.readCartFromStorage();
		const existingIndex = cart.findIndex(
			(item) =>
				item.modelNo === data.modelNo &&
				item.variantId === data.variantId &&
				item.size === data.size,
		);

		if (existingIndex >= 0) {
			cart[existingIndex] = {
				...cart[existingIndex],
				noOfItems: cart[existingIndex].noOfItems + 1,
			};
		} else {
			cart.push(data);
		}

		this.persistCart(cart);
		this.snackbar.info('Adding Product to Cart');
	}

	removeLocalCartProduct(product: CartProduct): void {
		const cart = this.readCartFromStorage().filter(
			(item) =>
				!(
					item.modelNo === product.modelNo &&
					item.variantId === product.variantId &&
					item.size === product.size
				),
		);
		this.persistCart(cart);
		this.snackbar.warning('Removing product from cart');
	}

	removeAllLocalCartProduct(): void {
		localStorage.removeItem(CART_STORAGE_KEY);
		this.cartState.set([]);
	}

	getLocalCartProducts(): CartProduct[] {
		return this.readCartFromStorage();
	}

	updateNoOfItemsOfProduct(product: CartProduct): void {
		const cart = this.readCartFromStorage().map((item) =>
			item.modelNo === product.modelNo &&
			item.variantId === product.variantId &&
			item.size === product.size
				? { ...item, noOfItems: product.noOfItems }
				: item,
		);
		this.persistCart(cart);
	}

	private readCartFromStorage(): CartProduct[] {
		return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]') as CartProduct[];
	}

	private persistCart(cart: CartProduct[]): void {
		this.cartState.set(cart);
		localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
	}
}
