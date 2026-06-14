import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/topbar/topbar.component';
import { AnalyticsService } from '../../services/analytics.service';
import { TicketService } from '../../services/ticket.service';
import { OutageService } from '../../services/outage.service';
import { Ticket } from '../../models/ticket.model';
import { Outage } from '../../models/outage.model';

Chart.register(...registerables);

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopbarComponent],
  templateUrl: './manager.component.html'
})
export class ManagerComponent implements OnInit {
  stats: any = {};
  tickets: Ticket[] = [];
  outages: Outage[] = [];
  repMetrics: any[] = [];

  @ViewChild('repChart') repCanvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  constructor(
    private analyticsSvc: AnalyticsService,
    private ticketSvc: TicketService,
    private outageSvc: OutageService
  ) {}

  ngOnInit() {
    this.analyticsSvc.manager().subscribe(d => {
      this.stats      = d;
      this.repMetrics = d.repMetrics || [];
      setTimeout(() => this.buildChart(), 100);
    });
    this.ticketSvc.getAll().subscribe(d => { this.tickets = d; });
    this.outageSvc.getActive().subscribe(d => { this.outages = d; });
  }

  buildChart() {
    if (this.chart) this.chart.destroy();
    if (!this.repMetrics.length || !this.repCanvas?.nativeElement) return;
    const reps = this.repMetrics;
    this.chart = new Chart(this.repCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: reps.map(r => r.name.split(' ')[0]),
        datasets: [
          { label: 'Open',        data: reps.map(r => r.openTickets),       backgroundColor: '#fbbf24' },
          { label: 'In Progress', data: reps.map(r => r.inProgressTickets), backgroundColor: '#4f46e5' },
          { label: 'Closed',      data: reps.map(r => r.closedTickets),     backgroundColor: '#059669' },
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true, ticks: { stepSize: 1 } } } }
    });
  }

  perfPct(r: any) {
    const total = r.openTickets + r.inProgressTickets + r.closedTickets;
    return total > 0 ? Math.round((r.closedTickets / total) * 100) : 0;
  }

  statusClass(s: string) { const m: Record<string,string> = { OPEN:'b-amber', IN_PROGRESS:'b-blue', CLOSED:'b-green' }; return 'badge ' + (m[s]||'b-gray'); }
  statusLabel(s: string) { return s === 'IN_PROGRESS' ? 'In Progress' : s.charAt(0) + s.slice(1).toLowerCase(); }
  fmtDate(iso?: string) { if (!iso) return '—'; return new Date(iso).toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'}); }
  fmtHrs(h?: number) { if (h==null) return '—'; const hr=Math.floor(h); const m=Math.round((h-hr)*60); return hr>0?`${hr}h ${m}m`:`${m}m`; }
}
