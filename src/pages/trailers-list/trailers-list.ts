// pages/trailers-list/trailers-list.component.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';

interface Trailer {
  id: number;
  title: string;
  location: string;
  type: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-trailers-list',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './trailers-list.html',
  styleUrls: ['./trailers-list.css']
})
export class TrailersList implements OnInit {
  trailers: Trailer[] = [];
  filteredTrailers: Trailer[] = [];

  availableLocations: string[] = ['Atlanta, GA', 'Dallas, TX', 'Charlotte, NC', 'Miami, FL'];
  availableTypes: string[] = ['Utility', 'Cargo', 'Flatbed', 'Dump'];

  selectedLocation: string = '';
  selectedType: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void { this.fetchTrailers(); }

  fetchTrailers(): void {
    let params = new HttpParams();
    // ... logic to build params ...

    this.http.get<Trailer[]>('http://localhost:3000/api/trailers', { params })
      .subscribe({
        next: (data) => { this.trailers = data; this.filteredTrailers = data; },
        error: (err) => { console.error('Error fetching data:', err); this.trailers = []; this.filteredTrailers = []; }
      });
  }

  applyFilters(): void { this.fetchTrailers(); }
  clearFilters(): void {
    this.selectedLocation = '';
    this.selectedType = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.fetchTrailers();
  }
}
