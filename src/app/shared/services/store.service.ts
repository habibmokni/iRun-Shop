import { Injectable, inject } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '../models/store.model';
import { Product } from '../models/product.model';

@Injectable()
export class StoreService {
  private readonly db = inject(AngularFirestore);
  private readonly storeCollection: AngularFirestoreCollection<Store>;

  currentStoreLocation: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  currentStore!: Store;
  readonly selectedStore = new Subject<{
    address: string;
    location: { lat: number; lng: number };
  }>();
  storeLocations: google.maps.LatLngLiteral[] = [];
  store = new Observable<Store[]>();

  constructor() {
    this.storeCollection = this.db.collection<Store>('storeList');
  }

  fetchStore(): void {
    this.store = this.storeCollection.snapshotChanges().pipe(
      map((docArray) =>
        docArray.map((doc) => ({ ...(doc.payload.doc.data() as Store) }))
      )
    );
  }

  getStoreLocations(): void {
    this.store.subscribe((stores) => {
      this.storeLocations = stores.map((store) => store.location);
    });
  }

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
      this.db
        .collection('storeList')
        .doc(id)
        .set({ products }, { merge: true })
    );
  }
}
