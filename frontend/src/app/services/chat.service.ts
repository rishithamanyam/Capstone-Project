import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private signal = new Subject<void>();
  open$ = this.signal.asObservable();

  open() { this.signal.next(); }
}
