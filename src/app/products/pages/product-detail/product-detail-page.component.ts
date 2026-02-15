import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { BehaviorSubject, filter, map, switchMap } from 'rxjs';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CartProduct } from '../../../cart/types/cart.types';
import { Product } from '../../types/product.types';
import { Store } from '../../../stores/types/store.types';
import { ProductService } from '../../services/product.service';
import { StoreService } from '../../../stores/services/store.service';
import { CartService } from '../../../cart/services/cart.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { UserService } from '../../../user/services/user.service';
import {
	CheckAvailabilityComponent,
	CheckAvailabilityDialogData,
	SizeSelectorComponent as CncSizeSelectorComponent,
} from '@habibmokni/cnc';
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
		CncSizeSelectorComponent,
	],
})
export class ProductDetailPageComponent {
	private readonly route = inject(ActivatedRoute);
	private readonly dialog = inject(MatDialog);
	private readonly productService = inject(ProductService);
	private readonly storeService = inject(StoreService);
	private readonly cartService = inject(CartService);
	private readonly userService = inject(UserService);
	private readonly snackbar = inject(SnackbarService);

	private readonly productModelNo$ = new BehaviorSubject<string>('');

	private readonly products$ = this.productModelNo$.pipe(
		filter((modelNo) => !!modelNo),
		switchMap((modelNo) => this.productService.getProductById(modelNo)),
	);

	protected readonly products = toSignal(this.products$, {
		initialValue: [] as Product[],
	});
	protected readonly product = computed<Product | null>(() => this.products()[0] ?? null);

	// Similar products (same model family prefix)
	private readonly allProducts = toSignal(this.productService.productList, {
		initialValue: [] as Product[],
	});
	protected readonly similarProducts = computed(() => {
		const current = this.product();
		const all = this.allProducts();
		if (!current || !all.length) return [];
		const prefix = current.modelNo.split('-')[0];
		return all.filter((product) => product.modelNo.split('-')[0] === prefix);
	});

	protected readonly selectedSize = signal(0);
	protected readonly isSizeSelected = signal(false);
	protected readonly activeVariantIndex = signal(-1);
	protected readonly selectedImageIndex = signal(0);

	private readonly user = this.userService.user;

	private readonly allStores = toSignal(this.storeService.store, {
		initialValue: [] as Store[],
	});

	protected readonly stock = computed(() => {
		const product = this.product();
		const size = this.selectedSize();
		const user = this.user();

		if (!product || !size || !user?.storeSelected) return 0;

		const fullStore = this.allStores().find((s) => s.id === user.storeSelected?.id);
		if (!fullStore) return 0;

		const matchedProduct = fullStore.products.find(
			(storeProduct) => storeProduct.modelNo === product.modelNo,
		);
		if (!matchedProduct?.variants[0]) return 0;

		const variant = matchedProduct.variants[0];
		const sizeIndex = variant.sizes.findIndex((shoeSize) => shoeSize === size);
		return sizeIndex === -1 ? 0 : variant.inStock[sizeIndex];
	});

	protected readonly originalPrice = computed(() => {
		const price = this.product()?.price ?? 0;
		return price * 1.2;
	});

	protected readonly isWishlisted = computed(() => {
		const modelNo = this.product()?.modelNo;
		return modelNo ? this.userService.isInWishlist(modelNo) : false;
	});

	constructor() {
		this.route.params
			.pipe(
				map((params) => params['id'] as string),
				takeUntilDestroyed(),
			)
			.subscribe((modelNo) => {
				this.productModelNo$.next(modelNo);
			});
	}

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
				this.stock() === 0 ? 'Not available at this store' : 'Select a size first',
			);
			return;
		}

		const cartProduct: CartProduct = {
			productImage: product.imageList?.[0] ?? '',
			modelNo: product.modelNo,
			variantId: product.variants[0]?.variantId ?? '',
			noOfItems: 1,
			size: this.selectedSize(),
			vendor: product.companyName ?? '',
			productName: product.name,
			price: product.price,
		};

		this.cartService.addToCart(cartProduct);
	}

	protected async toggleWishlist(): Promise<void> {
		const modelNo = this.product()?.modelNo;
		if (!modelNo) return;

		if (!this.userService.user()) {
			this.snackbar.info('Log in to use wishlist');
			return;
		}

		const added = await this.userService.toggleWishlist(modelNo);
		this.snackbar.success(added ? 'Added to wishlist' : 'Removed from wishlist');
	}

	protected checkAvailability(): void {
		const product = this.product();
		if (!product) return;

		const isMobile = window.innerWidth < 600;

		this.dialog.open(CheckAvailabilityComponent, {
			data: {
				modelNo: product.modelNo,
				variantId: product.variants[0]?.variantId ?? '',
				sizes: product.variants[0]?.sizes ?? [],
				size: this.isSizeSelected() ? this.selectedSize() : undefined,
			} satisfies CheckAvailabilityDialogData,
			panelClass: 'store-availability-dialog',
			maxWidth: isMobile ? '100vw' : '560px',
			maxHeight: isMobile ? '100vh' : '85vh',
			width: isMobile ? '100vw' : '560px',
			height: isMobile ? '100vh' : 'auto',
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
