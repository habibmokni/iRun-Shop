import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { Product } from '../types/product.types';

@Injectable()
export class ProductService {
	private readonly db = inject(AngularFirestore);
	private readonly collectionPath = 'productList';

	/** All products from Firestore (eagerly shared, single connection). */
	readonly productList: Observable<Product[]> = this.db
		.collection<Product>(this.collectionPath)
		.valueChanges()
		.pipe(shareReplay({ bufferSize: 1, refCount: false }));

	/** Fetches products matching the given modelNo. */
	public getProductById(modelNo: string): Observable<Product[]> {
		return this.db
			.collection<Product>(this.collectionPath, (ref) =>
				ref.where('modelNo', '==', modelNo),
			)
			.valueChanges()
			.pipe(shareReplay({ bufferSize: 1, refCount: true }));
	}

	// --- Admin / seeding ---

	/** Adds a product directly to Firestore. */
	public addProduct(product: Product): void {
		this.db.collection<Product>(this.collectionPath).add(product);
	}

}
