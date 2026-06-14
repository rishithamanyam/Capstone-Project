import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token');
  const user  = JSON.parse(sessionStorage.getItem('user') || 'null');

  if (!token || !user) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data?.['role'];
  if (requiredRole && user.role !== requiredRole) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
