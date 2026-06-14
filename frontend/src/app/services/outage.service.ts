import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Outage } from '../models/outage.model';

@Injectable({ providedIn: 'root' })
export class OutageService {
  constructor(private http: HttpClient) {}

  getAll()      { return this.http.get<Outage[]>('/api/outages'); }
  getActive()   { return this.http.get<Outage[]>('/api/outages/active'); }
  create(body: any) { return this.http.post<Outage>('/api/outages', body); }
  resolve(id: number) { return this.http.put<Outage>(`/api/outages/${id}`, { status: 'RESOLVED' }); }
}
