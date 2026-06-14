import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/topbar/topbar.component';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user!: User;
  editForm = { name: '', phone: '' };
  pwForm   = { current: '', newPass: '', confirm: '' };
  editMode = false;

  constructor(private auth: AuthService, private toast: ToastService) {}

  ngOnInit() {
    this.user = this.auth.getUser()!;
    this.editForm = { name: this.user.name, phone: this.user.phone || '' };
  }

  get initials() {
    return this.user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }

  saveProfile() {
    this.auth.updateProfile({ name: this.editForm.name, phone: this.editForm.phone }).subscribe({
      next: (u) => {
        const updated = { ...this.user, name: u.name || this.editForm.name, phone: u.phone || this.editForm.phone };
        sessionStorage.setItem('user', JSON.stringify(updated));
        this.user = updated;
        this.editMode = false;
        this.toast.success('Profile updated!');
      },
      error: () => this.toast.error('Update failed')
    });
  }

  changePassword() {
    if (!this.pwForm.current || !this.pwForm.newPass) { this.toast.error('Please fill all fields'); return; }
    if (this.pwForm.newPass !== this.pwForm.confirm)  { this.toast.error('Passwords do not match'); return; }
    if (this.pwForm.newPass.length < 6)               { this.toast.error('Password must be at least 6 characters'); return; }
    this.auth.changePassword(this.pwForm.current, this.pwForm.newPass).subscribe({
      next: () => { this.toast.success('Password changed!'); this.pwForm = { current: '', newPass: '', confirm: '' }; },
      error: (e) => this.toast.error(e.error?.message || 'Current password incorrect')
    });
  }

  roleBadgeClass() {
    const m: Record<string, string> = { ADMIN:'b-red', MANAGER:'b-violet', REPRESENTATIVE:'b-indigo', CUSTOMER:'b-cyan' };
    return 'badge ' + (m[this.user.role] || 'b-gray');
  }

  fmtDate(iso?: string) { if (!iso) return '—'; return new Date(iso).toLocaleDateString('en-US',{month:'long',day:'2-digit',year:'numeric'}); }
}
