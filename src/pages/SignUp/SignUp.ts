// src/pages/signup/signup.ts

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './Signup.html',
  styleUrls: ['../../styles/auth.css'],
})
export class Signup {
  email = '';
  password = '';
  confirmPassword = '';
  name = '';
  showPassword = false;
  showConfirmPassword = false;
  agreeToTerms = false;
  isLoading = false;
  error: string | null = null;
  passwordStrength = 0;
  passwordStrengthText = '';

  constructor(private auth: AuthService) {}

  get passwordsMatch(): boolean {
    return this.password === this.confirmPassword && this.confirmPassword.length > 0;
  }

  checkPasswordStrength() {
    let strength = 0;

    if (this.password.length >= 6) strength++;
    if (this.password.length >= 10) strength++;
    if (/[A-Z]/.test(this.password) && /[a-z]/.test(this.password)) strength++;
    if (/[0-9]/.test(this.password)) strength++;
    if (/[^A-Za-z0-9]/.test(this.password)) strength++;

    this.passwordStrength = Math.min(strength, 4);

    if (this.passwordStrength <= 1) {
      this.passwordStrengthText = 'Weak';
    } else if (this.passwordStrength === 2) {
      this.passwordStrengthText = 'Fair';
    } else if (this.passwordStrength === 3) {
      this.passwordStrengthText = 'Good';
    } else {
      this.passwordStrengthText = 'Strong';
    }
  }

  handleSignup() {
    this.error = null;

    if (!this.name.trim()) {
      this.error = 'Please enter your full name.';
      return;
    }

    if (!this.email.trim()) {
      this.error = 'Please enter your email address.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    if (!this.agreeToTerms) {
      this.error = 'You must agree to the Terms of Service.';
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      const success = this.auth.register(this.email, this.password, this.name);

      if (!success) {
        this.error = 'Registration failed. This email may already be in use.';
      }
      this.isLoading = false;
    }, 500);
  }
}
