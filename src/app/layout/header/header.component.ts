import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from '../../auth/services/auth.service';
import { CartService } from '../../cart/services/cart.service';
import { UserService } from '../../user/services/user.service';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgOptimizedImage,
		RouterModule,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatBadgeModule,
		MatMenuModule,
	],
})
export class HeaderComponent {
	private readonly authService = inject(AuthService);
	private readonly cartService = inject(CartService);
	private readonly userService = inject(UserService);
	private readonly router = inject(Router);
	private readonly snackbar = inject(SnackbarService);

	protected readonly isLoggedIn = this.authService.isLoggedIn;
	protected readonly cartCount = this.cartService.count;
	protected readonly wishlistCount = computed(() => this.userService.wishlist().size);

	protected async onLogout(): Promise<void> {
		await this.authService.logout();
		this.router.navigate(['/home']);
		this.snackbar.success('Logged out');
	}
}
