import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CartProduct } from '../../types/cart.types';
import { Product } from '../../../products/types/product.types';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../../products/services/product.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { UserService } from '../../../user/services/user.service';

interface CartItemStock {
  readonly physical: number;
  readonly online: number;
}

@Component({
  selector: 'app-shopping-cart-page',
  templateUrl: './shopping-cart-page.component.html',
  styleUrls: ['./shopping-cart-page.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatCardModule, MatButtonModule, MatIconModule],
})
export class ShoppingCartPageComponent {
  private readonly cartService = inject(CartService);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly snackbar = inject(SnackbarService);

  private readonly cartProductsSig = signal<CartProduct[]>(
    this.cartService.getLocalCartProducts()
  );
  protected readonly cartProducts = this.cartProductsSig.asReadonly();
  protected readonly hasProducts = computed(() => this.cartProducts().length > 0);

  protected readonly grandTotal = computed(() =>
    this.cartProducts().reduce((sum, p) => sum + p.price * p.noOfItems, 0)
  );

  private readonly user = this.userService.user;

  private readonly onlineProducts = toSignal(this.productService.productList, {
    initialValue: [] as Product[],
  });

  protected readonly stockInfo = computed<CartItemStock[]>(() => {
    const cart = this.cartProducts();
    const user = this.user();
    const storeProducts = user?.storeSelected?.products ?? [];
    const online = this.onlineProducts();

    return cart.map((product) => ({
      physical: this.findStock(product, storeProducts),
      online: this.findStock(product, online),
    }));
  });

  constructor() {
    // productList is lazy-initialized — no need to call fetchProduct()
  }


  protected onAddItem(index: number): void {
    const product = this.cartProducts()[index];
    const stock = this.stockInfo()[index];

    if (
      product.noOfItems > 0 &&
      (product.noOfItems < stock.physical || product.noOfItems < stock.online)
    ) {
      const updated = { ...product, noOfItems: product.noOfItems + 1 };
      this.cartService.updateNoOfItemsOfProduct(updated);
      this.refreshCart();
    }
  }

  protected onRemoveItem(index: number): void {
    const product = this.cartProducts()[index];

    if (product.noOfItems <= 1) {
      this.cartService.removeLocalCartProduct(product);
    } else {
      const updated = { ...product, noOfItems: product.noOfItems - 1 };
      this.cartService.updateNoOfItemsOfProduct(updated);
    }
    this.refreshCart();
  }

  protected onSubmit(): void {
    if (this.hasProducts()) {
      this.router.navigate(['/checkout']);
    } else {
      this.snackbar.info('Please add products to cart!');
    }
  }

  protected stockColor(stock: number): string {
    if (stock > 5) return 'good';
    if (stock > 0) return 'low';
    return 'out';
  }


  private refreshCart(): void {
    this.cartProductsSig.set(this.cartService.getLocalCartProducts());
  }

  private findStock(cartProduct: CartProduct, products: any[]): number {
    const storeProduct = products.find(
      (p: any) => p.modelNo === cartProduct.modelNo
    );
    if (!storeProduct) return 0;

    const variant = storeProduct.variants?.find(
      (v: any) => v.variantId === cartProduct.variantId
    );
    if (!variant) return 0;

    const idx =
      variant.sizes?.findIndex((s: any) => +s === +cartProduct.size) ?? -1;
    return idx === -1 ? 0 : +(variant.inStock[idx] ?? 0);
  }
}
