import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { User } from '../types/user.types';

const USER_STORAGE_KEY = 'avct_user';

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

	private saveAndEmit(userData: User): void {
		localStorage.setItem(USER_STORAGE_KEY, JSON.stringify([userData]));
		this.user.set(userData);
	}

	private loadUser(): User | null {
		const stored = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) ?? '[]') as User[];
		return stored[0] ?? null;
	}
}
