// src/app/app.ts

import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
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
}
