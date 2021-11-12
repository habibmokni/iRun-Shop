import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Product } from "../models/product.model";
import { StoreService } from "./store.service";
import { SnackbarService } from "./snackbar.service";
import { Observable, Subject} from "rxjs";
import { CartProduct } from "../models/cartProduct.model";

@Injectable()
export class ProductService{

  //stores products List from db
  productList = new Observable<Product[]>();
  product = new Observable<Product[]>();
  //size and model no from product page to centralize among whole app
  selectedModelAndSize: {modelNo: string, size: number};
  orderPrice: number = 0;
  //centerlized checks either product in cart and all items in stock
  productsInCart=false;
  allItemsInStock= false;
  //for emitting changed cart products
  cartProductsChanged = new Subject<CartProduct[]>();

  constructor(
    private snackBarService: SnackbarService,
    private db: AngularFirestore
    ){
      this.selectedModelAndSize = {modelNo: '', size: 0};
  }
  //adds product to firebase db online store
  addProductsToDatabase(products: Product[]){
    for(let product of products){
      console.log('loop ran');
      this.db.collection<Product>('onlineStore/MIfAbILeO1O2wcrYubST/productList').add(product);
    }
    console.log('Add products to database successfull');
  }
  //fetches products from firebase db
  fetchProduct(){
    this.productList = this.db.collection<Product>('onlineStore/MIfAbILeO1O2wcrYubST/productList').valueChanges()
  }
  //for deleting a specifi product
  deleteProduct(key: string){
    //this.productList.remove(key);
  }
    // Adding new Product to cart db if logged in else localStorage
    addToCart(data: CartProduct): void {
      const a: CartProduct[] = JSON.parse(localStorage.getItem("avct_item")!) || [];
      let isProduct = false;
      for(let i=0; i<a.length; i++){
        if(a[i].modelNo ===data.modelNo && a[i].variantId===data.variantId && a[i].size === data.size){
          a[i].noOfItems++;
          isProduct = true;
        }
      }
      if(!isProduct){
        a.push(data);
      }
      //emits new cart products to whole app
      this.cartProductsChanged.next(a);
      this.snackBarService.info("Adding Product to Cart");
      setTimeout(() => {
        localStorage.setItem("avct_item", JSON.stringify(a));
      }, 500);
    }

    // Removing cart products from local storage
    removeLocalCartProduct(product: CartProduct) {
      const products: CartProduct[] = JSON.parse(localStorage.getItem("avct_item")!);
      this.snackBarService.warning("Removing product from cart");
      for (let i = 0; i < products.length; i++) {
        if (products[i].modelNo === product.modelNo && products[i].size === product.size) {
          products.splice(i, 1);
          break;
        }
      }
      this.cartProductsChanged.next(products);
      // ReAdding the products after remove
      localStorage.setItem("avct_item", JSON.stringify(products));
    }
    //removing complete cart
    removeAllLocalCartProduct() {
      const products: CartProduct[] = JSON.parse(localStorage.getItem("avct_item")!);

      for (let i = 0; i < products.length; i++) {
        delete products[i];
      }
      this.cartProductsChanged.next(products);
      // Removing the local storage after remove of products
      localStorage.removeItem("avct_item");
    }

    // Fetching Locat CartsProducts
    getLocalCartProducts(): CartProduct[] {
      const products: CartProduct[] =
        JSON.parse(window.localStorage.getItem("avct_item")!) || [];
      return products;
    }
    //fetch a single product by id
    getProductById(key: string) {
      this.product = this.db.collection<Product>('onlineStore/MIfAbILeO1O2wcrYubST/productList', ref => ref.where('modelNo', '==', key)).valueChanges();
    }
    //to update noOfItems ordered by the user
    updateNoOfItemsOfProduct(product: CartProduct) {
      const products: CartProduct[] = JSON.parse(localStorage.getItem("avct_item")!);
      for (let i = 0; i < products.length; i++) {
        if (products[i].modelNo === product.modelNo) {
          products[i].noOfItems = product.noOfItems
          break;
        }
      }
      this.cartProductsChanged.next(products);
      // ReAdding the products after remove
      localStorage.setItem("avct_item", JSON.stringify(products));
    }
    //add new product to cart
    addNewProducts(data: Product): void {
      const a: Product[] = JSON.parse(localStorage.getItem("np_item")!) || [];
      a.push(data);
        localStorage.setItem("np_item", JSON.stringify(a));
        console.log(a);
    }
    //fetch new products from cart [Note: used for db structure upgrade]
    fetchNewProducts(){
      const a: Product[] = JSON.parse(localStorage.getItem("np_item")!) || [];
      return a
    }


}
