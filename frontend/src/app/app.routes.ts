import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'manager',
    loadComponent: () => import('./pages/manager/manager.component').then(m => m.ManagerComponent),
    canActivate: [authGuard],
    data: { role: 'MANAGER' }
  },
  {
    path: 'representative',
    loadComponent: () => import('./pages/representative/representative.component').then(m => m.RepresentativeComponent),
    canActivate: [authGuard],
    data: { role: 'REPRESENTATIVE' }
  },
  {
    path: 'customer',
    loadComponent: () => import('./pages/customer/customer.component').then(m => m.CustomerComponent),
    canActivate: [authGuard],
    data: { role: 'CUSTOMER' }
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }
];
