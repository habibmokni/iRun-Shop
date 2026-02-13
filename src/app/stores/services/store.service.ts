import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

import { Store } from '../types/store.types';
import { Product } from '../../products/types/product.types';

@Injectable()
export class StoreService {
	private readonly db = inject(AngularFirestore);
	private readonly storeCollection = this.db.collection<Store>('storeList');

	/** Store locations derived from the store stream via tap. */
	storeLocations: google.maps.LatLngLiteral[] = [];

	/** All stores from Firestore (eagerly shared, single connection). */
	readonly store: Observable<Store[]> = this.storeCollection.snapshotChanges().pipe(
		map((docArray) =>
			docArray.map((doc) => ({ ...doc.payload.doc.data(), id: doc.payload.doc.id })),
		),
		tap((stores) => {
			this.storeLocations = stores.map((store) => store.location);
		}),
		shareReplay({ bufferSize: 1, refCount: false }),
	);

	// --- Admin / seeding ---

	public addStore(store: Store): void {
		this.storeCollection.add(store);
	}

	public updateStoreProducts(storeId: string, products: Product[]): void {
		this.storeCollection.doc(storeId).update({ products });
	}
}
