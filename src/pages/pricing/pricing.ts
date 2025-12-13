import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pricing.html',
  styleUrls: ['./pricing.css']
})
export class Pricing {
  currentYear = new Date().getFullYear();

  pricingPlans = [
    {
      name: 'Utility Trailers',
      type: 'Utility',
      description: 'Perfect for small jobs, yard work, and light hauling.',
      price: 35,
      featured: false,
      features: [
        '4x6 to 7x12 sizes available',
        '1,000 - 3,500 lbs capacity',
        'Fold-down ramp gates',
        'Tie-down points included',
        'Easy hookup design'
      ]
    },
    {
      name: 'Enclosed Cargo',
      type: 'Enclosed',
      description: 'Secure, weather-protected transport for valuable cargo.',
      price: 65,
      featured: true,
      features: [
        '5x10 to 8x20 sizes available',
        '2,000 - 7,000 lbs capacity',
        'Lockable doors for security',
        'Interior lighting & E-track',
        'Climate protection'
      ]
    },
    {
      name: 'Flatbed Trailers',
      type: 'Flatbed',
      description: 'Heavy-duty hauling for equipment and vehicles.',
      price: 75,
      featured: false,
      features: [
        '6x14 to 8x24 sizes available',
        '5,000 - 14,000 lbs capacity',
        'Steel deck construction',
        'Adjustable ramps included',
        'Electric brake systems'
      ]
    },
    {
      name: 'Dump Trailers',
      type: 'Dump',
      description: 'Hydraulic dump for easy loading and unloading.',
      price: 125,
      featured: false,
      features: [
        '5x10 to 6x12 sizes available',
        '5,000 - 10,000 lbs capacity',
        'Hydraulic lift system',
        'Spreader gate included',
        'Remote control operation'
      ]
    }
  ];

  constructor(public auth: AuthService) {}

  getInitials(): string {
    const name = this.auth.currentUser()?.name;
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }
}
