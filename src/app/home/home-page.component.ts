import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { DecimalPipe } from '@angular/common';

import { Product } from '../products/types/product.types';
import { ProductService } from '../products/services/product.service';
import { AddToCartComponent } from '../cart/components/add-to-cart/add-to-cart.component';
import { ImageSliderComponent } from '../shared/components/image-slider/image-slider.component';

interface BrandTab {
  readonly label: string;
  readonly filter: (p: Product) => boolean;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    ImageSliderComponent,
    DecimalPipe,
  ],
})
export class HomePageComponent {
  private readonly productService = inject(ProductService);
  private readonly dialog = inject(MatDialog);

  private readonly products = toSignal(this.productService.productList, {
    initialValue: [] as Product[],
  });

  protected readonly isLoading = computed(() => this.products().length === 0);

  protected readonly brandTabs: readonly BrandTab[] = [
    { label: 'All', filter: () => true },
    { label: 'Adidas', filter: (p) => p.companyName === 'ADIDAS' },
    { label: 'Nike', filter: (p) => p.companyName === 'NIKE' },
    { label: 'New Balance', filter: (p) => p.companyName === 'NEW BALANCE' },
  ];

  protected readonly filteredProducts = this.brandTabs.map((tab) =>
    computed(() => this.products().filter(tab.filter))
  );

  protected readonly topRatedProducts = computed(() =>
    this.products().slice(0, 3)
  );

  protected readonly tags = [
    'Nike', 'Nike Shoes', 'Power', 'Power Shoes', 'Bata Shoes', 'Service Shoes',
  ] as const;

  protected openDialog(product: Product): void {
    this.dialog.open(AddToCartComponent, {
      data: product,
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '280px',
    });
  }
}
