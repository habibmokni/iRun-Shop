import { Injectable, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap, of } from 'rxjs';

import { User } from '../types/user.types';
import { Store } from '../../stores/types/store.types';
import { Order } from '../../checkout/types/checkout.types';

/**
 * User profile service backed by Firestore.
 * Listens to Firebase Auth state and automatically syncs the
 * user document at `users/{uid}` into a reactive signal.
 */
@Injectable()
export class UserService {
	private readonly afAuth = inject(AngularFireAuth);
	private readonly firestore = inject(AngularFirestore);

	/** Current authenticated user's uid. */
	private uid: string | null = null;

	/** Reactive user profile signal — null when logged out. */
	readonly user = signal<User | null>(null);

	/** Observable mirror of the user signal (used by CNC bridge). */
	readonly user$ = toObservable(this.user);

	/** Current wishlist as a computed set of model numbers. */
	readonly wishlist = computed(() => new Set(this.user()?.wishlist ?? []));

	/** Current orders list. */
	readonly orders = computed(() => this.user()?.orders ?? []);

	/** Current favorite store. */
	readonly favoriteStore = computed(() => this.user()?.favoriteStore ?? null);

	constructor() {
		// When auth state changes, subscribe to the matching Firestore doc.
		this.afAuth.authState
			.pipe(
				switchMap((firebaseUser) => {
					if (firebaseUser) {
						this.uid = firebaseUser.uid;
						return this.firestore
							.doc<User>(`users/${firebaseUser.uid}`)
							.valueChanges();
					}
					this.uid = null;
					return of(null);
				}),
				takeUntilDestroyed(),
			)
			.subscribe((userData) => {
				this.user.set(userData ?? null);
			});
	}

	// ── Profile ──

	/** Creates or overwrites the user profile document. */
	async addUser(userData: User): Promise<void> {
		// After register(), the authState subscription may not have fired yet.
		// Fall back to reading the current user directly from Firebase Auth.
		const uid = this.uid ?? (await this.afAuth.currentUser)?.uid;
		if (!uid) return;
		await this.firestore.doc<User>(`users/${uid}`).set(this.sanitize(userData));
	}

	// ── Store selection ──

	/** Merges the selected store into the profile (strips products to save space). */
	async updateSelectedStore(store: Store): Promise<void> {
		if (!this.uid) return;
		const current = this.user();
		const updated: User = current
			? { ...current, storeSelected: this.stripProducts(store) }
			: { name: 'Anonymous', storeSelected: this.stripProducts(store) };
		await this.userDoc().set(this.sanitize(updated));
	}

	// ── Wishlist ──

	/** Toggles a product in the wishlist. Returns true if added, false if removed. */
	async toggleWishlist(modelNo: string): Promise<boolean> {
		const current = this.user();
		if (!current || !this.uid) return false;

		const list = current.wishlist ?? [];
		const exists = list.includes(modelNo);
		const updated = exists ? list.filter((id) => id !== modelNo) : [...list, modelNo];
		await this.userDoc().update({ wishlist: updated });
		return !exists;
	}

	/** Checks if a product model number is in the wishlist. */
	isInWishlist(modelNo: string): boolean {
		return this.wishlist().has(modelNo);
	}

	// ── Orders ──

	/** Saves a completed order to the user's order history. */
	async addOrder(order: Order): Promise<void> {
		const current = this.user();
		if (!current || !this.uid) return;

		const orders = [...(current.orders ?? []), this.sanitize(order)];
		await this.userDoc().update({ orders });
	}

	// ── Favorite Store ──

	/** Saves a store as the user's favorite (strips products). */
	async setFavoriteStore(store: Store): Promise<void> {
		const current = this.user();
		if (!current || !this.uid) return;

		await this.userDoc().update({
			favoriteStore: this.sanitize(this.stripProducts(store)),
		});
	}

	// ── Private helpers ──

	/** Reference to the current user's Firestore document. */
	private userDoc() {
		return this.firestore.doc<User>(`users/${this.uid}`);
	}

	/** Strips the heavy `products` array from a Store before writing. */
	private stripProducts(store: Store): Store {
		const { products, ...rest } = store;
		return { ...rest, products: [] };
	}

	/**
	 * Removes `undefined` values — Firestore rejects them.
	 * Also converts Date objects to ISO strings for safe storage.
	 */
	private sanitize<T>(obj: T): T {
		return JSON.parse(JSON.stringify(obj)) as T;
	}
}
