// src/app/app.ts

import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // <-- RouterLink is REQUIRED

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink // <-- This inclusion resolves the routerLinkActiveOptions error
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gw-rental-app');
}
