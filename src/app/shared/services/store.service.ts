import { Injectable, inject } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Store } from "../models/store.model";
import { map } from "rxjs/operators"
import { Observable, Subject } from "rxjs";
import { Product } from "../models/product.model";


@Injectable()
export class StoreService{
  private db = inject(AngularFirestore);

  //stores current store selected by user location
  currentStoreLocation: {lat: number, lng: number} = {lat: 0, lng: 0};
  currentStore!: Store;
  //emits store selected by user
  selectedStore = new Subject<{address: string, location:{ lat: number, lng:number}}>();
  //google LatLng for storing store locations to display marker on maps
  storeLocations: google.maps.LatLngLiteral[] = [];
  //stores all the stores from db
  private storeCollection!: AngularFirestoreCollection<Store>;
  store = new Observable<Store[]>();


  constructor(){
    const db = this.db;

    this.storeCollection = db.collection<Store>('storeList');
      //this.updateProducts();
      //this.addStoreToDatabase(this.currentStore);
  }
  //fetch stores from db
  fetchStore(){
    this.store = this.storeCollection
    .snapshotChanges()
    .pipe(map(docArray =>{
      return docArray.map(doc => {
        return {
          //id: doc.payload.doc.id,  //if want to access the unique id assigned by firebase
          ...doc.payload.doc.data() as Store
        }
      })
    }));
  }
  //access the store observable
  getStore(){
    return this.store;
  }
  //extracts store locations from storelist metadeta
  getStoreLocations(){
    this.store.subscribe(stores=>{
      for(let store of stores){
        this.storeLocations.push(store.location);
      }
      console.log(this.storeLocations);
  })
  console.log("store added to store service");
  }
  //for adding new store to db
  addStoreToDatabase(store: Store){
    this.db.collection('storeList').add(store);
    console.log("Store created in db");
  }
  //for adding storelocations on db separately
  addStoreLocations(location: {lat: string, lng: string}){
   this.db.collection('storeLocations').add(location);
  }
  //for updating the products in stores
  updateProducts(product: Product[]){
    this.db.collection('storeList').doc('/0NbcPR24paLcgaGjTP2k').set(
      {
        products: product
      }, {merge: true}
    )
    this.db.collection('storeList').doc('/7AFgrHEofpBWSEzCoJMF').set(
      {
        products: product
      }, { merge: true}

    )
    this.db.collection('storeList').doc('/7fDIkNnM1LHSD02fM7Xy').set(
      {
        products: product
      }, { merge: true}

    )
    this.db.collection('storeList').doc('/VoGKoXI65hkZEQWdQfsL').set(
      {
        products: product
      }, { merge: true}

    )
    this.db.collection('storeList').doc('/dVaajpuxo1HhEDM66TJX').set(
      {
        products: product
      }, { merge: true}

    )
    console.log("products added to store successfully");
//this.db.collection('productList').add(this.currentStore.products[1]);
  }
}
