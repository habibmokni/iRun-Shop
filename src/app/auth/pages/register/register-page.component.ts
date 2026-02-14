import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SnackbarService } from '../../../shared/services/snackbar.service';
import { UserService } from '../../../user/services/user.service';
import { User } from '../../../user/types/user.types';

@Component({
	selector: 'app-register-page',
	templateUrl: './register-page.component.html',
	styleUrls: ['./register-page.component.scss'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ReactiveFormsModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
})
export class RegisterPageComponent {
	private readonly router = inject(Router);
	private readonly snackbar = inject(SnackbarService);
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

	protected onRegister(): void {
		this.isLoading.set(true);

		if (this.registerForm.valid) {
			const formValues = this.registerForm.getRawValue();
			const userData: User = {
				firstName: formValues.firstName ?? '',
				lastName: formValues.lastName ?? '',
				email: formValues.email ?? '',
				password: formValues.password ?? '',
				address: formValues.address ?? '',
				zipCode: formValues.zipCode ?? '',
			};

			this.userService.addUser(userData);
			this.snackbar.success('User added successfully!');
			this.registerForm.reset();
			this.isLoading.set(false);
			setTimeout(() => this.router.navigate(['/login']), 2000);
		} else {
			this.isLoading.set(false);
			this.snackbar.error('Oops! Something went wrong');
		}
	}

	protected onCancel(): void {
		this.router.navigate(['home']);
	}
}
