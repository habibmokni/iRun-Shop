import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { NgOptimizedImage, DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


import { Product } from '../products/types/product.types';
import { ProductService } from '../products/services/product.service';
import { UserService } from '../user/services/user.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { AddToCartComponent } from '../cart/components/add-to-cart/add-to-cart.component';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgOptimizedImage,
		RouterModule,
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		DecimalPipe,
	],
})
export class HomePageComponent {
	private readonly productService = inject(ProductService);
	private readonly userService = inject(UserService);
	private readonly snackbar = inject(SnackbarService);
	private readonly dialog = inject(MatDialog);

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

	protected isWishlisted(modelNo: string): boolean {
		return this.userService.isInWishlist(modelNo);
	}

	protected toggleWishlist(modelNo: string): void {
		if (!this.userService.user()) {
			this.snackbar.info('Please log in to use the wishlist');
			return;
		}
		const added = this.userService.toggleWishlist(modelNo);
		this.snackbar.success(added ? 'Added to wishlist' : 'Removed from wishlist');
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
