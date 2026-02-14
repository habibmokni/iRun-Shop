import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
		NgOptimizedImage,
		ReactiveFormsModule,
		RouterModule,
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
			this.snackbar.success('Already logged in');
		}
	}

	protected togglePasswordVisibility(): void {
		this.hidePassword.update((hidden) => !hidden);
	}

	protected isFieldInvalid(field: keyof typeof this.loginForm.controls): boolean {
		const control = this.loginForm.controls[field];
		return control.invalid && control.touched;
	}

	protected async onLogin(): Promise<void> {
		this.isLoading.set(true);

		const success = await this.authService.login(
			this.loginForm.value as { email: string; password: string },
		);

		if (success) {
			this.router.navigate(['/home']);
			this.snackbar.success('Logged in');
		} else {
			this.isLoading.set(false);
			this.snackbar.error('Wrong credentials');
		}
	}
}
