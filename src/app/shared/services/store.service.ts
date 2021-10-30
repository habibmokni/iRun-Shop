import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Store } from "../models/store.model";
import { map } from "rxjs/operators"
import { Observable, Subject } from "rxjs";
import { Product } from "../models/product.model";


@Injectable()
export class StoreService{

  currentStoreLocation: {lat: number, lng: number} = {lat: 0, lng: 0};
  currentStore!: Store;

  selectedStore = new Subject<{address: string, location:{ lat: number, lng:number}}>();
  storeLocations: google.maps.LatLngLiteral[] = [];

  storeSelection!: {address: string, location:{ lat: number, lng:number}};
  private storeCollection!: AngularFirestoreCollection<Store>;
  store!: Observable<Store[]>;


  constructor(private db: AngularFirestore){
    this.storeCollection = db.collection<Store>('storeList');
      //this.updateProducts();
      //this.addStoreToDatabase(this.currentStore);
  }

  fetchStore(){
    this.store = this.storeCollection
    .snapshotChanges()
    .pipe(map(docArray =>{
      return docArray.map(doc => {
        return {
          //id: doc.payload.doc.id,
          ...doc.payload.doc.data() as Store
        }
      })
    }))
    //.subscribe((store)=>{
    //  this.store = store;
    //})
  }
  //fetchStore(){
  //  this.store = this.storeCollection.valueChanges()
  //}
  getStore(){
    return this.store;
  }

  getStoreLocations(){
    this.store.subscribe(stores=>{
      for(let store of stores){
        this.storeLocations.push(store.location);
      }
      console.log(this.storeLocations);
  })
  console.log("store added to store service");
  }
  addStoreToDatabase(store: Store){
    this.db.collection('storeList').add(store);
    console.log("Store created in db");
  }
  addStoreLocations(location: {lat: string, lng: string}){
   this.db.collection('storeLocations').add(location);
  }
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
