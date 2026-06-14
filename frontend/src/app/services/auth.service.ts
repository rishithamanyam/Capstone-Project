import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<User>('/api/auth/login', { email, password });
  }

  setSession(user: User) {
    sessionStorage.setItem('token', user.token!);
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getUser(): User | null {
    const u = sessionStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  updateProfile(data: Partial<User>) {
    return this.http.put<User>('/api/users/me', data);
  }

  changePassword(current: string, newPass: string) {
    return this.http.put<any>('/api/auth/change-password', { currentPassword: current, newPassword: newPass });
  }
}
