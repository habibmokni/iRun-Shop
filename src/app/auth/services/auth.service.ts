import { Injectable, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { UserService } from '../../user/services/user.service';

/**
 * Authentication service backed by Firebase Auth.
 * Does NOT navigate or show UI feedback — that's the caller's responsibility.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
	private readonly afAuth = inject(AngularFireAuth);
	private readonly userService = inject(UserService);

	/** Firebase auth state as a signal (null when logged out, User when logged in). */
	private readonly firebaseUser = toSignal(this.afAuth.authState, { initialValue: null });

	/** Whether the user is currently authenticated. */
	readonly isLoggedIn = computed(() => !!this.firebaseUser());

	constructor() {
		// Reload local profile data whenever Firebase auth state changes to logged-in.
		effect(() => {
			if (this.firebaseUser()) {
				this.userService.reloadUser();
			}
		});
	}

	/** Signs in with email & password via Firebase. */
	readonly login = (credentials: { email: string; password: string }): Promise<boolean> =>
		this.afAuth
			.signInWithEmailAndPassword(credentials.email, credentials.password)
			.then(() => true)
			.catch(() => false);

	/** Creates a new user account via Firebase. */
	readonly register = (email: string, password: string): Promise<boolean> =>
		this.afAuth
			.createUserWithEmailAndPassword(email, password)
			.then(() => true)
			.catch(() => false);

	/** Signs out of Firebase and clears local user data. */
	readonly logout = (): Promise<void> =>
		this.afAuth.signOut().then(() => this.userService.clearUser());
}
