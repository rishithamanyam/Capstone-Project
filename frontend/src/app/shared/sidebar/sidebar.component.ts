import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem { icon: string; label: string; route: string; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  @Input() activePage = '';

  private navMap: Record<string, NavItem[]> = {
    ADMIN: [
      { icon: '📊', label: 'Dashboard',    route: 'admin' },
      { icon: '👥', label: 'Employees',    route: 'admin-emp' },
      { icon: '🎫', label: 'All Tickets',  route: 'admin-tickets' },
      { icon: '⚡', label: 'Outages',      route: 'admin-outages' },
      { icon: '📋', label: 'Profile',      route: 'profile' },
    ],
    MANAGER: [
      { icon: '📊', label: 'Dashboard',    route: 'manager' },
      { icon: '🎫', label: 'Team Tickets', route: 'manager-tickets' },
      { icon: '⚡', label: 'Outages',      route: 'manager-outage' },
      { icon: '📋', label: 'Profile',      route: 'profile' },
    ],
    REPRESENTATIVE: [
      { icon: '📊', label: 'Dashboard',    route: 'rep' },
      { icon: '🎫', label: 'My Tickets',   route: 'rep-tickets' },
      { icon: '🔍', label: 'Search',       route: 'rep-search' },
      { icon: '📋', label: 'Profile',      route: 'profile' },
    ],
    CUSTOMER: [
      { icon: '📊', label: 'Dashboard',    route: 'customer' },
      { icon: '🎫', label: 'My Tickets',   route: 'customer-tickets' },
      { icon: '💬', label: 'Live Support', route: 'customer-support' },
      { icon: '📋', label: 'Profile',      route: 'profile' },
    ],
  };

  constructor(private auth: AuthService, private router: Router) {}

  get user() { return this.auth.getUser(); }
  get role()  { return this.user?.role || ''; }
  get items() { return this.navMap[this.role] || []; }

  get initials() {
    const n = this.user?.name || '';
    return n.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
  }

  navigate(route: string) {
    if (route === 'profile') { this.router.navigate(['/profile']); return; }
    if (route === 'customer-support') {
      const fab = document.getElementById('chat-fab') as HTMLElement;
      const win = document.getElementById('chat-window') as HTMLElement;
      if (win) win.classList.add('open');
      if (fab) fab.scrollIntoView();
      return;
    }
    const scrollMap: Record<string, string> = {
      'admin-emp':      'section-employees',
      'admin-tickets':  'section-tickets',
      'admin-outages':  'section-outages',
      'manager-tickets':'tickets',
      'manager-outage': 'outage',
      'rep-tickets':    'tickets',
      'rep-search':     'search',
      'customer-tickets':'tickets-section',
    };
    const sectionId = scrollMap[route];
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); }
      return;
    }
    const routeMap: Record<string, string> = {
      admin: '/admin', manager: '/manager', rep: '/representative', customer: '/customer'
    };
    if (routeMap[route]) this.router.navigate([routeMap[route]]);
  }

  logout() { this.auth.logout(); }
}
