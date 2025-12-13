import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../app/admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-users.html',
  styleUrls: ['../../dashboard/admin-dashboard/admin-dashboard.css', './admin-users.css']
})
export class AdminUsers implements OnInit {
  users = signal<any[]>([]);
  isLoading = signal(true);
  searchTerm = '';
  statusFilter = '';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.adminService.getUsers(1, 50, this.searchTerm, this.statusFilter).subscribe(res => {
      this.isLoading.set(false);
      if (res.success) this.users.set(res.users || []);
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
