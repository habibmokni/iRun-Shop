import {
  Component,
  ChangeDetectionStrategy,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
  computed,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CartProduct } from 'src/app/shared/models/cart-product.model';
import { Product } from 'src/app/shared/models/product.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddToCartComponent {
  protected readonly product = inject<Product>(MAT_DIALOG_DATA);
  private readonly productService = inject(ProductService);
  private readonly snackbar = inject(SnackbarService);
  private readonly dialog = inject(MatDialog);
  private readonly userService = inject(UserService);

  protected readonly user = this.userService.user;
  private readonly selectedSize = signal(0);
  protected readonly isSizeSelected = signal(false);

  protected readonly originalPrice = computed(
    () => +(this.product.price + this.product.price * 0.2).toFixed(2)
  );

  protected readonly stock = computed(() => {
    const size = this.selectedSize();
    const products = this.user()?.storeSelected?.products ?? [];
    const match = products.find((p: any) => p.modelNo === this.product.modelNo);
    if (!match) return 0;

    const sizeIdx = match.variants[0].sizes.findIndex((s: number) => s === size);
    return sizeIdx >= 0 ? +match.variants[0].inStock[sizeIdx] : 0;
  });

  protected onSizeSelect(size: any): void {
    this.selectedSize.set(+size);
    this.isSizeSelected.set(true);
  }

  protected addToCart(): void {
    if (!this.isSizeSelected()) {
      this.snackbar.info('Please select size of product');
      return;
    }

    if (this.user() && this.stock() === 0) {
      this.snackbar.info(
        'Please change store as product is not available in selected store and online store'
      );
      return;
    }

    const cartProduct: CartProduct = {
      productImage: this.product.variants[0].imageList[0],
      modelNo: this.product.modelNo,
      variantId: this.product.variants[0].variantId,
      noOfItems: 1,
      size: this.selectedSize(),
      vendor: this.product.companyName ?? '',
      productName: this.product.name,
      price: this.product.price,
    };

    this.productService.addToCart(cartProduct);
    this.dialog.closeAll();
  }
}
