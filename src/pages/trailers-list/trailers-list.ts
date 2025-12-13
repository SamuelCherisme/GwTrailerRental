import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

interface Trailer {
  id: number;
  title: string;
  name: string;
  location: string;
  type: string;
  price: number;
  dailyRate: number;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-trailers-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './trailers-list.html',
  styleUrls: ['./trailers-list.css']
})
export class TrailersList implements OnInit {
  trailers = signal<Trailer[]>([]);
  filteredTrailers = signal<Trailer[]>([]);
  isLoading = signal(true);

  availableLocations: string[] = ['Atlanta', 'Dallas', 'Miami'];
  availableTypes: string[] = ['Utility', 'Flatbed', 'Enclosed'];

  selectedLocation: string = '';
  selectedType: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchTrailers();
  }

  fetchTrailers(): void {
    this.isLoading.set(true);

    let params = new HttpParams();
    if (this.selectedLocation) params = params.set('location', this.selectedLocation);
    if (this.selectedType) params = params.set('type', this.selectedType);
    if (this.minPrice) params = params.set('minPrice', this.minPrice.toString());
    if (this.maxPrice) params = params.set('maxPrice', this.maxPrice.toString());

    this.http.get<Trailer[]>('http://localhost:3000/api/trailers', { params })
      .subscribe({
        next: (data) => {
          this.trailers.set(data);
          this.filteredTrailers.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching data:', err);
          this.trailers.set([]);
          this.filteredTrailers.set([]);
          this.isLoading.set(false);
        }
      });
  }

  applyFilters(): void {
    this.fetchTrailers();
  }

  clearFilters(): void {
    this.selectedLocation = '';
    this.selectedType = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.fetchTrailers();
  }
}
