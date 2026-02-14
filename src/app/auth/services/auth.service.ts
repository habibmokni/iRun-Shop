import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AngularFireAuth } from '@angular/fire/compat/auth';

/**
 * Authentication service backed by Firebase Auth.
 * Does NOT navigate or show UI feedback — that's the caller's responsibility.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
	private readonly afAuth = inject(AngularFireAuth);

	/** Firebase auth state as a signal (null when logged out, User when logged in). */
	private readonly firebaseUser = toSignal(this.afAuth.authState, { initialValue: null });

	/** Whether the user is currently authenticated. */
	readonly isLoggedIn = computed(() => !!this.firebaseUser());

	/** The current Firebase uid (null when logged out). */
	readonly uid = computed(() => this.firebaseUser()?.uid ?? null);

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

	/** Signs out of Firebase. */
	readonly logout = (): Promise<void> => this.afAuth.signOut();
}
