import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { BehaviorSubject, filter, map, switchMap } from 'rxjs';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Material
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

// App
import { CartProduct } from '../../../cart/types/cart.types';
import { Product } from '../../types/product.types';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../../cart/services/cart.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { UserService } from '../../../user/services/user.service';
import {
	StoreAvailabilityComponent,
	StoreAvailabilityDialogData,
} from '../../components/store-availability/store-availability.component';
import { SizeSelectorComponent } from '../../../shared/components/size-selector/size-selector.component';
import { ImageGalleryComponent } from '../../components/image-gallery/image-gallery.component';

@Component({
	selector: 'app-product-detail-page',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './product-detail-page.component.html',
	styleUrls: ['./product-detail-page.component.css'],
	imports: [
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatExpansionModule,
		NgOptimizedImage,
		DecimalPipe,
		SizeSelectorComponent,
	],
})
export class ProductDetailPageComponent {
	// Services
	private readonly route = inject(ActivatedRoute);
	private readonly dialog = inject(MatDialog);
	private readonly productService = inject(ProductService);
	private readonly cartService = inject(CartService);
	private readonly userService = inject(UserService);
	private readonly snackbar = inject(SnackbarService);

	// Product loading (supports both route navigation and variant switching)
	private readonly productModelNo$ = new BehaviorSubject<string>('');

	private readonly products$ = this.productModelNo$.pipe(
		filter((modelNo) => !!modelNo),
		switchMap((modelNo) => this.productService.getProductById(modelNo)),
	);

	protected readonly products = toSignal(this.products$, {
		initialValue: [] as Product[],
	});
	protected readonly product = computed(() => this.products()[0] ?? null);

	// Similar products (same model family prefix)
	private readonly allProducts = toSignal(this.productService.productList, {
		initialValue: [] as Product[],
	});
	protected readonly similarProducts = computed(() => {
		const current = this.product();
		const all = this.allProducts();
		if (!current?.modelNo || !all.length) return [];
		const prefix = current.modelNo.split('-')[0];
		return all.filter((product) => product.modelNo?.split('-')[0] === prefix);
	});

	// Local state signals
	protected readonly selectedSize = signal(0);
	protected readonly isSizeSelected = signal(false);
	protected readonly activeVariantIndex = signal(-1);
	protected readonly selectedImageIndex = signal(0);

	// User (reactive via BehaviorSubject)
	private readonly user = this.userService.user;

	// Derived: stock for the selected size at the user's store
	protected readonly stock = computed(() => {
		const product = this.product();
		const size = this.selectedSize();
		const user = this.user();

		if (!product || !size || !user?.storeSelected) return 0;

		const matchedProduct = user.storeSelected.products?.find(
			(storeProduct) => storeProduct.modelNo === product.modelNo,
		);
		if (!matchedProduct?.variants?.[0]) return 0;

		const variant = matchedProduct.variants[0];
		const sizeIndex = variant.sizes.findIndex((shoeSize) => shoeSize === size);
		return sizeIndex === -1 ? 0 : +(variant.inStock[sizeIndex] ?? 0);
	});

	// Derived: original price before discount
	protected readonly originalPrice = computed(() => {
		const price = this.product()?.price ?? 0;
		return price + price * 0.2;
	});

	// Wishlist state for current product
	protected readonly isWishlisted = computed(() => {
		const modelNo = this.product()?.modelNo;
		return modelNo ? this.userService.isInWishlist(modelNo) : false;
	});

	constructor() {
		// Route params → product model number
		this.route.params
			.pipe(
				map((params) => params['id'] as string),
				takeUntilDestroyed(),
			)
			.subscribe((modelNo) => {
				this.productModelNo$.next(modelNo);
			});
	}

	// --- Template methods ---

	protected selectImage(index: number): void {
		this.selectedImageIndex.set(index);
	}

	protected sizeSelected(size: number): void {
		this.selectedSize.set(size);
		this.isSizeSelected.set(true);
	}

	protected variantSelect(index: number, modelNo: string): void {
		this.productModelNo$.next(modelNo);
		this.activeVariantIndex.set(index);
		this.selectedImageIndex.set(0);
	}

	protected addToCart(): void {
		const product = this.product();
		if (!product) return;

		if (!this.isSizeSelected()) {
			this.snackbar.info(
				this.stock() === 0
					? 'Not available at this store'
					: 'Select a size first',
			);
			return;
		}

		const cartProduct: CartProduct = {
			productImage: product.imageList?.[0] ?? '',
			modelNo: product.modelNo,
			variantId: product.variants?.[0]?.variantId ?? '',
			noOfItems: 1,
			size: +this.selectedSize(),
			vendor: product.companyName ?? '',
			productName: product.name,
			price: product.price,
		};

		this.cartService.addToCart(cartProduct);
	}

	protected toggleWishlist(): void {
		const modelNo = this.product()?.modelNo;
		if (!modelNo) return;

		if (!this.userService.user()) {
			this.snackbar.info('Log in to use wishlist');
			return;
		}

		const added = this.userService.toggleWishlist(modelNo);
		this.snackbar.success(added ? 'Added to wishlist' : 'Removed from wishlist');
	}

	protected checkAvailability(): void {
		const product = this.product();
		if (!product) return;

		this.dialog.open(StoreAvailabilityComponent, {
			data: {
				call: 'product',
				size: this.isSizeSelected() ? this.selectedSize() : null,
				modelNo: product.modelNo,
				sizes: product.variants?.[0]?.sizes ?? [],
			} satisfies StoreAvailabilityDialogData,
			panelClass: 'store-availability-dialog',
			maxWidth: '100vw',
			maxHeight: '100vh',
			width: '100vw',
			height: '100vh',
		});
	}

	protected openGallery(startIndex: number): void {
		const images = this.product()?.variants[0]?.imageList ?? [];
		if (!images.length) return;

		this.dialog.open(ImageGalleryComponent, {
			data: { images, startIndex },
			panelClass: 'fullscreen-dialog',
			maxWidth: '100vw',
			maxHeight: '100vh',
			width: '100vw',
			height: '100vh',
		});
	}
}
