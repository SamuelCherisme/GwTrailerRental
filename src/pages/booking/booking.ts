import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../app/auth.service';
import { BookingService } from '../../app/booking.service';

interface Trailer {
  id: number;
  title: string;
  location: string;
  type: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class Booking implements OnInit {
  trailer: Trailer | null = null;
  isLoading = signal(false);
  error: string | null = null;
  success = false;

  // Form fields
  startDate = '';
  endDate = '';
  pickupLocation = '';
  dropoffLocation = '';
  sameDropoff = true;
  notes = '';

  // Calculated values
  totalDays = 0;
  totalPrice = 0;

  // Unavailable dates
  unavailableDates: string[] = [];

  // Min date (today)
  minDate = new Date().toISOString().split('T')[0];

  // Locations
  locations = ['Atlanta', 'Dallas', 'Miami', 'Houston', 'Phoenix'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    // Check if logged in
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    // Get trailer ID from route
    const trailerId = this.route.snapshot.queryParamMap.get('trailerId');
    if (!trailerId) {
      this.router.navigate(['/trailers']);
      return;
    }

    this.loadTrailer(Number(trailerId));
    this.loadUnavailableDates(Number(trailerId));
  }

  loadTrailer(id: number) {
    this.isLoading.set(true);

    // Fetch trailer from API
    fetch(`http://localhost:3000/api/trailers/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          this.error = 'Trailer not found';
          this.isLoading.set(false);
          return;
        }
        this.trailer = data;
        this.pickupLocation = data.location;
        this.isLoading.set(false);
      })
      .catch(() => {
        this.error = 'Failed to load trailer';
        this.isLoading.set(false);
      });
  }

  loadUnavailableDates(trailerId: number) {
    this.bookingService.getUnavailableDates(trailerId).subscribe(response => {
      if (response.success) {
        this.unavailableDates = response.unavailableDates;
      }
    });
  }

  onDateChange() {
    if (this.startDate && this.endDate && this.trailer) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      if (end > start) {
        this.totalDays = this.bookingService.calculateDays(this.startDate, this.endDate);
        this.totalPrice = this.totalDays * this.trailer.price;
      } else {
        this.totalDays = 0;
        this.totalPrice = 0;
      }
    }
  }

  onSameDropoffChange() {
    if (this.sameDropoff && this.trailer) {
      this.dropoffLocation = this.pickupLocation;
    }
  }

  isDateUnavailable(date: string): boolean {
    return this.unavailableDates.includes(date);
  }

  handleSubmit() {
    this.error = null;

    if (!this.trailer) return;

    if (!this.startDate || !this.endDate) {
      this.error = 'Please select pickup and return dates';
      return;
    }

    if (!this.pickupLocation) {
      this.error = 'Please select a pickup location';
      return;
    }

    const dropoff = this.sameDropoff ? this.pickupLocation : this.dropoffLocation;
    if (!dropoff) {
      this.error = 'Please select a dropoff location';
      return;
    }

    this.isLoading.set(true);

    this.bookingService.createBooking({
      trailerId: this.trailer.id,
      startDate: this.startDate,
      endDate: this.endDate,
      pickupLocation: this.pickupLocation,
      dropoffLocation: dropoff,
      notes: this.notes
    }).subscribe(response => {
      this.isLoading.set(false);

      if (response.success) {
        this.success = true;
      } else {
        this.error = response.message || 'Failed to create booking';
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
