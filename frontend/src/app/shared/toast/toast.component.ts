import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (t of toastSvc.toasts; track t.id) {
        <div class="toast" [class]="t.type">
          <span>{{ icons[t.type] }}</span>
          <span class="toast-msg">{{ t.message }}</span>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  icons: Record<string, string> = { success: '✅', error: '❌', info: 'ℹ️' };
  constructor(public toastSvc: ToastService) {}
}
