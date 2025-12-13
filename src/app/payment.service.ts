import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from './environments/environment';

export interface CheckoutResponse {
  success: boolean;
  sessionId?: string;
  url?: string;
  message?: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  message?: string;
  booking?: {
    id: string;
    status: string;
    totalPrice: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly API_URL = environment.apiUrl;

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

  // Create checkout session and redirect to Stripe
  async createCheckoutSession(bookingId: string): Promise<CheckoutResponse> {
    try {
      const response = await this.http.post<CheckoutResponse>(
        `${this.API_URL}/payments/create-checkout-session`,
        { bookingId },
        { headers: this.getHeaders() }
      ).toPromise();

      if (response?.success && response.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.url;
      }

      return response || { success: false, message: 'No response' };
    } catch (error: any) {
      console.error('Checkout error:', error);
      return {
        success: false,
        message: error.error?.message || 'Failed to create checkout session'
      };
    }
  }

  // Verify payment after returning from Stripe
  verifyPayment(sessionId: string, bookingId: string): Observable<PaymentVerifyResponse> {
    return this.http.post<PaymentVerifyResponse>(
      `${this.API_URL}/payments/verify`,
      { sessionId, bookingId },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        return of({
          success: false,
          message: error.error?.message || 'Failed to verify payment'
        });
      })
    );
  }
}
