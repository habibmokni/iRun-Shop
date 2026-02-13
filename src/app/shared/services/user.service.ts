import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { User } from '../models/user.model';

const USER_STORAGE_KEY = 'avct_user';

@Injectable()
export class UserService {
  private readonly userState = signal<User | null>(this.readFromStorage());

  /** Readonly signal — use `user()` in templates, computed, etc. */
  readonly user = this.userState.asReadonly();

  /** Observable stream for pipe-based consumers. */
  readonly user$ = toObservable(this.userState);

  /**
   * @deprecated Use `user$` instead.
   * Kept for backward compat with unrefactored components.
   */
  readonly userSub = this.user$;

  addUserTodb(userData: User): void {
    const users = this.readAllUsers();
    users.push(userData);
    this.persist(users);
    this.userState.set(users[0]);
  }

  updateSelectedStore(userData: User): void {
    const users = this.readAllUsers();
    users[0] = userData;
    this.persist(users);
    this.userState.set(users[0]);
  }

  // --- Private helpers ---

  private readFromStorage(): User | null {
    return this.readAllUsers()[0] ?? null;
  }

  private readAllUsers(): User[] {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) ?? '[]');
  }

  private persist(users: User[]): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
  }
}
