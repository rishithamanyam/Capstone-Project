import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  admin()    { return this.http.get<any>('/api/analytics/admin'); }
  manager()  { return this.http.get<any>('/api/analytics/manager'); }
  rep()      { return this.http.get<any>('/api/analytics/rep'); }
  customer() { return this.http.get<any>('/api/analytics/customer'); }
}
