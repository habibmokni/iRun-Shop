import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from '../auth/services/auth.service';
import { ProductService } from '../shared/services/product.service';
import { UserService } from '../shared/services/user.service';
import { SnackbarService } from '../shared/services/snackbar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
  private readonly productService = inject(ProductService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly snackbar = inject(SnackbarService);

  protected readonly isLoggedIn = this.authService.isLoggedIn;
  protected readonly user = this.userService.user;
  protected readonly cartCount = computed(() => this.productService.cart().length);

  protected onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
    this.snackbar.success('Logout successfully!');
  }
}
