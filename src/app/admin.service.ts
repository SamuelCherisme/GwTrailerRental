import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = environment.apiUrl + '/admin';

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

  // ============================================
  // DASHBOARD
  // ============================================
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/dashboard`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => of({
        success: false,
        message: error.error?.message || 'Failed to load dashboard'
      }))
    );
  }

  // ============================================
  // USERS
  // ============================================
  getUsers(page = 1, limit = 20, search?: string, status?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);

    return this.http.get<any>(
      `${this.API_URL}/users`,
      { headers: this.getHeaders(), params }
    ).pipe(
      catchError(error => of({
        success: false,
        users: [],
        message: error.error?.message || 'Failed to load users'
      }))
    );
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/users/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => of({
        success: false,
        message: error.error?.message || 'Failed to load user'
      }))
    );
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put<any>(
      `${this.API_URL}/users/${id}`,
      data,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => of({
        success: false,
        message: error.error?.message || 'Failed to update user'
      }))
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.API_URL}/users/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => of({
        success: false,
        message: error.error?.message || 'Failed to delete user'
      }))
    );
  }

  // ============================================
  // BOOKINGS
  // ============================================
  getBookings(page = 1, limit = 20, status?: string, search?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (status && status !== 'all') params = params.set('status', status);
    if (search) params = params.set('search', search);

    return this.http.get<any>(
      `${this.API_URL}/bookings`,
      { headers: this.getHeaders(), params }
    ).pipe(
      catchError(error => of({
        success: false,
        bookings: [],
        message: error.error?.message || 'Failed to load bookings'
      }))
    );
  }

  updateBookingStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(
      `${this.API_URL}/bookings/${id}/status`,
      { status },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => of({
        success: false,
        message: error.error?.message || 'Failed to update booking'
      }))
    );
  }

  // ============================================
  // TRAILERS
  // ============================================
  getTrailers(): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/trailers`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => of({
        success: false,
        trailers: [],
        message: error.error?.message || 'Failed to load trailers'
      }))
    );
  }

  // ============================================
  // PAYMENTS
  // ============================================
  refundPayment(bookingId: string): Observable<any> {
    return this.http.post<any>(
      `${this.API_URL}/payments/refund`,
      { bookingId },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => of({
        success: false,
        message: error.error?.message || 'Failed to process refund'
      }))
    );
  }
}
