// src/app/app.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { LocationService } from './location.service';
import { LocationPrompt } from '../components/location-prompt';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    LocationPrompt
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('gw-rental-app');
  currentYear = new Date().getFullYear();

  constructor(
    public auth: AuthService,
    public locationService: LocationService
  ) {}

  getInitials(): string {
    const name = this.auth.currentUser()?.name;
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }
}

