// src/pages/reset-password/reset-password.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrls: ['../../styles/auth.css']
})
export class ResetPassword implements OnInit {
  token = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  error: string | null = null;
  success = false;
  invalidToken = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.invalidToken = true;
      this.error = 'Invalid reset link. No token provided.';
    }
  }

  get passwordsMatch(): boolean {
    return this.password === this.confirmPassword && this.confirmPassword.length > 0;
  }

  handleReset() {
    this.error = null;

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.auth.resetPassword(this.token, this.password).subscribe(response => {
      if (response.success) {
        this.success = true;
        this.error = null;
      } else {
        this.error = response.message;
      }
    });
  }
}
