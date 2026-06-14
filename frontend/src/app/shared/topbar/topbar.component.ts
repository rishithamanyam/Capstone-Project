import { Component, Input, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html'
})
export class TopbarComponent implements OnInit {
  @Input() title = 'Dashboard';
  @Input() breadcrumb = 'Home / Dashboard';

  notifCount = 0;
  notifOpen  = false;
  notifs: Notification[] = [];

  constructor(private notifSvc: NotificationService) {}

  ngOnInit() { this.loadCount(); }

  get initials() {
    const u = JSON.parse(sessionStorage.getItem('user') || 'null');
    const n = u?.name || '';
    return n.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
  }

  loadCount() {
    this.notifSvc.getCount().subscribe(d => { this.notifCount = d.count; });
  }

  togglePanel() {
    this.notifOpen = !this.notifOpen;
    if (this.notifOpen) {
      this.notifSvc.getAll().subscribe(d => { this.notifs = d; });
    }
  }

  markRead(n: Notification) {
    if (n.read) return;
    this.notifSvc.markRead(n.id).subscribe(() => {
      n.read = true;
      this.loadCount();
    });
  }

  clearRead() {
    this.notifSvc.clearRead().subscribe(() => {
      this.notifSvc.getAll().subscribe(d => { this.notifs = d; });
      this.loadCount();
    });
  }

  fmtDateTime(iso?: string) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ' ' +
      d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event) {
    const target = e.target as HTMLElement;
    if (!target.closest('.notif-wrap')) this.notifOpen = false;
  }
}
