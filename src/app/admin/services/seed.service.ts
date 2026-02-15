import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SEED_PRODUCTS, SEED_STORES } from '../consts/products-data';

@Injectable({ providedIn: 'root' })
export class SeedService {
	private readonly db = inject(AngularFirestore);

	public async seedDatabase(): Promise<{ products: number; stores: number }> {
		// 1. Clear existing data
		await this.clearCollection('productList');
		await this.clearCollection('storeList');

		// 2. Seed products
		const productBatch = this.db.firestore.batch();
		for (const product of SEED_PRODUCTS) {
			const ref = this.db.firestore.collection('productList').doc();
			productBatch.set(ref, product);
		}
		await productBatch.commit();

		// 3. Seed stores
		const storeBatch = this.db.firestore.batch();
		for (const store of SEED_STORES) {
			const ref = this.db.firestore.collection('storeList').doc();
			storeBatch.set(ref, store);
		}
		await storeBatch.commit();

		return { products: SEED_PRODUCTS.length, stores: SEED_STORES.length };
	}

	private async clearCollection(path: string): Promise<void> {
		const snapshot = await this.db.firestore.collection(path).get();
		if (snapshot.empty) return;

		const batch = this.db.firestore.batch();
		for (const doc of snapshot.docs) {
			batch.delete(doc.ref);
		}
		await batch.commit();
	}
}
