import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../../auth/services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, RouterModule],
})
export class ProfilePageComponent {
  private readonly userService = inject(UserService);
  protected readonly authService = inject(AuthService);

  protected readonly isLoggedIn = this.authService.isLoggedIn;
  protected readonly user = this.userService.user;
}
