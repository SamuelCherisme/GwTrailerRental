import { Component, OnInit } from '@angular/core'; // <-- Import OnInit
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-content container" style="max-width: 800px; padding-top: 120px;">
      <h2>Welcome to Your Dashboard, {{ auth.currentUser()?.name || auth.currentUser()?.email || 'User' }}!</h2>
      <p>This is your personal profile page. Here you can view your active rentals and update your information.</p>

      <div style="margin-top: 30px; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
        <h3>Account Details</h3>
        <p><strong>Name:</strong> {{ auth.currentUser()?.name || 'N/A' }}</p>
        <p><strong>Email:</strong> {{ auth.currentUser()?.email || 'N/A' }}</p>
        <p><strong>Status:</strong> Logged In</p>
      </div>

      <button (click)="auth.logout()" class="btn btn-primary" style="margin-top: 20px;">Sign Out</button>
    </div>
  `
})
export class Profile implements OnInit { // <-- Implement OnInit

  constructor(public auth: AuthService) {}

  ngOnInit() {
    // Check if the user is logged in after initialization.
    // If not, redirect them to login using the public service method.
    if (!this.auth.isLoggedIn()) {
      this.auth.redirectToLogin();
    }
  }
}
