import { Injectable, inject, signal } from '@angular/core';

import { UserService } from '../../user/services/user.service';

const LOGIN_KEY = 'isLoggedIn';
const USER_KEY = 'user';

/**
 * Pure authentication state service.
 * Does NOT navigate or show UI feedback — that's the caller's responsibility.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
	private readonly userService = inject(UserService);

	private readonly loggedInState = signal(!!localStorage.getItem(LOGIN_KEY));
	readonly isLoggedIn = this.loggedInState.asReadonly();

	/**
	 * Validates credentials against stored user data.
	 * Returns `true` on success, `false` on failure.
	 */
	public login(credentials: { email: string; password: string }): boolean {
		const stored = JSON.parse(localStorage.getItem(USER_KEY) ?? 'null') as {
			email?: string;
			password?: string;
		} | null;

		if (stored?.email === credentials.email && stored?.password === credentials.password) {
			localStorage.setItem(LOGIN_KEY, 'true');
			this.loggedInState.set(true);
			this.userService.reloadUser();
			return true;
		}

		return false;
	}

	/** Clears authentication state and user profile data. */
	public logout(): void {
		localStorage.removeItem(LOGIN_KEY);
		this.loggedInState.set(false);
		this.userService.clearUser();
	}
}
