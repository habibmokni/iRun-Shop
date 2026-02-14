import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { User } from '../types/user.types';

const USER_STORAGE_KEY = 'user';

@Injectable()
export class UserService {
	readonly user = signal<User | null>(this.loadUser());

	readonly user$ = toObservable(this.user);

	public addUser(userData: User): void {
		this.saveAndEmit(userData);
	}

	public updateSelectedStore(userData: User): void {
		this.saveAndEmit(userData);
	}

	/** Re-reads the user from localStorage into the signal. */
	public reloadUser(): void {
		this.user.set(this.loadUser());
	}

	/** Clears user data from both localStorage and the signal. */
	public clearUser(): void {
		localStorage.removeItem(USER_STORAGE_KEY);
		this.user.set(null);
	}

	private saveAndEmit(userData: User): void {
		localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
		this.user.set(userData);
	}

	private loadUser(): User | null {
		const raw = localStorage.getItem(USER_STORAGE_KEY);
		if (!raw) return null;

		const parsed: unknown = JSON.parse(raw);

		// Handle legacy format where user was wrapped in an array
		if (Array.isArray(parsed)) return (parsed[0] as User) ?? null;

		return parsed as User;
	}
}
