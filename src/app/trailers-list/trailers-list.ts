import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';


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
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './trailers-list.html',
  styleUrl: './trailers-list.css'
})

export class TrailersList {
  trailers: Trailer[] = [];
  filteredTrailers: Trailer[] = []
  locations: string[] = [];
  types: string[] = [];
  selectedLocation: string = '';
  selectedType: string = '';
  minPrice: number | null = null
  maxPrice: number | null = null

  constructor(private http: HttpClient) {
    this.fetchTrailers();
  }

   ngOnInit(): void {
    this.fetchTrailers();
  }

   fetchTrailers(): void {
    const params: any = {};
    if (this.locations) params.location = this.locations;
    if (this.types) params.type = this.types;
    if (this.minPrice) params.minPrice = this.minPrice;
    if (this.maxPrice) params.maxPrice = this.maxPrice;

    this.http.get<Trailer[]>('http://localhost:3000/api/trailers', { params })
      .subscribe(data => this.trailers = data);
  }
}
