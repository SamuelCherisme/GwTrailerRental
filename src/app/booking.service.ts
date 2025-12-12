import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { AuthService } from './auth.service';

export interface Booking {
  _id: string;
  trailer: number;
  trailerTitle: string;
  trailerDetails?: {
    id: number;
    title: string;
    location: string;
    type: string;
    price: number;
    description: string;
  };
  startDate: string;
  endDate: string;
  totalDays: number;
  pricePerDay: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  pickupLocation: string;
  dropoffLocation: string;
  notes?: string;
  createdAt: string;
}

export interface BookingResponse {
  success: boolean;
  message?: string;
  booking?: Booking;
  bookings?: Booking[];
  count?: number;
}

export interface AvailabilityResponse {
  success: boolean;
  available: boolean;
  trailer?: {
    id: number;
    title: string;
    pricePerDay: number;
  };
  bookedDates?: { start: string; end: string }[];
  message?: string;
}

export interface UnavailableDatesResponse {
  success: boolean;
  trailerId: number;
  unavailableDates: string[];
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Create a new booking
  createBooking(bookingData: {
    trailerId: number;
    startDate: string;
    endDate: string;
    pickupLocation: string;
    dropoffLocation?: string;
    notes?: string;
  }): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(
      `${this.API_URL}/bookings`,
      bookingData,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        return of({
          success: false,
          message: error.error?.message || 'Failed to create booking'
        });
      })
    );
  }

  // Get user's bookings
  getUserBookings(status?: string): Observable<BookingResponse> {
    let url = `${this.API_URL}/bookings`;
    if (status) {
      url += `?status=${status}`;
    }

    return this.http.get<BookingResponse>(url, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        return of({
          success: false,
          message: error.error?.message || 'Failed to fetch bookings',
          bookings: []
        });
      })
    );
  }

  // Get single booking
  getBooking(id: string): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(
      `${this.API_URL}/bookings/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        return of({
          success: false,
          message: error.error?.message || 'Failed to fetch booking'
        });
      })
    );
  }

  // Cancel booking
  cancelBooking(id: string): Observable<BookingResponse> {
    return this.http.patch<BookingResponse>(
      `${this.API_URL}/bookings/${id}/cancel`,
      {},
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        return of({
          success: false,
          message: error.error?.message || 'Failed to cancel booking'
        });
      })
    );
  }

  // Check availability (public)
  checkAvailability(trailerId: number, startDate: string, endDate: string): Observable<AvailabilityResponse> {
    return this.http.get<AvailabilityResponse>(
      `${this.API_URL}/availability?trailerId=${trailerId}&startDate=${startDate}&endDate=${endDate}`
    ).pipe(
      catchError(error => {
        return of({
          success: false,
          available: false,
          message: error.error?.message || 'Failed to check availability'
        });
      })
    );
  }

  // Get unavailable dates for a trailer (public)
  getUnavailableDates(trailerId: number): Observable<UnavailableDatesResponse> {
    return this.http.get<UnavailableDatesResponse>(
      `${this.API_URL}/trailers/${trailerId}/unavailable-dates`
    ).pipe(
      catchError(error => {
        return of({
          success: false,
          trailerId: trailerId,
          unavailableDates: []
        });
      })
    );
  }

  // Helper: Calculate total days
  calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }

  // Helper: Calculate total price
  calculatePrice(startDate: string, endDate: string, pricePerDay: number): number {
    return this.calculateDays(startDate, endDate) * pricePerDay;
  }

  // Helper: Format date for display
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Helper: Get status color class
  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      active: 'status-active',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return statusClasses[status] || 'status-pending';
  }
}
