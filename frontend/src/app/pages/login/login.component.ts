import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  active: 'login' | 'signup' | null = null;

  loginEmail    = '';
  loginPassword = '';
  loginLoading  = false;

  signupName     = '';
  signupEmail    = '';
  signupPhone    = '';
  signupLocation = 'New York';
  signupPassword = '';
  signupLoading  = false;

  readonly LOCATIONS = ['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia'];

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  login() {
    if (!this.loginEmail || !this.loginPassword) {
      this.toast.error('Please enter email and password');
      return;
    }
    this.loginLoading = true;
    this.auth.login(this.loginEmail, this.loginPassword).subscribe({
      next: (user) => {
        this.auth.setSession(user);
        this.loginLoading = false;
        const routes: Record<string, string> = {
          ADMIN: '/admin', MANAGER: '/manager',
          REPRESENTATIVE: '/representative', CUSTOMER: '/customer'
        };
        this.router.navigate([routes[user.role] || '/login']);
      },
      error: () => {
        this.loginLoading = false;
        this.toast.error('Invalid email or password');
      }
    });
  }

  signup() {
    if (!this.signupName || !this.signupEmail || !this.signupPassword) {
      this.toast.error('Please fill name, email and password');
      return;
    }
    this.signupLoading = true;
    this.auth.register({
      name: this.signupName,
      email: this.signupEmail,
      phone: this.signupPhone,
      location: this.signupLocation,
      password: this.signupPassword
    }).subscribe({
      next: (user) => {
        this.auth.setSession(user);
        this.signupLoading = false;
        this.router.navigate(['/customer']);
      },
      error: (e) => {
        this.signupLoading = false;
        this.toast.error(e.error?.message || 'Registration failed');
      }
    });
  }
}
