import { Injectable, inject, signal } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

import { Product } from '../models/product.model';
import { CartProduct } from '../models/cart-product.model';
import { SnackbarService } from './snackbar.service';

const CART_STORAGE_KEY = 'avct_item';
const NEW_PRODUCTS_KEY = 'np_item';

@Injectable()
export class ProductService {
  private readonly snackbar = inject(SnackbarService);
  private readonly db = inject(AngularFirestore);

  private readonly collectionPath =
    'onlineStore/MIfAbILeO1O2wcrYubST/productList';

  // --- Product list (eagerly shared, single Firestore connection) ---

  readonly productList: Observable<Product[]> = this.db
    .collection<Product>(this.collectionPath)
    .valueChanges()
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  /**
   * @deprecated No longer needed — `productList` is eagerly initialized.
   * Kept for backward compat.
   */
  fetchProduct(): void {}

  // --- Single product query ---

  /** Set by `getProductById()`. @deprecated Use the return value instead. */
  product: Observable<Product[]> = new Observable<Product[]>();

  /**
   * Fetches products matching the given modelNo.
   * Returns the Observable directly (preferred).
   * Also updates `this.product` for backward compat.
   */
  getProductById(modelNo: string): Observable<Product[]> {
    this.product = this.db
      .collection<Product>(this.collectionPath, (ref) =>
        ref.where('modelNo', '==', modelNo)
      )
      .valueChanges()
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    return this.product;
  }

  // --- Cart (signal-based, synced to localStorage) ---

  private readonly cartState = signal<CartProduct[]>(this.readCartFromStorage());

  /** Readonly signal — use `cart()` for current value. */
  readonly cart = this.cartState.asReadonly();

  /** Observable stream for pipe-based consumers. */
  readonly cart$ = toObservable(this.cartState);

  /**
   * @deprecated Use `cart$` instead.
   * Kept for backward compat with unrefactored components.
   */
  readonly cartProductsChanged = this.cart$;

  addToCart(data: CartProduct): void {
    const cart = this.readCartFromStorage();
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

    this.persistCart(cart);
    this.snackbar.info('Adding Product to Cart');
  }

  removeLocalCartProduct(product: CartProduct): void {
    const cart = this.readCartFromStorage().filter(
      (item) =>
        !(item.modelNo === product.modelNo && item.size === product.size)
    );
    this.persistCart(cart);
    this.snackbar.warning('Removing product from cart');
  }

  removeAllLocalCartProduct(): void {
    localStorage.removeItem(CART_STORAGE_KEY);
    this.cartState.set([]);
  }

  getLocalCartProducts(): CartProduct[] {
    return this.readCartFromStorage();
  }

  updateNoOfItemsOfProduct(product: CartProduct): void {
    const cart = this.readCartFromStorage().map((item) =>
      item.modelNo === product.modelNo
        ? { ...item, noOfItems: product.noOfItems }
        : item
    );
    this.persistCart(cart);
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

  private readCartFromStorage(): CartProduct[] {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]');
  }

  private persistCart(cart: CartProduct[]): void {
    this.cartState.set(cart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }
}
