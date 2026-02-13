import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Product } from '../types/product.types';

@Injectable()
export class ProductService {
	private readonly db = inject(AngularFirestore);
	private readonly collectionPath = 'productList';
	private readonly collection = this.db.collection<Product>(this.collectionPath);

	/** All products from Firestore (eagerly shared, single connection). */
	readonly productList: Observable<Product[]> = this.collection.snapshotChanges().pipe(
		map((docArray) =>
			docArray.map((doc) => ({ ...doc.payload.doc.data(), docId: doc.payload.doc.id })),
		),
		shareReplay({ bufferSize: 1, refCount: false }),
	);

	/** Fetches products matching the given modelNo. */
	public getProductById(modelNo: string): Observable<Product[]> {
		return this.db
			.collection<Product>(this.collectionPath, (ref) =>
				ref.where('modelNo', '==', modelNo),
			)
			.snapshotChanges()
			.pipe(
				map((docArray) =>
					docArray.map((doc) => ({
						...doc.payload.doc.data(),
						docId: doc.payload.doc.id,
					})),
				),
				shareReplay({ bufferSize: 1, refCount: true }),
			);
	}

	// --- CRUD ---

	/** Adds a product to Firestore. */
	public addProduct(product: Product): void {
		this.collection.add(product);
	}

	/** Updates an existing product by its Firestore document ID. */
	public updateProduct(docId: string, changes: Partial<Product>): void {
		this.collection.doc(docId).update(changes);
	}

	/** Deletes a product by its Firestore document ID. */
	public deleteProduct(docId: string): void {
		this.collection.doc(docId).delete();
	}
}
