import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';

import { CartProduct } from '../../../cart/types/cart.types';
import { Product } from '../../types/product.types';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../../cart/services/cart.service';
import { AddToCartComponent } from '../../../cart/components/add-to-cart/add-to-cart.component';

@Component({
	selector: 'app-product-list',
	templateUrl: './product-list.component.html',
	styleUrls: ['./product-list.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		AsyncPipe,
		NgOptimizedImage,
		RouterModule,
		MatBottomSheetModule,
		MatDialogModule,
		MatButtonModule,
		MatCardModule,
		MatIconModule,
		MatTabsModule,
		MatProgressSpinnerModule,
	],
})
export class ProductListComponent implements OnInit {
	private readonly productService = inject(ProductService);
	private readonly cartService = inject(CartService);
	private readonly dialog = inject(MatDialog);

	productList = new Observable<Product[]>();
	isLoading = true;
	adidasProducts: Product[] = [];
	nikeProducts: Product[] = [];
	balanceProducts: Product[] = [];

	ngOnInit(): void {
		this.productList = this.productService.productList;
		this.productList.subscribe((products) => {
			this.isLoading = false;
			for (const product of products) {
				if (product.companyName === 'ADIDAS') {
					this.adidasProducts.push(product);
				}
				if (product.companyName === 'NIKE') {
					this.nikeProducts.push(product);
				}
				if (product.companyName === 'NEW BALANCE') {
					this.balanceProducts.push(product);
				}
			}
		});
		this.isLoading = false;
	}

	addToCart(product: CartProduct) {
		product.noOfItems = 1;
		this.cartService.addToCart(product);
	}
	openDialog(product: Product) {
		this.dialog.open(AddToCartComponent, {
			data: product,
			maxWidth: '100vw',
			maxHeight: '100vh',
			width: '90%',
		});
	}
}
