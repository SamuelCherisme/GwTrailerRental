
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../app/admin.service';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-bookings.html',
  styleUrls: ['../../dashboard/admin-dashboard/admin-dashboard.css', './admin-bookings.css']
})
export class AdminBookings implements OnInit {
  bookings = signal<any[]>([]);
  pagination = signal<any>(null);
  isLoading = signal(true);

  statusFilter = 'all';
  searchTerm = '';
  currentPage = 1;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading.set(true);
    this.adminService.getBookings(this.currentPage, 20, this.statusFilter, this.searchTerm)
      .subscribe(response => {
        this.isLoading.set(false);
        if (response.success) {
          this.bookings.set(response.bookings || []);
          this.pagination.set(response.pagination);
        }
      });
  }

  updateStatus(bookingId: string, event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.adminService.updateBookingStatus(bookingId, status).subscribe(response => {
      if (response.success) {
        this.loadBookings();
      }
    });
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadBookings();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
}
