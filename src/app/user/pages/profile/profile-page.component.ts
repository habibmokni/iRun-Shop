import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { NgOptimizedImage, DecimalPipe, TitleCasePipe } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../../products/services/product.service';
import { Product } from '../../../products/types/product.types';

type ProfileTab = 'info' | 'wishlist' | 'orders';

const VALID_TABS: ProfileTab[] = ['info', 'wishlist', 'orders'];

@Component({
	selector: 'app-profile-page',
	templateUrl: './profile-page.component.html',
	styleUrls: ['./profile-page.component.scss'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgOptimizedImage, RouterModule, MatButtonModule, MatIconModule, DecimalPipe, TitleCasePipe],
})
export class ProfilePageComponent {
	private readonly userService = inject(UserService);
	private readonly authService = inject(AuthService);
	private readonly productService = inject(ProductService);
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);

	protected readonly isLoggedIn = this.authService.isLoggedIn;
	protected readonly user = this.userService.user;
	protected readonly orders = this.userService.orders;
	protected readonly favoriteStore = this.userService.favoriteStore;

	protected readonly activeTab = signal<ProfileTab>('info');

	constructor() {
		this.route.queryParams
			.pipe(
				map((params) => params['tab'] as string),
				takeUntilDestroyed(),
			)
			.subscribe((tab) => {
				if (tab && VALID_TABS.includes(tab as ProfileTab)) {
					this.activeTab.set(tab as ProfileTab);
				}
			});
	}

	private readonly allProducts = toSignal(this.productService.productList, {
		initialValue: [] as Product[],
	});

	/** Resolve wishlist model numbers to full product objects. */
	protected readonly wishlistProducts = computed(() => {
		const wishlist = this.userService.wishlist();
		const products = this.allProducts();
		if (!wishlist.size || !products.length) return [];
		return products.filter((product) => product.modelNo && wishlist.has(product.modelNo));
	});

	protected async removeFromWishlist(modelNo: string): Promise<void> {
		await this.userService.toggleWishlist(modelNo);
	}

	protected async logout(): Promise<void> {
		await this.authService.logout();
		this.router.navigate(['/home']);
	}
}
