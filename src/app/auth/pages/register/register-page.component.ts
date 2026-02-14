import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SnackbarService } from '../../../shared/services/snackbar.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../../user/services/user.service';
import { User } from '../../../user/types/user.types';

@Component({
	selector: 'app-register-page',
	templateUrl: './register-page.component.html',
	styleUrls: ['./register-page.component.scss'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ReactiveFormsModule, RouterModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
})
export class RegisterPageComponent {
	private readonly router = inject(Router);
	private readonly snackbar = inject(SnackbarService);
	private readonly authService = inject(AuthService);
	private readonly userService = inject(UserService);

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
		this.hidePassword.update((hidden) => !hidden);
	}

	protected isFieldInvalid(field: keyof typeof this.registerForm.controls): boolean {
		const control = this.registerForm.controls[field];
		return control.invalid && control.touched;
	}

	protected async onRegister(): Promise<void> {
		this.isLoading.set(true);

		if (!this.registerForm.valid) {
			this.isLoading.set(false);
			this.snackbar.error('Please fill all fields');
			return;
		}

		const formValues = this.registerForm.getRawValue();
		const email = formValues.email ?? '';
		const password = formValues.password ?? '';

		// 1. Create Firebase account
		const success = await this.authService.register(email, password);
		if (!success) {
			this.isLoading.set(false);
			this.snackbar.error('Registration failed');
			return;
		}

		// 2. Save profile data to Firestore
		const userData: User = {
			firstName: formValues.firstName ?? '',
			lastName: formValues.lastName ?? '',
			email,
			address: formValues.address ?? '',
			zipCode: formValues.zipCode ?? '',
		};
		await this.userService.addUser(userData);

		// Firebase already signs in the user after registration — go straight to home.
		this.isLoading.set(false);
		this.snackbar.success('Account created');
		this.router.navigate(['/home']);
	}

	protected onCancel(): void {
		this.router.navigate(['home']);
	}
}
