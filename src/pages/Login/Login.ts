// src/pages/login/login.ts (UPDATED)
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Need CommonModule for *ngIf
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="page-content container" style="max-width: 400px; padding-top: 120px;">
      <h2>Sign In</h2>
      <form (ngSubmit)="handleLogin()">
        <p *ngIf="error" style="color: red; margin-bottom: 10px;">{{ error }}</p>

        <div class="form-group" style="margin-bottom: 1rem;">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" name="email" class="form-input" required>
        </div>
        <div class="form-group" style="margin-bottom: 1rem;">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" name="password" class="form-input" required>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%;">Sign In</button>
      </form>
    </div>
  `
})
export class Login {
  email = '';
  password = '';
  error: string | null = null;

  constructor(private auth: AuthService) {}

  handleLogin() {
    this.error = null;
    const success = this.auth.login(this.email, this.password);
    if (!success) {
      this.error = 'Invalid email or password. Please try again.';
    }
  }
}
