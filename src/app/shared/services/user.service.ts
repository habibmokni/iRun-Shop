import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { User } from '../models/user.model';

const USER_STORAGE_KEY = 'avct_user';

@Injectable()
export class UserService {
  user!: User;
  readonly userSub = new Subject<User>();

  constructor() {
    this.loadUser();
  }

  addUserTodb(user: User): void {
    const users = this.getStoredUsers();
    users.push(user);
    this.saveUsers(users);
    this.loadUser();
    this.userSub.next(this.user);
  }

  updateSelectedStore(user: User): void {
    const users = this.getStoredUsers();
    users[0] = user;
    this.saveUsers(users);
    this.user = users[0];
    this.userSub.next(this.user);
  }

  private loadUser(): void {
    const users = this.getStoredUsers();
    this.user = users[0];
  }

  private getStoredUsers(): User[] {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) ?? '[]');
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
  }
}
