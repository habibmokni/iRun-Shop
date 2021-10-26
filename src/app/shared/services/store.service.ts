import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Store } from "../models/store.model";
import { map } from "rxjs/operators"
import { Observable, Subject } from "rxjs";
import { Product } from "../models/product.model";


@Injectable()
export class StoreService{

  currentStoreLocation: {lat: number, lng: number} = {lat: 0, lng: 0};
  currentStore: Store;

  selectedStore = new Subject<{address: string, location:{ lat: number, lng:number}}>();
  storeLocations: google.maps.LatLngLiteral[] = [];

  storeSelection!: {address: string, location:{ lat: number, lng:number}};
  private storeCollection!: AngularFirestoreCollection<Store>;
  store!: Observable<Store[]>;


  constructor(private db: AngularFirestore){
    this.storeCollection = db.collection<Store>('storeList');
    this.fetchStore();
    this.getStoreLocations();
    this.currentStore =
      {
        id: "2023",
        name: 'Store 3',
        address: 'Phase 3, Sargodha',
        location: {
          lat: 51.23644756925625,
          lng: 6.7812126558439125
        },
        products: [
          {
            id: 3232,
            name: 'Nike Pink Shoe',
            color: '#590F34',
            subCategory: ['Unisex','blue shoes'],
            price: 799,
            size: 41,
            productImage: '../../assets/images/mehron.png',
            imageList: [
              '../../assets/images/blue.png',
              '../../assets/images/mehron.png',
              '../../assets/images/black.png',
              '../../assets/images/white.png'
            ],
            //availableColors: ['#ADDDDA', '#590F34', '#8C949C', '#C9BDAB'],
            //availableSizes: [41, 42, 43, 44, 45],
            variants: [{
              color: '#ADDDDA',
              sizes: [41, 42, 43, 44, 45],
              inStock: [0,5,10,7,15]
            },
            {
              color: '#590F34',
              sizes: [41, 42, 43, 44, 45],
              inStock: [7,2,15,0,25]
            },
            {
              color: '#8C949C',
              sizes: [41, 42, 43, 44, 45],
              inStock: [20,10,0,7,15]
            },
            {
              color: '#C9BDAB',
              sizes: [41, 42, 43, 44, 45],
              inStock: [10,0,5,2,9]
            }]
          },
          {
            id: 2244,
            name: 'Nike blue Shoe',
            color: '#ADDDDA',
            subCategory: ['Unisex','blue shoes'],
            price: 799,
            size: 41,
            productImage: '../../assets/images/blue.png',
            imageList: [
              '../../assets/images/blue.png',
              '../../assets/images/mehron.png',
              '../../assets/images/black.png',
              '../../assets/images/white.png'
            ],
            //availableColors: ['#ADDDDA', '#590F34', '#8C949C', '#C9BDAB'],
            //availableSizes: [41, 42, 43, 44, 45],
            variants: [{
              color: '#ADDDDA',
                sizes: [41, 42, 43, 44, 45],
                inStock: [0,5,10,7,15]
            },
            {
              color: '#590F34',

                sizes: [41, 42, 43, 44, 45],
                inStock: [7,2,15,0,25]

            },
            {
              color: '#8C949C',

                sizes: [41, 42, 43, 44, 45],
                inStock: [20,10,0,7,15]

            },
            {
              color: '#C9BDAB',

                sizes: [41, 42, 43, 44, 45],
                inStock: [10,0,5,2,9]

            }]
          }
        ],
        //add products here after namaz
        openingTime: {
          open: "10am",
          close: "10pm"
        },
        isDefaultStore: false
      }
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
  //  this.db.collection<{lat: number, lng:number}>('storeLocations')
  //  .snapshotChanges()
  //  .pipe(map(action => {
  //    return action.map(location =>{
  //      return {
  //        ...location.payload.doc.data()
  //      }
  //    })
  //  }))
  //  .subscribe(locations=>{
  //    for(let location of locations){
  //      this.storeLocations.push(location);
  //    }
  //  })
  //this.storeLocations.push(this.store[0].location);
  this.store.forEach(stores=>{
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
