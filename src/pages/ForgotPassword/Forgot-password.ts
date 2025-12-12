import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['../../styles/auth.css']
})
export class ForgotPassword {
  email = '';
  success = false;
  error: string | null = null;

  constructor(public auth: AuthService) {}

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

    this.auth.forgotPassword(this.email).subscribe(response => {
      if (response.success) {
        this.success = true;
        this.error = null;
      } else {
        this.error = response.message;
      }
    });
  }
}
