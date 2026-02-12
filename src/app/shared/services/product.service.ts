import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';

import { Product } from '../models/product.model';
import { CartProduct } from '../models/cart-product.model';
import { SnackbarService } from './snackbar.service';

const CART_STORAGE_KEY = 'avct_item';
const NEW_PRODUCTS_KEY = 'np_item';

@Injectable()
export class ProductService {
  private readonly snackbar = inject(SnackbarService);
  private readonly db = inject(AngularFirestore);

  private readonly collectionPath = 'onlineStore/MIfAbILeO1O2wcrYubST/productList';

  productList = new Observable<Product[]>();
  product = new Observable<Product[]>();

  selectedModelAndSize: { modelNo: string; size: number } = { modelNo: '', size: 0 };
  orderPrice = 0;
  productsInCart = false;
  allItemsInStock = false;

  readonly cartProductsChanged = new Subject<CartProduct[]>();

  // --- Firestore operations ---

  addProductsToDatabase(products: Product[]): void {
    const collection = this.db.collection<Product>(this.collectionPath);
    products.forEach((product) => collection.add(product));
  }

  fetchProduct(): void {
    this.productList = this.db
      .collection<Product>(this.collectionPath)
      .valueChanges();
  }

  getProductById(key: string): void {
    this.product = this.db
      .collection<Product>(this.collectionPath, (ref) =>
        ref.where('modelNo', '==', key)
      )
      .valueChanges();
  }

  // --- Cart operations (localStorage) ---

  addToCart(data: CartProduct): void {
    const cart = this.getLocalCartProducts();
    const existingIndex = cart.findIndex(
      (item) =>
        item.modelNo === data.modelNo &&
        item.variantId === data.variantId &&
        item.size === data.size
    );

    if (existingIndex >= 0) {
      cart[existingIndex] = {
        ...cart[existingIndex],
        noOfItems: cart[existingIndex].noOfItems + 1,
      };
    } else {
      cart.push(data);
    }

    this.updateCart(cart);
    this.snackbar.info('Adding Product to Cart');
  }

  removeLocalCartProduct(product: CartProduct): void {
    const cart = this.getLocalCartProducts().filter(
      (item) =>
        !(item.modelNo === product.modelNo && item.size === product.size)
    );
    this.updateCart(cart);
    this.snackbar.warning('Removing product from cart');
  }

  removeAllLocalCartProduct(): void {
    localStorage.removeItem(CART_STORAGE_KEY);
    this.cartProductsChanged.next([]);
  }

  getLocalCartProducts(): CartProduct[] {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]');
  }

  updateNoOfItemsOfProduct(product: CartProduct): void {
    const cart = this.getLocalCartProducts().map((item) =>
      item.modelNo === product.modelNo
        ? { ...item, noOfItems: product.noOfItems }
        : item
    );
    this.updateCart(cart);
  }

  // --- New products (admin/seed utility) ---

  addNewProducts(data: Product): void {
    const products: Product[] = JSON.parse(
      localStorage.getItem(NEW_PRODUCTS_KEY) ?? '[]'
    );
    products.push(data);
    localStorage.setItem(NEW_PRODUCTS_KEY, JSON.stringify(products));
  }

  fetchNewProducts(): Product[] {
    return JSON.parse(localStorage.getItem(NEW_PRODUCTS_KEY) ?? '[]');
  }

  // --- Private helpers ---

  private updateCart(cart: CartProduct[]): void {
    this.cartProductsChanged.next(cart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }
}
