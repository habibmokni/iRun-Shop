import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Product } from "../models/product.model";
import { StoreService } from "./store.service";
import { SnackbarService } from "./snackbar.service";
import { Observable, Subject} from "rxjs";

@Injectable()
export class ProductService{

  productList! : Observable<Product[]>;

  product!: Observable<Product[]>;

  productCollection: AngularFirestoreCollection<Product>;

  selectedModelAndSize: {modelNo: string, size: number};
  orderPrice: number = 0;

  productsInCart=false;
  allItemsInStock= false;
  cartProductsChanged = new Subject<Product[]>();

  constructor(private snackBarService: SnackbarService, private storeService: StoreService, private db: AngularFirestore){
    this.selectedModelAndSize = {modelNo: '', size: 0};
    this.productCollection = db.collection<Product>('products');
  }


  addProductToDatabase(product: Product){
    this.db.collection('products').add(product);
    console.log('Add products to database');
  }
  fetchProduct(){
    this.productList = this.db.collection<Product>('products').valueChanges();
  }
  deleteProduct(key: string){
    //this.productList.remove(key);
  }
    // Adding new Product to cart db if logged in else localStorage
    addToCart(data: Product): void {
      const a: Product[] = JSON.parse(localStorage.getItem("avct_item")!) || [];
      let isProduct = false;
      for(let i=0; i<a.length; i++){
        if(a[i].modelNo ===data.modelNo && a[i].size! === data.size){
          a[i].noOfItems!++;
          isProduct = true;
        }
      }
      if(!isProduct){
        a.push(data);
      }
      this.cartProductsChanged.next(a);
      this.snackBarService.info("Adding Product to Cart");
      setTimeout(() => {
        localStorage.setItem("avct_item", JSON.stringify(a));
      }, 500);
    }

    // Removing cart from local
    removeLocalCartProduct(product: Product) {
      const products: Product[] = JSON.parse(localStorage.getItem("avct_item")!);
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

    removeAllLocalCartProduct() {
      const products: Product[] = JSON.parse(localStorage.getItem("avct_item")!);

      for (let i = 0; i < products.length; i++) {
        delete products[i];
      }
      this.cartProductsChanged.next(products);
      // ReAdding the products after remove
      localStorage.removeItem("avct_item");
    }

    // Fetching Locat CartsProducts
    getLocalCartProducts(): Product[] {
      const products: Product[] =
        JSON.parse(window.localStorage.getItem("avct_item")!) || [];
      return products;
    }

    getProductById(key: string) {
    /*  this.productList.forEach(products=>{
        for(let product of products){
          if(product.modelNo === key){
            this.product= product;
            console.log("found the product")
          }
        }
      })*/
      //this.product = this.storeService.store[0].products![key];
      this.product = this.db.collection<Product>('products', ref => ref.where('modelNo', '==', key)).valueChanges();

    }
    updateNoOfItemsOfProduct(product: Product) {
      const products: Product[] = JSON.parse(localStorage.getItem("avct_item")!);
      this.snackBarService.success("Updated products in cart");
      for (let i = 0; i < products.length; i++) {
        if (products[i].id === product.id) {
          products[i].noOfItems = product.noOfItems
          break;
        }
      }
      this.cartProductsChanged.next(products);
      // ReAdding the products after remove
      localStorage.setItem("avct_item", JSON.stringify(products));
    }

}
