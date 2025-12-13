// src/pages/admin/dashboard/admin-dashboard.ts

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../../app/admin.service';
import { AuthService } from '../../../../app/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  stats = signal<any>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private adminService: AdminService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading.set(true);
    this.adminService.getDashboardStats().subscribe(response => {
      this.isLoading.set(false);
      if (response.success && response.stats) {
        this.stats.set(response.stats);
      } else {
        this.error.set(response.message || 'Failed to load dashboard');
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      active: 'status-active',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return classes[status] || 'status-pending';
  }
}
