import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trailer-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trailers-details.html',
  styleUrls: ['./trailers-details.css']
})
export class TrailerDetails implements OnInit, OnDestroy {
  trailer = signal<any>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  private routeSub!: Subscription;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadTrailer(id);
    });
  }

  loadTrailer(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.trailer.set(null);

    this.http.get(`http://localhost:3000/api/trailers/${id}`).subscribe({
      next: (data) => {
        this.trailer.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Trailer not found');
        this.isLoading.set(false);
        console.error('Error loading trailer:', err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
