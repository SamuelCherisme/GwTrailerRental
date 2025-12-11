import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationService } from '../app/location.service';

@Component({
  selector: 'app-location-prompt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-prompt.html',
  styleUrls: ['./location-prompt.css']
})
export class LocationPrompt {
  constructor(public locationService: LocationService) {}

  async allowLocation() {
    await this.locationService.requestLocation();
  }

  dismiss() {
    this.locationService.dismissPrompt();
  }
}
