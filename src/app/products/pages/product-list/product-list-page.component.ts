import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { NgOptimizedImage, DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { Product } from '../../types/product.types';
import { ProductService } from '../../services/product.service';
import { AddToCartComponent } from '../../../cart/components/add-to-cart/add-to-cart.component';

@Component({
	selector: 'app-product-list-page',
	templateUrl: './product-list-page.component.html',
	styleUrls: ['./product-list-page.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgOptimizedImage,
		RouterModule,
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatChipsModule,
		DecimalPipe,
	],
})
export class ProductListPageComponent {
	private readonly productService = inject(ProductService);
	private readonly dialog = inject(MatDialog);

	private readonly products = toSignal(this.productService.productList, {
		initialValue: [] as Product[],
	});

	protected readonly isLoading = computed(() => this.products().length === 0);

	protected readonly brands = computed(() => {
		const names = this.products()
			.map((product) => product.companyName ?? '')
			.filter((name) => name.length > 0);
		return [...new Set(names)].sort();
	});

	protected readonly activeTabIndex = signal(0);

	protected readonly displayedProducts = computed(() => {
		const index = this.activeTabIndex();
		const allProducts = this.products();
		if (index === 0) return allProducts;
		const brand = this.brands()[index - 1];
		return allProducts.filter((product) => product.companyName === brand);
	});

	protected onTabChange(index: number): void {
		this.activeTabIndex.set(index);
	}

	protected openDialog(product: Product): void {
		this.dialog.open(AddToCartComponent, {
			data: product,
			maxWidth: '95vw',
			maxHeight: '90vh',
			width: '400px',
		});
	}
}
