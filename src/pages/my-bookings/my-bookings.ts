import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../app/auth.service';
import { BookingService, Booking } from '../../app/booking.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.html',
  styleUrls: ['./my-bookings.css']
})
export class MyBookings implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  isLoading = signal(true);
  error: string | null = null;

  activeFilter = 'all';
  filters = [
    { key: 'all', label: 'All Bookings' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  // Cancel modal
  showCancelModal = false;
  bookingToCancel: Booking | null = null;
  isCancelling = signal(false);

  constructor(
    public auth: AuthService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadBookings();
  }

  loadBookings() {
    this.isLoading.set(true);
    this.error = null;

    this.bookingService.getUserBookings().subscribe(response => {
      this.isLoading.set(false);

      if (response.success) {
        this.bookings = response.bookings || [];
        this.applyFilter();
      } else {
        this.error = response.message || 'Failed to load bookings';
      }
    });
  }

  applyFilter() {
    if (this.activeFilter === 'all') {
      this.filteredBookings = [...this.bookings];
    } else {
      this.filteredBookings = this.bookings.filter(b => b.status === this.activeFilter);
    }
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.applyFilter();
  }

  getFilterCount(filter: string): number {
    if (filter === 'all') return this.bookings.length;
    return this.bookings.filter(b => b.status === filter).length;
  }

  openCancelModal(booking: Booking) {
    this.bookingToCancel = booking;
    this.showCancelModal = true;
  }

  closeCancelModal() {
    this.showCancelModal = false;
    this.bookingToCancel = null;
  }

  confirmCancel() {
    if (!this.bookingToCancel) return;

    this.isCancelling.set(true);

    this.bookingService.cancelBooking(this.bookingToCancel._id).subscribe(response => {
      this.isCancelling.set(false);

      if (response.success) {
        // Update local state
        const index = this.bookings.findIndex(b => b._id === this.bookingToCancel?._id);
        if (index > -1) {
          this.bookings[index].status = 'cancelled';
        }
        this.applyFilter();
        this.closeCancelModal();
      } else {
        alert(response.message || 'Failed to cancel booking');
      }
    });
  }

  formatDate(dateString: string): string {
    return this.bookingService.formatDate(dateString);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getStatusClass(status: string): string {
    return this.bookingService.getStatusClass(status);
  }

  canCancel(booking: Booking): boolean {
    return ['pending', 'confirmed'].includes(booking.status);
  }
}
