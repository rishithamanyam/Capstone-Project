import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ticket } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  constructor(private http: HttpClient) {}

  getAll()            { return this.http.get<Ticket[]>('/api/tickets'); }
  create(body: any)   { return this.http.post<Ticket>('/api/tickets', body); }
  updateStatus(id: number, status: string) {
    return this.http.put<Ticket>(`/api/tickets/${id}/status`, { status });
  }
  rate(id: number, rating: number) {
    return this.http.put<Ticket>(`/api/tickets/${id}/rate`, { rating });
  }
}
