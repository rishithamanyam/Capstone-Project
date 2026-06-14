import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/topbar/topbar.component';
import { AnalyticsService } from '../../services/analytics.service';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { Ticket } from '../../models/ticket.model';
import { User } from '../../models/user.model';

Chart.register(...registerables);

@Component({
  selector: 'app-representative',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  templateUrl: './representative.component.html'
})
export class RepresentativeComponent implements OnInit {
  activeTab = 'dashboard';

  stats: any = {};
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  searchResults: User[] = [];
  ticketFilter = '';
  searchQuery  = '';
  searchTimer: any;

  showStatusModal = false;
  updateTicketId  = 0;
  newStatus       = 'IN_PROGRESS';

  private cachedStats: any = null;

  @ViewChild('statusChart') statusCanvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  constructor(
    private analyticsSvc: AnalyticsService,
    private ticketSvc: TicketService,
    private userSvc: UserService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'] || 'dashboard';
      this.activeTab = tab;
      if (tab === 'dashboard') {
        if (this.cachedStats) {
          setTimeout(() => this.buildChart(this.cachedStats), 100);
        } else {
          this.loadDashboard();
        }
      }
      if (tab === 'tickets') this.loadTickets();
    });
  }

  setTab(tab: string) {
    this.router.navigate(['/representative'], { queryParams: { tab } });
  }

  loadDashboard() {
    this.analyticsSvc.rep().subscribe(d => {
      this.stats = d;
      this.cachedStats = d;
      setTimeout(() => this.buildChart(d), 100);
    });
  }

  loadTickets() {
    this.ticketSvc.getAll().subscribe(d => {
      this.tickets = d;
      this.filteredTickets = d;
      this.ticketFilter = '';
    });
  }

  buildChart(s: any) {
    if (this.chart) { this.chart.destroy(); this.chart = undefined; }
    if (!this.statusCanvas?.nativeElement) return;
    this.chart = new Chart(this.statusCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Open', 'In Progress', 'Closed'],
        datasets: [{ data: [s.openTickets, s.inProgressTickets, s.closedTickets], backgroundColor: ['#d97706','#8b5cf6','#059669'], borderWidth: 0 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
  }

  filterTickets(q: string) {
    const ql = q.toLowerCase();
    this.filteredTickets = this.tickets.filter(t =>
      t.customerName.toLowerCase().includes(ql) ||
      t.subject.toLowerCase().includes(ql) ||
      t.domain.toLowerCase().includes(ql)
    );
  }

  onSearchInput() {
    clearTimeout(this.searchTimer);
    if (!this.searchQuery.trim()) { this.searchResults = []; return; }
    this.searchTimer = setTimeout(() => {
      this.userSvc.search(this.searchQuery).subscribe(d => { this.searchResults = d; });
    }, 400);
  }

  openUpdate(ticket: Ticket) {
    this.updateTicketId = ticket.id;
    this.newStatus      = ticket.status === 'OPEN' ? 'IN_PROGRESS' : 'CLOSED';
    this.showStatusModal = true;
  }

  submitStatus() {
    this.ticketSvc.updateStatus(this.updateTicketId, this.newStatus).subscribe({
      next: () => {
        this.toast.success('Ticket status updated!');
        this.showStatusModal = false;
        this.loadTickets();
      },
      error: () => this.toast.error('Update failed')
    });
  }

  statusClass(s: string) { const m: Record<string,string>={OPEN:'b-amber',IN_PROGRESS:'b-blue',CLOSED:'b-green'}; return 'badge '+(m[s]||'b-gray'); }
  statusLabel(s: string) { return s==='IN_PROGRESS'?'In Progress':s.charAt(0)+s.slice(1).toLowerCase(); }
  fmtHrs(h?: number) { if(h==null)return'—'; const hr=Math.floor(h); const m=Math.round((h-hr)*60); return hr>0?`${hr}h ${m}m`:`${m}m`; }
}
