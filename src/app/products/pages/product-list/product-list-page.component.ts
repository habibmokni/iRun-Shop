import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatChipsModule } from '@angular/material/chips';

import { Product } from '../../types/product.types';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
	selector: 'app-product-list-page',
	templateUrl: './product-list-page.component.html',
	styleUrls: ['./product-list-page.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		MatChipsModule,
		ProductCardComponent,
	],
})
export class ProductListPageComponent {
	private readonly productService = inject(ProductService);

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
}
