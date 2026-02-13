import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class UserProfileComponent {
  private readonly userService = inject(UserService);
  protected readonly authService = inject(AuthService);

  protected readonly isLoggedIn = this.authService.isLoggedIn;
  protected readonly user = this.userService.user;
}
