import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './locations.html',
  styleUrls: ['./locations.css']
})
export class Locations {
  currentYear = new Date().getFullYear();

  locationData = [
    {
      city: 'Atlanta',
      state: 'GA',
      name: 'Atlanta, GA (Headquarters)',
      address: '123 Hauling Way, Atlanta, GA 30303',
      hours: 'Mon-Sat: 7:00 AM - 6:00 PM',
      phone: '(404) 555-0123',
      type: 'Full Service Location',
      isHQ: true,
      trailerCount: 8,
      directionsUrl: 'https://maps.google.com/?q=Atlanta+GA',
      mapPosition: { x: '72%', y: '58%' }
    },
    {
      city: 'Dallas',
      state: 'TX',
      name: 'Dallas, TX',
      address: '456 Trailer Dr, Dallas, TX 75201',
      hours: 'Mon-Sat: 8:00 AM - 5:00 PM',
      phone: '(214) 555-0456',
      type: 'Full Service Location',
      isHQ: false,
      trailerCount: 5,
      directionsUrl: 'https://maps.google.com/?q=Dallas+TX',
      mapPosition: { x: '42%', y: '62%' }
    },
    {
      city: 'Charlotte',
      state: 'NC',
      name: 'Charlotte, NC',
      address: '789 Cargo Blvd, Charlotte, NC 28202',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
      phone: '(704) 555-0789',
      type: 'Pickup Location',
      isHQ: false,
      trailerCount: 3,
      directionsUrl: 'https://maps.google.com/?q=Charlotte+NC',
      mapPosition: { x: '75%', y: '52%' }
    },
    {
      city: 'Miami',
      state: 'FL',
      name: 'Miami, FL',
      address: '101 Beachfront Rd, Miami, FL 33101',
      hours: 'Mon-Fri: 7:00 AM - 4:00 PM',
      phone: '(305) 555-0101',
      type: 'Full Service Location',
      isHQ: false,
      trailerCount: 4,
      directionsUrl: 'https://maps.google.com/?q=Miami+FL',
      mapPosition: { x: '78%', y: '82%' }
    },
    {
      city: 'Houston',
      state: 'TX',
      name: 'Houston, TX',
      address: '202 Industrial Pkwy, Houston, TX 77001',
      hours: 'Mon-Sat: 6:00 AM - 6:00 PM',
      phone: '(713) 555-0202',
      type: 'Full Service Location',
      isHQ: false,
      trailerCount: 6,
      directionsUrl: 'https://maps.google.com/?q=Houston+TX',
      mapPosition: { x: '38%', y: '75%' }
    },
    {
      city: 'Phoenix',
      state: 'AZ',
      name: 'Phoenix, AZ',
      address: '303 Desert Rd, Phoenix, AZ 85001',
      hours: 'Mon-Fri: 7:00 AM - 5:00 PM',
      phone: '(602) 555-0303',
      type: 'Pickup Location',
      isHQ: false,
      trailerCount: 3,
      directionsUrl: 'https://maps.google.com/?q=Phoenix+AZ',
      mapPosition: { x: '18%', y: '58%' }
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
