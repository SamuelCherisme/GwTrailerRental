// pages/pricing/pricing.ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // <-- CRITICAL: Import RouterLink here

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [RouterLink], // <-- CRITICAL: Add RouterLink to the imports array
  templateUrl: './pricing.html',
  styleUrl: './pricing.css'
})
export class Pricing {
  // Component logic goes here
}
