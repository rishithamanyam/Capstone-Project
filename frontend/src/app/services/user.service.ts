import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getEmployees()         { return this.http.get<User[]>('/api/users/employees'); }
  search(q: string)      { return this.http.get<User[]>(`/api/users/search?q=${encodeURIComponent(q)}`); }
  create(body: any)      { return this.http.post<User>('/api/users', body); }
  update(id: number, body: any) { return this.http.put<User>(`/api/users/${id}`, body); }
  delete(id: number)     { return this.http.delete<any>(`/api/users/${id}`); }
}
