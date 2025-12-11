// pages/locations/locations.ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './locations.html',
  styleUrl: './locations.css'
})
export class Locations {
  // Placeholder data for locations
  locationData = [
    { name: 'Atlanta, GA (HQ)', address: '123 Hauling Way, Atlanta, GA 30303', hours: 'Mon-Sat, 8:00 AM - 5:00 PM', mapUrl: 'https://maps.google.com/?q=Atlanta' },
    { name: 'Dallas, TX', address: '456 Trailer Dr, Dallas, TX 75201', hours: 'Mon-Sat, 9:00 AM - 6:00 PM', mapUrl: 'https://maps.google.com/?q=Dallas' },
    { name: 'Charlotte, NC', address: '789 Cargo Blvd, Charlotte, NC 28202', hours: 'By Appointment Only', mapUrl: 'https://maps.google.com/?q=Charlotte' },
    { name: 'Miami, FL', address: '101 Beachfront Rd, Miami, FL 33101', hours: 'Mon-Fri, 7:00 AM - 4:00 PM', mapUrl: 'https://maps.google.com/?q=Miami' },
  ];
}
