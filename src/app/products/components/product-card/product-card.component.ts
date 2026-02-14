import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { NgOptimizedImage, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { Product } from '../../types/product.types';
import { UserService } from '../../../user/services/user.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { AddToCartComponent } from '../../../cart/components/add-to-cart/add-to-cart.component';

@Component({
	selector: 'app-product-card',
	templateUrl: './product-card.component.html',
	styleUrls: ['./product-card.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgOptimizedImage,
		RouterModule,
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		DecimalPipe,
	],
})
export class ProductCardComponent {
	readonly product = input.required<Product>();
	readonly showCategory = input(false);

	private readonly userService = inject(UserService);
	private readonly snackbar = inject(SnackbarService);
	private readonly dialog = inject(MatDialog);

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
