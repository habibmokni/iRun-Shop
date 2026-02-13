import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class RegisterPageComponent {
  private readonly router = inject(Router);
  private readonly snackbar = inject(SnackbarService);

  protected readonly registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required]),
  });

  protected readonly hidePassword = signal(true);
  protected readonly isLoading = signal(false);

  protected togglePasswordVisibility(): void {
    this.hidePassword.update((h) => !h);
  }

  protected isFieldInvalid(field: keyof typeof this.registerForm.controls): boolean {
    const control = this.registerForm.controls[field];
    return control.invalid && control.touched;
  }

  protected onRegister(): void {
    this.isLoading.set(true);

    if (this.registerForm.valid) {
      localStorage.setItem('user', JSON.stringify(this.registerForm.value));
      this.snackbar.success('User added successfully!');
      this.registerForm.reset();
      this.isLoading.set(false);
      setTimeout(() => this.router.navigate(['home']), 2000);
    } else {
      this.isLoading.set(false);
      this.snackbar.error('Oops! Something went wrong');
    }
  }

  protected onCancel(): void {
    this.router.navigate(['home']);
  }
}
