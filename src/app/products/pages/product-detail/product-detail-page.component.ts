import {
  Component,
  ChangeDetectionStrategy,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { BehaviorSubject, filter, map, switchMap } from 'rxjs';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Material
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';

// App
import { CartProduct } from '../../../cart/types/cart.types';
import { Product } from '../../types/product.types';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../../cart/services/cart.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { UserService } from '../../../user/services/user.service';
import { ImageSliderComponent } from '../../../shared/components/image-slider/image-slider.component';
import { AvailabilityComponent } from '../../components/availability/availability.component';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.css'],
  imports: [
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatChipsModule,
    MatExpansionModule,
    ImageSliderComponent,
    DecimalPipe,
  ],
})
export class ProductDetailPageComponent {
  // Services
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly userService = inject(UserService);
  private readonly snackbar = inject(SnackbarService);

  // Product loading (supports both route navigation and variant switching)
  private readonly productModelNo$ = new BehaviorSubject<string>('');

  private readonly products$ = this.productModelNo$.pipe(
    filter((id) => !!id),
    switchMap((id) => this.productService.getProductById(id))
  );

  protected readonly products = toSignal(this.products$, {
    initialValue: [] as Product[],
  });
  protected readonly product = computed(() => this.products()[0] ?? null);

  // Similar products (same model family prefix)
  private readonly allProducts = toSignal(this.productService.productList, {
    initialValue: [] as Product[],
  });
  protected readonly similarProducts = computed(() => {
    const current = this.product();
    const all = this.allProducts();
    if (!current?.modelNo || !all.length) return [];
    const prefix = current.modelNo.split('-')[0];
    return all.filter((p) => p.modelNo?.split('-')[0] === prefix);
  });

  // Local state signals
  private readonly selectedSizeSig = signal(0);
  private readonly isSizeSelectedSig = signal(false);
  private readonly activeVariantIndexSig = signal(-1);

  protected readonly selectedSize = this.selectedSizeSig.asReadonly();
  protected readonly isSizeSelected = this.isSizeSelectedSig.asReadonly();
  protected readonly activeVariantIndex = this.activeVariantIndexSig.asReadonly();

  // User (reactive via BehaviorSubject)
  private readonly user = this.userService.user;

  // Derived: stock for the selected size at the user's store
  protected readonly stock = computed(() => {
    const product = this.product();
    const size = this.selectedSize();
    const user = this.user();

    if (!product || !size || !user?.storeSelected) return 0;

    const storeProduct = user.storeSelected.products?.find(
      (p: any) => p.modelNo === product.modelNo
    );
    if (!storeProduct?.variants?.[0]) return 0;

    const variant = storeProduct.variants[0];
    const idx = variant.sizes.findIndex((s: any) => s === size);
    return idx === -1 ? 0 : +(variant.inStock[idx] ?? 0);
  });

  // Derived: original price before discount
  protected readonly originalPrice = computed(() => {
    const price = this.product()?.price ?? 0;
    return price + price * 0.2;
  });

  constructor() {
    // Route params → product model number
    this.route.params
      .pipe(
        map((params) => params['id'] as string),
        takeUntilDestroyed()
      )
      .subscribe((id) => this.productModelNo$.next(id));
  }

  // --- Template methods ---

  protected sizeSelected(size: number): void {
    this.selectedSizeSig.set(size);
    this.isSizeSelectedSig.set(true);
  }

  protected variantSelect(index: number, modelNo: string): void {
    this.productModelNo$.next(modelNo);
    this.activeVariantIndexSig.set(index);
  }

  protected addToCart(): void {
    const product = this.product();
    if (!product) return;

    if (!this.isSizeSelected()) {
      this.snackbar.info(
        this.stock() === 0
          ? 'Please change store as product is not available in selected store'
          : 'Please select size of product'
      );
      return;
    }

    const cartProduct: CartProduct = {
      productImage: product.imageList?.[0] ?? '',
      modelNo: product.modelNo,
      variantId: product.variants?.[0]?.variantId ?? '',
      noOfItems: 1,
      size: +this.selectedSize(),
      vendor: product.companyName ?? '',
      productName: product.name,
      price: product.price,
    };

    this.cartService.addToCart(cartProduct);
  }

  protected checkAvailability(): void {
    const product = this.product();
    if (!product) return;

    this.dialog.open(AvailabilityComponent, {
      data: {
        call: 'product',
        size: this.selectedSize(),
        modelNo: product.modelNo,
        sizes: product.variants?.[0]?.sizes ?? [],
      },
      maxWidth: '100vw',
      maxHeight: '100vh',
    });
  }
}
