import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SnackbarService } from '../../../shared/services/snackbar.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackbar = inject(SnackbarService);

  protected readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  protected readonly hidePassword = signal(true);
  protected readonly isLoading = signal(false);

  constructor() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
      this.snackbar.success('User already logged in');
    }
  }

  protected togglePasswordVisibility(): void {
    this.hidePassword.update((h) => !h);
  }

  protected isFieldInvalid(field: keyof typeof this.loginForm.controls): boolean {
    const control = this.loginForm.controls[field];
    return control.invalid && control.touched;
  }

  protected onLogin(): void {
    this.isLoading.set(true);

    const success = this.authService.login(
      this.loginForm.value as { email: string; password: string }
    );

    if (success) {
      this.router.navigate(['/home']);
      this.snackbar.success('Login Successful');
    } else {
      this.isLoading.set(false);
      this.snackbar.error('Wrong credentials! Please try again');
    }
  }
}
