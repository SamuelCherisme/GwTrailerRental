import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaymentService } from './../../../app/payment.service';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="success-page">
      <div class="success-container">
        
        @if (isLoading()) {
          <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Verifying your payment...</p>
          </div>
        }

        @if (!isLoading() && isSuccess()) {
          <div class="success-content">
            <div class="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h1>Payment Successful!</h1>
            <p class="subtitle">Your trailer has been booked and confirmed.</p>
            
            <div class="booking-details">
              <div class="detail-row">
                <span class="label">Booking ID</span>
                <span class="value">#{{ bookingId()?.slice(-8)?.toUpperCase() }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Status</span>
                <span class="value status-confirmed">Confirmed</span>
              </div>
            </div>

            <div class="next-steps">
              <h3>What's Next?</h3>
              <ul>
                <li>✓ You'll receive a confirmation email shortly</li>
                <li>✓ Bring your ID and this confirmation to pickup</li>
                <li>✓ Arrive at your pickup location on time</li>
              </ul>
            </div>

            <div class="actions">
              <a routerLink="/my-bookings" class="btn btn-primary">View My Bookings</a>
              <a routerLink="/trailers" class="btn btn-outline">Browse More Trailers</a>
            </div>
          </div>
        }

        @if (!isLoading() && !isSuccess()) {
          <div class="error-content">
            <div class="error-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h1>Verification Failed</h1>
            <p>{{ errorMessage() }}</p>
            <div class="actions">
              <a routerLink="/my-bookings" class="btn btn-primary">View My Bookings</a>
              <a routerLink="/" class="btn btn-outline">Go Home</a>
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .success-page {
      min-height: 100vh;
      background: linear-gradient(180deg, #faf6f0 0%, #fff 50%);
      padding: 120px 20px 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .success-container {
      max-width: 500px;
      width: 100%;
    }

    .loading-state {
      text-align: center;
      padding: 60px 20px;
    }

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e0e0e0;
      border-top-color: #d63031;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .success-content, .error-content {
      background: white;
      border-radius: 24px;
      padding: 48px 40px;
      text-align: center;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
    }

    .success-icon, .error-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }

    .success-icon {
      background: rgba(39, 174, 96, 0.1);
    }

    .success-icon svg {
      width: 40px;
      height: 40px;
      color: #27ae60;
    }

    .error-icon {
      background: rgba(214, 48, 49, 0.1);
    }

    .error-icon svg {
      width: 40px;
      height: 40px;
      color: #d63031;
    }

    h1 {
      font-family: 'Syne', sans-serif;
      font-size: 28px;
      font-weight: 800;
      color: #1a1a2e;
      margin: 0 0 8px;
    }

    .subtitle {
      color: #636e72;
      margin: 0 0 32px;
    }

    .booking-details {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }

    .label {
      color: #636e72;
    }

    .value {
      font-weight: 600;
      color: #1a1a2e;
    }

    .status-confirmed {
      color: #27ae60;
    }

    .next-steps {
      text-align: left;
      margin-bottom: 32px;
    }

    .next-steps h3 {
      font-family: 'Syne', sans-serif;
      font-size: 16px;
      font-weight: 700;
      margin: 0 0 12px;
      color: #1a1a2e;
    }

    .next-steps ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .next-steps li {
      padding: 8px 0;
      color: #636e72;
      font-size: 14px;
    }

    .actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 14px 28px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.25s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #d63031 0%, #b71c1c 100%);
      color: white;
      box-shadow: 0 4px 20px rgba(214, 48, 49, 0.35);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(214, 48, 49, 0.45);
    }

    .btn-outline {
      background: white;
      color: #1a1a2e;
      border: 2px solid #e0e0e0;
    }

    .btn-outline:hover {
      border-color: #d63031;
      color: #d63031;
    }
  `]
})
export class BookingSuccess implements OnInit {
  isLoading = signal(true);
  isSuccess = signal(false);
  bookingId = signal<string | null>(null);
  errorMessage = signal('Something went wrong');

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    const bookingId = this.route.snapshot.queryParamMap.get('booking_id');

    if (!sessionId || !bookingId) {
      this.isLoading.set(false);
      this.errorMessage.set('Missing payment information');
      return;
    }

    this.bookingId.set(bookingId);

    // Verify payment
    this.paymentService.verifyPayment(sessionId, bookingId).subscribe(response => {
      this.isLoading.set(false);
      
      if (response.success) {
        this.isSuccess.set(true);
      } else {
        this.errorMessage.set(response.message || 'Payment verification failed');
      }
    });
  }
}