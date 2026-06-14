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
  tab: 'employee' | 'customer' = 'employee';
  email    = '';
  password = '';
  loading  = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  submit() {
    if (!this.email || !this.password) {
      this.toast.error('Please enter email and password');
      return;
    }
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: (user) => {
        this.auth.setSession(user);
        this.loading = false;
        const routes: Record<string, string> = {
          ADMIN: '/admin', MANAGER: '/manager',
          REPRESENTATIVE: '/representative', CUSTOMER: '/customer'
        };
        this.router.navigate([routes[user.role] || '/login']);
      },
      error: () => {
        this.loading = false;
        this.toast.error('Invalid email or password');
      }
    });
  }
}
