import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../../app/admin.service';

@Component({
  selector: 'app-admin-trailers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-trailers.html',
  styleUrls: ['../../dashboard/admin-dashboard/admin-dashboard.css', './admin-trailers.css']
})
export class AdminTrailers implements OnInit {
  trailers = signal<any[]>([]);
  isLoading = signal(true);

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getTrailers().subscribe(res => {
      this.isLoading.set(false);
      if (res.success) this.trailers.set(res.trailers || []);
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  }
}
