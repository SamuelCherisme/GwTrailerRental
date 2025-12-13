import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../app/booking.service';
import { PaymentService } from '../../app/payment.service';
import { AuthService } from '../../app/auth.service';

interface Booking {
  _id: string;
  trailer: number;
  trailerTitle: string;
  trailerDetails?: any;
  startDate: string;
  endDate: string;
  totalDays: number;
  pricePerDay: number;
  totalPrice: number;
  status: string;
  pickupLocation: string;
  dropoffLocation: string;
  paymentId?: string;
  createdAt: string;
}

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.html',
  styleUrls: ['./my-bookings.css']
})
export class MyBookings implements OnInit {
  bookings = signal<Booking[]>([]);
  filteredBookings = signal<Booking[]>([]);
  isLoading = signal(true);
  activeFilter = signal('all');

  showCancelModal = signal(false);
  bookingToCancel = signal<Booking | null>(null);
  isCancelling = signal(false);

  isPaymentLoading = signal<string | null>(null);

  constructor(
    private bookingService: BookingService,
    private paymentService: PaymentService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading.set(true);
    this.bookingService.getUserBookings().subscribe({
      next: (response) => {
        if (response.success) {
          this.bookings.set(response.bookings || []);
          this.applyFilter(this.activeFilter());
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  applyFilter(status: string) {
    this.activeFilter.set(status);
    if (status === 'all') {
      this.filteredBookings.set(this.bookings());
    } else {
      this.filteredBookings.set(this.bookings().filter(b => b.status === status));
    }
  }

  // Pay for pending booking
  async payNow(booking: Booking) {
    this.isPaymentLoading.set(booking._id);
    const result = await this.paymentService.createCheckoutSession(booking._id);

    if (!result.success) {
      alert(result.message || 'Failed to start payment');
      this.isPaymentLoading.set(null);
    }
    // If successful, user will be redirected to Stripe
  }

  openCancelModal(booking: Booking) {
    this.bookingToCancel.set(booking);
    this.showCancelModal.set(true);
  }

  closeCancelModal() {
    this.showCancelModal.set(false);
    this.bookingToCancel.set(null);
  }

  confirmCancel() {
    const booking = this.bookingToCancel();
    if (!booking) return;

    this.isCancelling.set(true);
    this.bookingService.cancelBooking(booking._id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadBookings();
          this.closeCancelModal();
        }
        this.isCancelling.set(false);
      },
      error: () => {
        this.isCancelling.set(false);
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
