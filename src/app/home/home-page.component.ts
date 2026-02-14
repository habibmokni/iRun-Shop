import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { Product } from '../products/types/product.types';
import { ProductService } from '../products/services/product.service';
import { ProductCardComponent } from '../products/components/product-card/product-card.component';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		RouterModule,
		MatIconModule,
		ProductCardComponent,
	],
})
export class HomePageComponent {
	private readonly productService = inject(ProductService);

	private readonly products = toSignal(this.productService.productList, {
		initialValue: [] as Product[],
	});

	protected readonly isLoading = computed(() => this.products().length === 0);

	/** First 4 products as "top sellers". */
	protected readonly topSellers = computed(() => this.products().slice(0, 4));

	/** Map of brand name → logo image path. */
	private readonly brandLogoMap: Record<string, string> = {
		ADIDAS: 'assets/images/logos/brands/Adidas_logo.png',
		NIKE: 'assets/images/logos/brands/nike_logo.png',
		'NEW BALANCE': 'assets/images/logos/brands/nb_logo.png',
	};

	/** Unique brand names derived from product data, with optional logo. */
	protected readonly brands = computed(() => {
		const names = this.products()
			.map((product) => product.companyName ?? '')
			.filter((name) => name.length > 0);
		return [...new Set(names)].sort().map((name) => ({
			name,
			logo: this.brandLogoMap[name.toUpperCase()] ?? null,
		}));
	});
}
