import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';

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

  constructor(private auth: AuthService, private router: Router, private chat: ChatService) {}

  get user() { return this.auth.getUser(); }
  get role()  { return this.user?.role || ''; }
  get items() { return this.navMap[this.role] || []; }

  get initials() {
    const n = this.user?.name || '';
    return n.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
  }

  navigate(route: string) {
    if (route === 'profile') { this.router.navigate(['/profile']); return; }

    if (route === 'customer-support') { this.chat.open(); return; }

    const queryParamRoutes: Record<string, { path: string; tab: string }> = {
      'admin':             { path: '/admin',           tab: 'dashboard' },
      'admin-emp':         { path: '/admin',           tab: 'employees' },
      'admin-tickets':     { path: '/admin',           tab: 'tickets'   },
      'admin-outages':     { path: '/admin',           tab: 'outages'   },
      'rep':               { path: '/representative',  tab: 'dashboard' },
      'rep-tickets':       { path: '/representative',  tab: 'tickets'   },
      'rep-search':        { path: '/representative',  tab: 'search'    },
      'customer':          { path: '/customer',        tab: 'dashboard' },
      'customer-tickets':  { path: '/customer',        tab: 'tickets'   },
    };
    const qr = queryParamRoutes[route];
    if (qr) {
      this.router.navigate([qr.path], { queryParams: { tab: qr.tab } });
      return;
    }

    const scrollTargets: Record<string, string> = {
      'manager-tickets': 'tickets',
      'manager-outage':  'outage',
    };
    const sectionId = scrollTargets[route];
    if (sectionId) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    const pageRoutes: Record<string, string> = {
      admin: '/admin', manager: '/manager', rep: '/representative', customer: '/customer'
    };
    if (pageRoutes[route]) this.router.navigate([pageRoutes[route]]);
  }

  logout() { this.auth.logout(); }
}
