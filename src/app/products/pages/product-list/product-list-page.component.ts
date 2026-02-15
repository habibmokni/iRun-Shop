import { Component, ChangeDetectionStrategy, inject, computed, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Product } from '../../types/product.types';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';

@Component({
	selector: 'app-product-list-page',
	templateUrl: './product-list-page.component.html',
	styleUrls: ['./product-list-page.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatIconModule, MatButtonModule, ProductCardComponent, FilterBarComponent],
})
export class ProductListPageComponent {
	private readonly productService = inject(ProductService);

	protected readonly products = toSignal(this.productService.productList, {
		initialValue: [] as Product[],
	});

	protected readonly isLoading = computed(() => this.products().length === 0);

	/** Read the filtered product list from the filter bar child. */
	private readonly filterBar = viewChild(FilterBarComponent);

	protected readonly displayedProducts = computed(() =>
		this.filterBar()?.displayedProducts() ?? this.products(),
	);
}
