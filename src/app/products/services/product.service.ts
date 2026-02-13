import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { Product } from '../types/product.types';

const NEW_PRODUCTS_KEY = 'np_item';

@Injectable()
export class ProductService {
	private readonly db = inject(AngularFirestore);

	private readonly collectionPath = 'onlineStore/MIfAbILeO1O2wcrYubST/productList';

	// --- Product list (eagerly shared, single Firestore connection) ---

	readonly productList: Observable<Product[]> = this.db
		.collection<Product>(this.collectionPath)
		.valueChanges()
		.pipe(shareReplay({ bufferSize: 1, refCount: false }));

	/**
	 * @deprecated No longer needed — `productList` is eagerly initialized.
	 * Kept for backward compat.
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	fetchProduct(): void {}

	// --- Single product query ---

	/** Set by `getProductById()`. @deprecated Use the return value instead. */
	product: Observable<Product[]> = new Observable<Product[]>();

	/**
	 * Fetches products matching the given modelNo.
	 * Returns the Observable directly (preferred).
	 * Also updates `this.product` for backward compat.
	 */
	getProductById(modelNo: string): Observable<Product[]> {
		this.product = this.db
			.collection<Product>(this.collectionPath, (ref) => ref.where('modelNo', '==', modelNo))
			.valueChanges()
			.pipe(shareReplay({ bufferSize: 1, refCount: true }));
		return this.product;
	}

	// --- New products (admin/seed utility) ---

	addNewProducts(data: Product): void {
		const products: Product[] = JSON.parse(localStorage.getItem(NEW_PRODUCTS_KEY) ?? '[]');
		products.push(data);
		localStorage.setItem(NEW_PRODUCTS_KEY, JSON.stringify(products));
	}

	fetchNewProducts(): Product[] {
		return JSON.parse(localStorage.getItem(NEW_PRODUCTS_KEY) ?? '[]');
	}
}
