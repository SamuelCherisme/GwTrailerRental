import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-booking-cancelled',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cancelled-page">
      <div class="cancelled-container">
        <div class="cancelled-content">
          <div class="cancelled-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h1>Payment Cancelled</h1>
          <p class="subtitle">Your payment was cancelled. Your booking is still pending.</p>

          <div class="info-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>Don't worry! Your booking hasn't been deleted. You can complete payment anytime from your bookings page.</p>
          </div>

          <div class="actions">
            <a routerLink="/my-bookings" class="btn btn-primary">Go to My Bookings</a>
            <a routerLink="/trailers" class="btn btn-outline">Browse Trailers</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cancelled-page {
      min-height: 100vh;
      background: linear-gradient(180deg, #faf6f0 0%, #fff 50%);
      padding: 120px 20px 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cancelled-container {
      max-width: 500px;
      width: 100%;
    }

    .cancelled-content {
      background: white;
      border-radius: 24px;
      padding: 48px 40px;
      text-align: center;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
    }

    .cancelled-icon {
      width: 80px;
      height: 80px;
      background: rgba(255, 159, 67, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }

    .cancelled-icon svg {
      width: 40px;
      height: 40px;
      color: #ff9f43;
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
      margin: 0 0 24px;
    }

    .info-box {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: #fff8e6;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 32px;
      text-align: left;
    }

    .info-box svg {
      width: 24px;
      height: 24px;
      color: #ff9f43;
      flex-shrink: 0;
    }

    .info-box p {
      margin: 0;
      font-size: 14px;
      color: #856404;
      line-height: 1.5;
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
export class BookingCancelled {}
