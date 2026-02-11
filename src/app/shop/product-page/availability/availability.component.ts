import {
  Component,
  NgZone,
  computed,
  inject,
  signal,
  ChangeDetectionStrategy,
  afterNextRender,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { toSignal } from '@angular/core/rxjs-interop';

import { Store } from 'src/app/shared/models/store.model';
import { CartProduct } from 'src/app/shared/models/cart-product.model';
import { MapsService } from 'src/app/shared/services/maps.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MapsComponent } from 'src/app/maps/maps.component';

export interface NearByStore {
  readonly store: Store;
  readonly distance: number;
  readonly stock: number;
}

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MapsComponent,
  ],
})
export class AvailabilityComponent {
  // Services
  private readonly ngZone = inject(NgZone);
  private readonly mapService = inject(MapsService);
  private readonly storeService = inject(StoreService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly dialog = inject(MatDialog);
  private readonly productService = inject(ProductService);
  private readonly userService = inject(UserService);

  // Dialog data (injected once, immutable)
  protected readonly data: any = inject(MAT_DIALOG_DATA);

  // Responsive map dimensions
  protected readonly mapDimensions = computed(() =>
    window.innerWidth <= 599
      ? { height: 350, width: 250 }
      : { height: 410, width: 700 }
  );

  // State signals
  private readonly selectedSizeSig = signal<number | null>(this.data.size ?? null);
  private readonly nearByStoresSig = signal<NearByStore[]>([]);

  // Template-accessible readonly state
  protected readonly selectedSize = this.selectedSizeSig.asReadonly();
  protected readonly isSizeSelected = computed(() => this.selectedSize() !== null);
  protected readonly nearByStores = this.nearByStoresSig.asReadonly();
  private readonly stores = toSignal(this.storeService.store, { initialValue: [] as Store[] });

  constructor() {
    // Set up Google Places Autocomplete after DOM renders
    afterNextRender(() => this.initAutocomplete());
  }

  // --- Template methods ---

  protected changeSize(size: number): void {
    this.selectedSizeSig.set(size);
    this.nearByStoresSig.set([]);
  }

  protected resetSize(): void {
    this.selectedSizeSig.set(null);
    this.nearByStoresSig.set([]);
  }

  protected onStoreSelect(store: Store): void {
    const userUpdate = { name: 'Anonymous', storeSelected: store };
    if (!this.userService.user) {
      this.userService.addUserTodb(userUpdate);
    } else {
      this.userService.updateSelectedStore(userUpdate);
    }
    this.snackbarService.success('Store selected as preferred');
    this.dialog.closeAll();
  }

  protected currentLocation(): void {
    this.mapService.getCurrentLocation();
    // Geolocation is async; wait for position then recalculate
    setTimeout(() => {
      const loc = this.mapService.currentLocation;
      this.mapService.find_closest_marker(loc.lat, loc.lng);
      this.runAvailabilityCheck();
    }, 1000);
  }

  // --- Private methods ---

  private initAutocomplete(): void {
    const input = document.getElementById('search') as HTMLInputElement;
    if (!input) return;

    const autocomplete = new google.maps.places.Autocomplete(input, {
      fields: ['formatted_address', 'geometry', 'name'],
      strictBounds: false,
      types: ['establishment'],
    });

    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        this.mapService.find_closest_marker(lat, lng);
        this.runAvailabilityCheck();
      });
    });
  }

  private runAvailabilityCheck(): void {
    this.nearByStoresSig.set([]);
    const size = this.selectedSize();

    if (this.data.call === 'product' && size) {
      this.nearByStoresSig.set(
        this.findNearByStoresForProduct(this.data.modelNo, size)
      );
    }

    if (this.data.call === 'checkout') {
      this.nearByStoresSig.set(
        this.findNearByStoresForCart(this.productService.getLocalCartProducts())
      );
    }
  }

  private findNearByStoresForProduct(modelNo: string, size: number): NearByStore[] {
    return this.stores()
      .map((store, i) => {
        const product = store.products.find((p: any) => p.modelNo === modelNo);
        if (!product?.variants?.[0]) return null;

        const variant = product.variants[0];
        const idx = variant.sizes.findIndex((s: any) => +s === size);
        if (idx === -1) return null;

        return {
          store,
          stock: +(variant.inStock[idx] ?? 0),
          distance: this.mapService.distanceInKm[i] ?? 0,
        };
      })
      .filter((r): r is NearByStore => r !== null)
      .sort((a, b) => a.distance - b.distance);
  }

  private findNearByStoresForCart(cartProducts: CartProduct[]): NearByStore[] {
    return this.stores()
      .map((store, i) => {
        let stockLevel = 0;

        for (const cartProduct of cartProducts) {
          const storeProduct = store.products.find(
            (p: any) => p.modelNo === cartProduct.modelNo
          );
          if (!storeProduct?.variants?.[0]) continue;

          const variant = storeProduct.variants[0];
          const idx = variant.sizes.findIndex((s: any) => s === cartProduct.size);
          if (idx === -1) continue;

          stockLevel = +variant.inStock[idx] >= cartProduct.noOfItems ? 10 : 0;
        }

        return {
          store,
          stock: stockLevel,
          distance: this.mapService.distanceInKm[i] ?? 0,
        };
      })
      .sort((a, b) => a.distance - b.distance);
  }
}
