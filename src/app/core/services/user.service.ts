import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable, of } from 'rxjs';

const STORAGE_KEY = 'userList';

@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [];

  constructor(private http: HttpClient) {}

  load(): Observable<User[]> {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      this.users = JSON.parse(stored);
      return of(this.users);
    } else {
      return this.http.get<User[]>('assets/mock-users.json');
    }
  }

  setAll(users: User[]) {
    this.users = users;
    this.persist();
  }

  getAll(): User[] {
    return this.users;
  }

  get(index: number): User | null {
    return this.users[index] || null;
  }

  update(index: number, updated: User): void {
    this.users[index] = updated;
    this.persist();
  }

  add(user: User): void {
    this.users.push(user);
    this.persist();
  }

  delete(index: number): void {
    this.users.splice(index, 1);
    this.persist();
  }

  private persist(): void {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.users));
  }
}
