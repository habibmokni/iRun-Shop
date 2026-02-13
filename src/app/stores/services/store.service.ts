import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

import { Store } from '../types/store.types';
import { Product } from '../../products/types/product.types';

@Injectable()
export class StoreService {
	private readonly db = inject(AngularFirestore);
	private readonly storeCollection = this.db.collection<Store>('storeList');

	currentStoreLocation: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
	currentStore!: Store;
	readonly selectedStore = new Subject<{
		address: string;
		location: { lat: number; lng: number };
	}>();

	/** Store locations derived automatically from the store stream. */
	storeLocations: google.maps.LatLngLiteral[] = [];

	/** All stores from Firestore (eagerly shared, single connection). */
	readonly store: Observable<Store[]> = this.storeCollection.snapshotChanges().pipe(
		map((docArray) => docArray.map((doc) => ({ ...doc.payload.doc.data() }))),
		tap((stores) => {
			this.storeLocations = stores.map((s) => s.location);
		}),
		shareReplay({ bufferSize: 1, refCount: false }),
	);

	/** @deprecated No longer needed — `store` is eagerly initialized. */
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	fetchStore(): void {}

	/** @deprecated No longer needed — locations are derived via `tap` in the store stream. */
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	getStoreLocations(): void {}

	// --- Admin/seed utilities ---

	addStoreToDatabase(store: Store): void {
		this.db.collection('storeList').add(store);
	}

	addStoreLocations(location: { lat: string; lng: string }): void {
		this.db.collection('storeLocations').add(location);
	}

	updateProducts(products: Product[]): void {
		const docIds = [
			'0NbcPR24paLcgaGjTP2k',
			'7AFgrHEofpBWSEzCoJMF',
			'7fDIkNnM1LHSD02fM7Xy',
			'VoGKoXI65hkZEQWdQfsL',
			'dVaajpuxo1HhEDM66TJX',
		];

		docIds.forEach((id) =>
			this.db.collection('storeList').doc(id).set({ products }, { merge: true }),
		);
	}
}
