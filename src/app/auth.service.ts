import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  user?: User;
  needsVerification?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api/auth';
  private readonly TOKEN_KEY = 'gw_access_token';

  // Signals for reactive state
  currentUser = signal<User | null>(null);
  isLoggedIn = signal<boolean>(false);
  isReady = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  // Initialize auth state on app load
  private initializeAuth() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (token) {
        this.fetchCurrentUser();
      } else {
        this.isReady.set(true);
      }
    } else {
      this.isReady.set(true);
    }
  }

  // Get stored access token
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  // Store access token
  private setToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  // Remove access token
  private removeToken() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  // Register new user
  register(name: string, email: string, password: string): Observable<AuthResponse> {
    this.isLoading.set(true);

    return this.http.post<AuthResponse>(`${this.API_URL}/register`, {
      name,
      email,
      password
    }).pipe(
      tap(response => {
        this.isLoading.set(false);
        if (response.success) {
          // Don't log in yet - user needs to verify email
          console.log('Registration successful, verification email sent');
        }
      }),
      catchError(error => {
        this.isLoading.set(false);
        return of({
          success: false,
          message: error.error?.message || 'Registration failed. Please try again.'
        });
      })
    );
  }

  // Login user
  login(email: string, password: string): Observable<AuthResponse> {
    this.isLoading.set(true);

    return this.http.post<AuthResponse>(`${this.API_URL}/login`, {
      email,
      password
    }, { withCredentials: true }).pipe(
      tap(response => {
        this.isLoading.set(false);
        if (response.success && response.accessToken && response.user) {
          this.setToken(response.accessToken);
          this.currentUser.set(response.user);
          this.isLoggedIn.set(true);
          console.log('Login successful:', response.user.name);
        }
      }),
      catchError(error => {
        this.isLoading.set(false);
        return of({
          success: false,
          message: error.error?.message || 'Login failed. Please try again.',
          needsVerification: error.error?.needsVerification
        });
      })
    );
  }

  // Verify email with token
  verifyEmail(token: string): Observable<AuthResponse> {
    this.isLoading.set(true);

    return this.http.post<AuthResponse>(`${this.API_URL}/verify-email`, {
      token
    }).pipe(
      tap(response => {
        this.isLoading.set(false);
      }),
      catchError(error => {
        this.isLoading.set(false);
        return of({
          success: false,
          message: error.error?.message || 'Verification failed. Please try again.'
        });
      })
    );
  }

  // Resend verification email
  resendVerification(email: string): Observable<AuthResponse> {
    this.isLoading.set(true);

    return this.http.post<AuthResponse>(`${this.API_URL}/resend-verification`, {
      email
    }).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(error => {
        this.isLoading.set(false);
        return of({
          success: false,
          message: error.error?.message || 'Failed to resend verification email.'
        });
      })
    );
  }

  // Forgot password - request reset email
  forgotPassword(email: string): Observable<AuthResponse> {
    this.isLoading.set(true);

    return this.http.post<AuthResponse>(`${this.API_URL}/forgot-password`, {
      email
    }).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(error => {
        this.isLoading.set(false);
        return of({
          success: false,
          message: error.error?.message || 'Failed to send reset email.'
        });
      })
    );
  }

  // Reset password with token
  resetPassword(token: string, password: string): Observable<AuthResponse> {
    this.isLoading.set(true);

    return this.http.post<AuthResponse>(`${this.API_URL}/reset-password`, {
      token,
      password
    }).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(error => {
        this.isLoading.set(false);
        return of({
          success: false,
          message: error.error?.message || 'Password reset failed.'
        });
      })
    );
  }

  // Fetch current user from API
  fetchCurrentUser() {
    const token = this.getToken();
    if (!token) {
      this.isReady.set(true);
      return;
    }

    this.http.get<AuthResponse>(`${this.API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(response => {
        if (response.success && response.user) {
          this.currentUser.set(response.user);
          this.isLoggedIn.set(true);
        } else {
          this.removeToken();
        }
        this.isReady.set(true);
      }),
      catchError(() => {
        this.removeToken();
        this.isReady.set(true);
        return of(null);
      })
    ).subscribe();
  }

  // Refresh access token
  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/refresh-token`, {}, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success && response.accessToken) {
          this.setToken(response.accessToken);
        }
      }),
      catchError(error => {
        this.logout();
        return of({
          success: false,
          message: 'Session expired. Please log in again.'
        });
      })
    );
  }

  // Logout user
  logout() {
    this.http.post<AuthResponse>(`${this.API_URL}/logout`, {}, {
      withCredentials: true
    }).subscribe();

    this.removeToken();
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/']);
    console.log('Logged out');
  }

  // Redirect to login
  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  // Redirect to profile
  redirectToProfile() {
    this.router.navigate(['/profile']);
  }
}
