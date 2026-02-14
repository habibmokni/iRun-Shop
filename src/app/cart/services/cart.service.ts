import { Injectable, computed, inject, signal } from '@angular/core';
import { CartProduct } from '../types/cart.types';
import { SnackbarService } from '../../shared/services/snackbar.service';

const CART_STORAGE_KEY = 'avct_item';

@Injectable()
export class CartService {
	private readonly snackbar = inject(SnackbarService);

	private readonly cartState = signal<CartProduct[]>(this.readFromStorage());

	readonly cart = this.cartState.asReadonly();

	readonly count = computed(() => this.cartState().reduce((sum, item) => sum + item.noOfItems, 0));

	readonly isEmpty = computed(() => this.cartState().length === 0);

	public addToCart(product: CartProduct): void {
		const cart = [...this.cartState()];
		const index = cart.findIndex((item) => this.isSameItem(item, product));

		if (index >= 0) {
			cart[index] = { ...cart[index], noOfItems: cart[index].noOfItems + 1 };
		} else {
			cart.push(product);
		}

		this.persist(cart);
		this.snackbar.success('Added to cart');
	}

	public removeProduct(product: CartProduct): void {
		const cart = this.cartState().filter((item) => !this.isSameItem(item, product));
		this.persist(cart);
		this.snackbar.info('Removed from cart');
	}

	public updateQuantity(product: CartProduct, quantity: number): void {
		const cart = this.cartState().map((item) =>
			this.isSameItem(item, product) ? { ...item, noOfItems: quantity } : item,
		);
		this.persist(cart);
	}

	public clearCart(): void {
		localStorage.removeItem(CART_STORAGE_KEY);
		this.cartState.set([]);
	}

	private isSameItem(a: CartProduct, b: CartProduct): boolean {
		return a.modelNo === b.modelNo && a.variantId === b.variantId && a.size === b.size;
	}

	private readFromStorage(): CartProduct[] {
		return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]') as CartProduct[];
	}

	private persist(cart: CartProduct[]): void {
		this.cartState.set(cart);
		localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
	}
}
