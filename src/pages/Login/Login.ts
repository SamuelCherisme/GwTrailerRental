import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['../../styles/auth.css']
})
export class Login {
  email = '';
  password = '';
  showPassword = false;
  rememberMe = false;
  error: string | null = null;
  needsVerification = false;

  constructor(
    public auth: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/profile']);
    }
  }

  handleLogin() {
    this.error = null;
    this.needsVerification = false;

    if (!this.email || !this.password) {
      this.error = 'Please enter your email and password.';
      return;
    }

    this.auth.login(this.email, this.password).subscribe(response => {
      if (response.success) {
        this.router.navigate(['/profile']);
      } else {
        this.error = response.message;
        this.needsVerification = response.needsVerification || false;
      }
    });
  }

  resendVerification() {
    if (!this.email) {
      this.error = 'Please enter your email address.';
      return;
    }

    this.auth.resendVerification(this.email).subscribe(response => {
      if (response.success) {
        this.error = null;
        alert('Verification email sent! Please check your inbox.');
      } else {
        this.error = response.message;
      }
    });
  }
}
