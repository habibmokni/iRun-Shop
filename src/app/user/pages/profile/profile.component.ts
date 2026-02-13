import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../../auth/services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
})
export class ProfileComponent {
  private readonly userService = inject(UserService);
  protected readonly authService = inject(AuthService);

  protected readonly isLoggedIn = this.authService.isLoggedIn;
  protected readonly user = this.userService.user;
}
