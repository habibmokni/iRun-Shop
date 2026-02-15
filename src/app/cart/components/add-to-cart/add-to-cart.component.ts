import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { DecimalPipe } from '@angular/common';
import { CartProduct } from '../../types/cart.types';
import { Product } from '../../../products/types/product.types';
import { CartService } from '../../services/cart.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { UserService } from '../../../user/services/user.service';
import { SizeSelectorComponent as CncSizeSelectorComponent } from '@habibmokni/cnc';

@Component({
	selector: 'app-add-to-cart',
	templateUrl: './add-to-cart.component.html',
	styleUrls: ['./add-to-cart.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		MatBottomSheetModule,
		MatDialogModule,
		MatExpansionModule,
		MatButtonModule,
		MatIconModule,
		MatRadioModule,
		DecimalPipe,
		CncSizeSelectorComponent,
	],
})
export class AddToCartComponent {
	private readonly cartService = inject(CartService);
	private readonly snackbarService = inject(SnackbarService);
	private readonly userService = inject(UserService);

	public readonly dialog = inject(MatDialog);

	protected readonly product: Product = inject<Product>(MAT_DIALOG_DATA);

	public readonly user = this.userService.user;

	protected readonly noOfItems = signal(1);
	protected readonly selectedSize = signal<number | null>(null);
	public readonly isSizeSelected = computed(() => this.selectedSize() !== null);

	public readonly stock = computed(() => {
		const size = this.selectedSize();
		const user = this.user();

		if (!user?.storeSelected || !size) return 0;

		const storeProducts = user.storeSelected.products;
		const matchedProduct = storeProducts.find(
			(product) => product.modelNo === this.product.modelNo,
		);
		if (!matchedProduct?.variants[0]) return 0;

		const sizes = matchedProduct.variants[0].sizes;
		const inStock = matchedProduct.variants[0].inStock;

		const sizeIndex = sizes.findIndex((shoeSize) => shoeSize === size);
		return sizeIndex === -1 ? 0 : inStock[sizeIndex];
	});

	public readonly originalPrice = this.product.price * 1.2;

	public onSizeSelected(size: number): void {
		this.selectedSize.set(size);
	}

	public incrementItems(): void {
		this.noOfItems.update((count) => count + 1);
	}

	public decrementItems(): void {
		this.noOfItems.update((count) => (count > 1 ? count - 1 : 1));
	}

	public addToCart(): void {
		const size = this.selectedSize();
		const stockValue = this.stock();

		if (stockValue === 0) {
			this.snackbarService.info(
				'Please change store as product is not available in selected store',
			);
			return;
		}

		if (!size) {
			this.snackbarService.info('Please select size of product');
			return;
		}

		const cartProduct: CartProduct = {
			productImage: this.product.imageList?.[0] ?? '',
			modelNo: this.product.modelNo,
			variantId: this.product.variants[0].variantId,
			noOfItems: this.noOfItems(),
			size,
			vendor: this.product.companyName ?? '',
			productName: this.product.name,
			price: this.product.price,
		};

		this.cartService.addToCart(cartProduct);
	}
}
