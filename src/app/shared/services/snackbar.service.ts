import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

type SnackbarLevel = 'success' | 'info' | 'warning' | 'error' | 'wait';

@Injectable()
export class SnackbarService {
	private readonly snackBar = inject(MatSnackBar);

	private readonly baseConfig: MatSnackBarConfig = {
		duration: 1000,
		verticalPosition: 'top',
	};

	success(message: string): void {
		this.show(message, 'success');
	}

	info(message: string): void {
		this.show(message, 'info');
	}

	warning(message: string): void {
		this.show(message, 'warning', 'Dismiss');
	}

	error(message: string): void {
		this.show(message, 'error', 'Dismiss');
	}

	wait(message: string): void {
		this.show(message, 'wait', 'Dismiss');
	}

	private show(message: string, level: SnackbarLevel, action = ''): void {
		this.snackBar.open(message, action, {
			duration: this.baseConfig.duration,
			verticalPosition: this.baseConfig.verticalPosition,
			panelClass: `snackbar-${level}`,
		});
	}
}
