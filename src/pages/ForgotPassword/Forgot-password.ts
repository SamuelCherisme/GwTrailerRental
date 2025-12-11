// src/pages/forgot-password/forgot-password.ts

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './Forgot-password.html',
  styleUrls: ['../../styles/auth.css']
})
export class ForgotPassword {
  email = '';
  isLoading = false;
  success = false;
  error: string | null = null;

  constructor(private auth: AuthService) {}

  handleReset() {
    this.error = null;

    if (!this.email.trim()) {
      this.error = 'Please enter your email address.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Please enter a valid email address.';
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      this.success = true;
      this.isLoading = false;
    }, 1000);
  }
}
