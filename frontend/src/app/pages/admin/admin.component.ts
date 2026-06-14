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
import { OutageService } from '../../services/outage.service';
import { ToastService } from '../../services/toast.service';
import { Ticket } from '../../models/ticket.model';
import { User } from '../../models/user.model';
import { Outage } from '../../models/outage.model';
import { AuthService } from '../../services/auth.service';

Chart.register(...registerables);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  activeTab = 'dashboard';

  stats: any = {};
  allTickets: Ticket[] = [];
  employees: User[] = [];
  outages: Outage[] = [];
  empFilter = 'ALL';

  showEmpModal     = false;
  showOutageModal  = false;
  showDelModal     = false;
  editingEmpId: number | null = null;
  deletingEmpId: number | null = null;
  deletingEmpName  = '';

  empForm = { name: '', email: '', phone: '', role: 'MANAGER', managerId: null as number | null };
  outageForm = { location: 'Mumbai', domain: 'Internet Services', affectedAreas: '', severity: 'HIGH', description: '' };

  private locationChart?: Chart;
  private domainChart?: Chart;
  private cachedStats: any = null;

  @ViewChild('locationCanvas') locationCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('domainCanvas')   domainCanvas!: ElementRef<HTMLCanvasElement>;

  readonly COLORS = ['#8b5cf6','#c4b5fd','#059669','#d97706','#dc2626','#0891b2'];
  readonly LOCATIONS = ['Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Jaipur'];
  readonly DOMAINS   = ['Internet Services','TV & Cable','Phone Services','Mobile Data','Technical Support'];

  constructor(
    private analyticsSvc: AnalyticsService,
    private ticketSvc: TicketService,
    private userSvc: UserService,
    private outageSvc: OutageService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'] || 'dashboard';
      this.activeTab = tab;
      if (tab === 'dashboard') {
        if (this.cachedStats) {
          setTimeout(() => this.buildCharts(this.cachedStats), 100);
        } else {
          this.loadDashboard();
        }
      }
      if (tab === 'employees') this.loadEmployees();
      if (tab === 'tickets')   this.loadTickets();
      if (tab === 'outages')   this.loadOutages();
    });
  }

  setTab(tab: string) {
    this.router.navigate(['/admin'], { queryParams: { tab } });
  }

  loadDashboard() {
    this.analyticsSvc.admin().subscribe(d => {
      this.stats       = d;
      this.cachedStats = d;
      setTimeout(() => this.buildCharts(d), 100);
    });
    this.outageSvc.getAll().subscribe(d => { this.outages = d; });
  }

  buildCharts(stats: any) {
    if (this.locationChart) { this.locationChart.destroy(); this.locationChart = undefined; }
    if (this.domainChart)   { this.domainChart.destroy();   this.domainChart   = undefined; }

    if (stats?.locationTickets && this.locationCanvas?.nativeElement) {
      const labels = Object.keys(stats.locationTickets);
      const data   = Object.values(stats.locationTickets) as number[];
      this.locationChart = new Chart(this.locationCanvas.nativeElement, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Tickets', data, backgroundColor: this.COLORS, borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { stepSize: 1 } } } }
      });
    }

    if (stats?.domainTickets && this.domainCanvas?.nativeElement) {
      const labels = Object.keys(stats.domainTickets);
      const data   = Object.values(stats.domainTickets) as number[];
      this.domainChart = new Chart(this.domainCanvas.nativeElement, {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: this.COLORS, borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
      });
    }
  }

  loadEmployees() {
    this.userSvc.getEmployees().subscribe(d => { this.employees = d; });
  }

  get filteredEmployees() {
    return this.empFilter === 'ALL' ? this.employees : this.employees.filter(e => e.role === this.empFilter);
  }

  managerName(managerId?: number) {
    const m = this.employees.find(e => e.id === managerId);
    return m?.name || '—';
  }

  loadTickets() {
    this.ticketSvc.getAll().subscribe(d => { this.allTickets = d; });
  }

  loadOutages() {
    this.outageSvc.getAll().subscribe(d => { this.outages = d; });
  }

  get managers() { return this.employees.filter(e => e.role === 'MANAGER'); }

  openAddEmp() {
    this.editingEmpId = null;
    this.empForm = { name: '', email: '', phone: '', role: 'MANAGER', managerId: null };
    if (this.managers.length === 0) this.loadEmployees();
    this.showEmpModal = true;
  }

  openEditEmp(emp: User) {
    this.editingEmpId = emp.id;
    this.empForm = { name: emp.name, email: emp.email, phone: emp.phone || '', role: emp.role, managerId: emp.managerId || null };
    this.showEmpModal = true;
  }

  saveEmp() {
    if (!this.empForm.name || !this.empForm.email) { this.toast.error('Name and email are required'); return; }
    const body = { ...this.empForm, managerId: this.empForm.role === 'REPRESENTATIVE' ? this.empForm.managerId : null };
    const req = this.editingEmpId
      ? this.userSvc.update(this.editingEmpId, body)
      : this.userSvc.create(body);
    req.subscribe({
      next: () => {
        this.toast.success(this.editingEmpId ? 'Employee updated!' : 'Employee added!');
        this.showEmpModal = false;
        this.loadEmployees();
      },
      error: (e) => this.toast.error(e.error?.message || 'Operation failed')
    });
  }

  openDelete(emp: User) {
    this.deletingEmpId = emp.id;
    this.deletingEmpName = emp.name;
    this.showDelModal = true;
  }

  confirmDelete() {
    if (!this.deletingEmpId) return;
    this.userSvc.delete(this.deletingEmpId).subscribe({
      next: () => { this.toast.success('Employee removed'); this.showDelModal = false; this.loadEmployees(); },
      error: () => this.toast.error('Delete failed')
    });
  }

  openOutageModal() {
    this.outageForm = { location: 'Mumbai', domain: 'Internet Services', affectedAreas: '', severity: 'HIGH', description: '' };
    this.showOutageModal = true;
  }

  reportOutage() {
    if (!this.outageForm.affectedAreas || !this.outageForm.description) {
      this.toast.error('Please fill all fields');
      return;
    }
    this.outageSvc.create({ ...this.outageForm, status: 'ACTIVE' }).subscribe({
      next: () => { this.toast.success('Outage reported!'); this.showOutageModal = false; this.loadOutages(); },
      error: () => this.toast.error('Failed to report outage')
    });
  }

  resolveOutage(id: number) {
    this.outageSvc.resolve(id).subscribe(() => { this.toast.success('Outage resolved'); this.loadOutages(); });
  }

  roleBadgeClass(r: string) {
    const map: Record<string, string> = { ADMIN:'b-red', MANAGER:'b-violet', REPRESENTATIVE:'b-indigo', CUSTOMER:'b-cyan' };
    return 'badge ' + (map[r] || 'b-gray');
  }
  statusBadgeClass(s: string) {
    const map: Record<string, string> = { OPEN:'b-amber', IN_PROGRESS:'b-blue', CLOSED:'b-green' };
    return 'badge ' + (map[s] || 'b-gray');
  }
  statusLabel(s: string) { return s === 'IN_PROGRESS' ? 'In Progress' : s.charAt(0) + s.slice(1).toLowerCase(); }
  fmtDate(iso?: string) { if (!iso) return '—'; return new Date(iso).toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'}); }
  fmtHrs(h?: number) { if (h == null) return '—'; const hr=Math.floor(h); const m=Math.round((h-hr)*60); return hr>0?`${hr}h ${m}m`:`${m}m`; }
}
