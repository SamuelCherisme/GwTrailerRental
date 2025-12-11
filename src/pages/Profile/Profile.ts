import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Loading state while auth initializes -->
    <div *ngIf="!auth.isReady()" class="page-content container" style="max-width: 800px; padding-top: 120px;">
      <p>Loading...</p>
    </div>

    <!-- Main content once auth is ready -->
    <div *ngIf="auth.isReady()" class="page-content container" style="max-width: 800px; padding-top: 120px;">

      <!-- Logged in view -->
      <ng-container *ngIf="auth.isLoggedIn()">
        <h2>Welcome to Your Dashboard, {{ auth.currentUser()?.name || auth.currentUser()?.email || 'User' }}!</h2>
        <p>This is your personal profile page. Here you can view your active rentals and update your information.</p>

        <div style="margin-top: 30px; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
          <h3>Account Details</h3>
          <p><strong>Name:</strong> {{ auth.currentUser()?.name || 'N/A' }}</p>
          <p><strong>Email:</strong> {{ auth.currentUser()?.email || 'N/A' }}</p>
          <p><strong>Status:</strong> Logged In</p>
        </div>

        <button (click)="auth.logout()" class="btn btn-primary" style="margin-top: 20px;">Sign Out</button>
      </ng-container>

      <!-- Not logged in view -->
      <ng-container *ngIf="!auth.isLoggedIn()">
        <h2>Access Denied</h2>
        <p>Please <a routerLink="/login">sign in</a> to view your profile.</p>
      </ng-container>

    </div>
  `
})
export class Profile implements OnInit {

  constructor(public auth: AuthService) {}

  ngOnInit() {
    // Wait for auth to be ready, then redirect if not logged in
    if (this.auth.isReady() && !this.auth.isLoggedIn()) {
      this.auth.redirectToLogin();
    }
  }
}
