import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
  computed,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { DecimalPipe } from '@angular/common';

import { CartProduct } from '../../types/cart.types';
import { Product } from '../../../products/types/product.types';
import { CartService } from '../../services/cart.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { UserService } from '../../../user/services/user.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    MatBottomSheetModule,
    MatDialogModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    DecimalPipe
  ],
})
export class AddToCartComponent {
  private readonly cartService = inject(CartService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly userService = inject(UserService);

  public readonly dialog = inject(MatDialog);

  private readonly productSig = signal<Product>(inject(MAT_DIALOG_DATA));
  public readonly product = this.productSig.asReadonly();

  public readonly user = this.userService.user;

  private readonly noOfItemsSig = signal(1);
  private readonly selectedSizeSig = signal<number | null>(null);

  public readonly noOfItems = this.noOfItemsSig.asReadonly();
  public readonly selectedSize = this.selectedSizeSig.asReadonly();
  public readonly isSizeSelected = computed(
    () => this.selectedSize() !== null
  );

  public readonly stock = computed(() => {
    const size = this.selectedSize();
    const user = this.user();
    const product = this.product();

    if (!user?.storeSelected || !size) return 0;

    const storeProducts = user.storeSelected.products ?? [];
    const storeProduct = storeProducts.find((p: any) => p.modelNo === product.modelNo);
    if (!storeProduct?.variants?.[0]) return 0;

    const sizes = storeProduct.variants[0].sizes ?? [];
    const inStock = storeProduct.variants[0].inStock ?? [];

    const idx = sizes.findIndex((s: any) => s === size);
    return idx === -1 ? 0 : +(inStock[idx] ?? 0);
  });

  public readonly originalPrice = computed(() => {
    const price = this.product().price ?? 0;
    return price + price * 0.2;
  });


  // Public methods (pure where possible)
  public onSizeSelect(size: number): void {
    this.selectedSizeSig.set(size);
  }

  public incrementItems(): void {
    this.noOfItemsSig.update((n) => n + 1);
  }

  public decrementItems(): void {
    this.noOfItemsSig.update((n) => (n > 1 ? n - 1 : 1));
  }

  public addToCart(): void {
    const product = this.product();
    const size = this.selectedSize();
    const stockValue = this.stock();

    if (stockValue === 0) {
      this.snackbarService.info(
        'Please change store as product is not available in selected store'
      );
      return;
    }

    if (!size) {
      this.snackbarService.info('Please select size of product');
      return;
    }

    const cartProduct: CartProduct = {
      productImage: product.imageList?.[0] ?? '',
      modelNo: product.modelNo,
      variantId: product.variants[0].variantId,
      noOfItems: this.noOfItems(),
      size,
      vendor: product.companyName!,
      productName: product.name,
      price: product.price,
    };

    this.cartService.addToCart(cartProduct);
  }
}
