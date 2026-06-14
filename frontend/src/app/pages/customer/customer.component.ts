import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/topbar/topbar.component';
import { ChatbotComponent } from '../../shared/chatbot/chatbot.component';
import { AnalyticsService } from '../../services/analytics.service';
import { TicketService } from '../../services/ticket.service';
import { OutageService } from '../../services/outage.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { Ticket } from '../../models/ticket.model';
import { Outage } from '../../models/outage.model';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent, ChatbotComponent],
  templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit {
  activeTab = 'dashboard';

  stats: any = {};
  tickets: Ticket[] = [];
  outageAlert?: Outage;

  showTicketModal = false;
  showRateModal   = false;
  rateTicketId    = 0;
  selectedRating  = 0;

  ticketForm = { domain: '', subject: '', description: '' };
  readonly DOMAINS = ['Internet Services','TV & Cable','Phone Services','Mobile Data','Technical Support'];

  constructor(
    private analyticsSvc: AnalyticsService,
    private ticketSvc: TicketService,
    private outageSvc: OutageService,
    private toast: ToastService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'] || 'dashboard';
      this.activeTab = tab;
      if (tab === 'dashboard') this.loadDashboard();
      if (tab === 'tickets') this.loadTickets();
    });
  }

  setTab(tab: string) {
    this.router.navigate(['/customer'], { queryParams: { tab } });
  }

  loadDashboard() {
    this.analyticsSvc.customer().subscribe(d => { this.stats = d; });
    this.outageSvc.getActive().subscribe(outages => {
      const user = this.auth.getUser();
      this.outageAlert = outages.find(o => o.location === user?.location);
    });
    this.loadTickets();
  }

  loadTickets() {
    this.ticketSvc.getAll().subscribe(d => { this.tickets = d; });
  }

  submitTicket() {
    if (!this.ticketForm.domain || !this.ticketForm.subject || !this.ticketForm.description) {
      this.toast.error('Please fill in all fields');
      return;
    }
    this.ticketSvc.create(this.ticketForm).subscribe({
      next: () => {
        this.toast.success('Ticket raised successfully!');
        this.showTicketModal = false;
        this.ticketForm = { domain: '', subject: '', description: '' };
        this.loadTickets();
        this.analyticsSvc.customer().subscribe(d => { this.stats = d; });
      },
      error: () => this.toast.error('Failed to raise ticket')
    });
  }

  openRating(ticketId: number) {
    this.rateTicketId   = ticketId;
    this.selectedRating = 0;
    this.showRateModal  = true;
  }

  submitRating() {
    if (!this.selectedRating) { this.toast.error('Please select a rating'); return; }
    this.ticketSvc.rate(this.rateTicketId, this.selectedRating).subscribe({
      next: () => {
        this.toast.success('Thank you for your feedback!');
        this.showRateModal = false;
        this.loadTickets();
      },
      error: () => this.toast.error('Rating failed')
    });
  }

  stars(n: number) { return Array(n).fill('⭐').join(''); }
  statusClass(s: string) { const m: Record<string,string>={OPEN:'b-amber',IN_PROGRESS:'b-blue',CLOSED:'b-green'}; return 'badge '+(m[s]||'b-gray'); }
  statusLabel(s: string) { return s==='IN_PROGRESS'?'In Progress':s.charAt(0)+s.slice(1).toLowerCase(); }
  fmtDate(iso?: string) { if(!iso)return'—'; return new Date(iso).toLocaleDateString('en-IN',{month:'short',day:'2-digit',year:'numeric'}); }
  fmtHrs(h?: number) { if(h==null)return'—'; const hr=Math.floor(h); const m=Math.round((h-hr)*60); return hr>0?`${hr}h ${m}m`:`${m}m`; }
}
