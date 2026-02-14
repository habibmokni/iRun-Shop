import { Injectable, signal, computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { User } from '../types/user.types';
import { Store } from '../../stores/types/store.types';
import { Order } from '../../checkout/types/checkout.types';

const USER_STORAGE_KEY = 'user';

@Injectable()
export class UserService {
	readonly user = signal<User | null>(this.loadUser());

	readonly user$ = toObservable(this.user);

	/** Current wishlist as a computed set of model numbers. */
	readonly wishlist = computed(() => new Set(this.user()?.wishlist ?? []));

	/** Current orders list. */
	readonly orders = computed(() => this.user()?.orders ?? []);

	/** Current favorite store. */
	readonly favoriteStore = computed(() => this.user()?.favoriteStore ?? null);

	public addUser(userData: User): void {
		this.saveAndEmit(userData);
	}

	/** Merges the selected store into the existing user without losing profile data. */
	public updateSelectedStore(store: Store): void {
		const current = this.loadUser();
		const updated: User = current
			? { ...current, storeSelected: store }
			: { name: 'Anonymous', storeSelected: store };
		this.saveAndEmit(updated);
	}

	// ── Wishlist ──

	/** Toggles a product in the wishlist. Returns true if added, false if removed. */
	public toggleWishlist(modelNo: string): boolean {
		const current = this.user();
		if (!current) return false;

		const list = current.wishlist ?? [];
		const exists = list.includes(modelNo);
		const updated = exists ? list.filter((id) => id !== modelNo) : [...list, modelNo];
		this.saveAndEmit({ ...current, wishlist: updated });
		return !exists;
	}

	/** Checks if a product model number is in the wishlist. */
	public isInWishlist(modelNo: string): boolean {
		return this.wishlist().has(modelNo);
	}

	// ── Orders ──

	/** Saves a completed order to the user's order history. */
	public addOrder(order: Order): void {
		const current = this.user();
		if (!current) return;

		const orders = [...(current.orders ?? []), order];
		this.saveAndEmit({ ...current, orders });
	}

	// ── Favorite Store ──

	/** Saves a store as the user's favorite. */
	public setFavoriteStore(store: Store): void {
		const current = this.user();
		if (!current) return;

		this.saveAndEmit({ ...current, favoriteStore: store });
	}

	/** Re-reads the user from localStorage into the signal. */
	public reloadUser(): void {
		this.user.set(this.loadUser());
	}

	/** Clears user data from both localStorage and the signal. */
	public clearUser(): void {
		localStorage.removeItem(USER_STORAGE_KEY);
		this.user.set(null);
	}

	private saveAndEmit(userData: User): void {
		localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
		this.user.set(userData);
	}

	private loadUser(): User | null {
		const raw = localStorage.getItem(USER_STORAGE_KEY);
		if (!raw) return null;

		const parsed: unknown = JSON.parse(raw);

		// Handle legacy format where user was wrapped in an array
		if (Array.isArray(parsed)) return (parsed[0] as User) ?? null;

		return parsed as User;
	}
}
