import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, OnDestroy {

  slides = [
    { image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800', caption: 'Flatbed Trailer - Rent Today' },
    { image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800', caption: 'Enclosed Trailer - Safe and Secure' },
    { image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', caption: 'Utility Trailer - Ready for Work' }
  ];

  currentIndex = 0;
  currentYear = new Date().getFullYear();
  minDate = new Date().toISOString().split('T')[0];

  // Search form fields
  searchLocation = '';
  searchType = '';
  searchPickupDate = '';
  searchReturnDate = '';

  private autoPlayInterval: any;

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  get currentSlide() {
    return this.slides[this.currentIndex];
  }

  getInitials(): string {
    const name = this.auth.currentUser()?.name;
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  onSearch() {
    // Build query params
    const queryParams: any = {};

    if (this.searchLocation) queryParams.location = this.searchLocation;
    if (this.searchType) queryParams.type = this.searchType;
    if (this.searchPickupDate) queryParams.pickupDate = this.searchPickupDate;
    if (this.searchReturnDate) queryParams.returnDate = this.searchReturnDate;

    // Navigate to trailers page with filters
    this.router.navigate(['/trailers'], { queryParams });
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(i: number) {
    this.currentIndex = i;
  }

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    this.stopAutoPlay();
    if (event.key === 'ArrowLeft') this.prevSlide();
    if (event.key === 'ArrowRight') this.nextSlide();
    this.startAutoPlay();
  }
}
