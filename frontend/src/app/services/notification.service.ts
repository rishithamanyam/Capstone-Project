import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Notification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient) {}

  getAll()             { return this.http.get<Notification[]>('/api/notifications'); }
  getCount()           { return this.http.get<{ count: number }>('/api/notifications/count'); }
  markRead(id: number) { return this.http.put<any>(`/api/notifications/${id}/read`, {}); }
  clearRead()          { return this.http.delete<any>('/api/notifications/clear'); }
}
