// src/pages/signup/signup.ts (UPDATED FOR FULL REGISTRATION)

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Needed for any *ngIf logic
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="page-content container" style="max-width: 400px; padding-top: 120px;">
      <h2>Create an Account</h2>
      <form (ngSubmit)="handleSignup()">
        <p *ngIf="error" style="color: red; margin-bottom: 10px;">{{ error }}</p>

        <div class="form-group" style="margin-bottom: 1rem;">
          <label>Full Name</label>
          <input type="text" [(ngModel)]="name" name="name" class="form-input" required style="width: 100%; padding: 10px;">
        </div>

        <div class="form-group" style="margin-bottom: 1rem;">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" name="email" class="form-input" required style="width: 100%; padding: 10px;">
        </div>

        <div class="form-group" style="margin-bottom: 1rem;">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" name="password" class="form-input" required style="width: 100%; padding: 10px;">
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%;">Get Started</button>
      </form>
    </div>
  `
})
export class Signup {
  email = '';
  password = '';
  name = '';
  error: string | null = null;

  constructor(private auth: AuthService) {}

  handleSignup() {
    this.error = null;

    // Check for basic password strength (optional but recommended)
    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long.';
      return;
    }

    // Call the updated register method from the service
    const success = this.auth.register(this.email, this.password, this.name);

    if (!success) {
      // This will catch the 'Email already exists' error from the AuthService
      this.error = 'Registration failed. This email may already be in use.';
    }

    // If successful, the AuthService will handle the navigation to '/profile'
  }
}
