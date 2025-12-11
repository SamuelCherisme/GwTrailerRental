import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

interface User {
  email: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);
  isReady = signal<boolean>(false);

  private readonly USER_DB_KEY = 'gw_user_database';
  private readonly LOGGED_IN_KEY = 'gw_current_user_email';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkSessionOnStart();
    }
    this.isReady.set(true);
  }

  // === PUBLIC METHODS ===

  public isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  public redirectToLogin() {
    this.router.navigate(['/login']).then(success => {
      console.log('Navigation to /login:', success ? 'succeeded' : 'failed');
    });
  }

  public register(email: string, password: string, name: string): boolean {
    const users = this.getAllUsers();
    if (users[email]) {
      console.error('Registration failed: Email already exists.');
      return false;
    }

    users[email] = { email, password, name };
    this.saveAllUsers(users);
    this.saveSession(email);

    console.log('Registration successful, currentUser:', this.currentUser());

    this.router.navigate(['/profile']).then(success => {
      console.log('Navigation to /profile:', success ? 'succeeded' : 'failed');
    });

    return true;
  }

  public login(email: string, password: string): boolean {
    const users = this.getAllUsers();
    const storedUser = users[email];

    console.log('Login attempt for:', email);
    console.log('Stored users:', users);

    if (storedUser && storedUser.password === password) {
      this.saveSession(email);

      console.log('Login successful, currentUser:', this.currentUser());

      this.router.navigate(['/profile']).then(success => {
        console.log('Navigation to /profile:', success ? 'succeeded' : 'failed');
      });

      return true;
    }

    console.error('Login failed: Invalid credentials.');
    return false;
  }

  public logout() {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.LOGGED_IN_KEY);
    }
    this.router.navigate(['/']);
  }

  // === PRIVATE UTILITY METHODS ===

  private checkSessionOnStart() {
    const email = localStorage.getItem(this.LOGGED_IN_KEY);
    console.log('Session check - stored email:', email);
    if (email) {
      const user = this.getUserFromDB(email);
      console.log('Session check - found user:', user);
      if (user) {
        this.currentUser.set(user);
      }
    }
  }

  private saveSession(email: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.LOGGED_IN_KEY, email);
    }
    const user = this.getUserFromDB(email);
    console.log('saveSession - setting currentUser:', user);
    this.currentUser.set(user);
  }

  private getAllUsers(): { [email: string]: any } {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(this.USER_DB_KEY);
      return data ? JSON.parse(data) : {};
    }
    return {};
  }

  private saveAllUsers(users: { [email: string]: any }) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.USER_DB_KEY, JSON.stringify(users));
    }
  }

  private getUserFromDB(email: string): User | null {
    const users = this.getAllUsers();
    return users[email] ? { email: users[email].email, name: users[email].name } : null;
  }
}
