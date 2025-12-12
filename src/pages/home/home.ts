
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

// 1. IMPORT THE AUTH SERVICE
// (Ensure you have created src/app/auth.service.ts as discussed)
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
    { image: 'https://imgs.search.brave.com/0-xx-a1yRamkfPKIRjQTZBN63wFH5WpiG7HqMsv8kyY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvZmVhdHVy/ZWQvcGlja3VwLXRy/dWNrLWh3emdsNmJp/bTJob2xmZjMuanBn', caption: 'Flatbed Trailer - Rent Today' },
    { image: 'https://imgs.search.brave.com/Ff04WWwBOQpwERX8Bl2DIV1103680Z-SfQupil9dsJE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by92/ZWhpY2xlLW1vdmVf/MjMtMjE1MTg0NjAz/NS5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQwJnE9ODA', caption: 'Enclosed Trailer - Safe and Secure' },
    { image: 'https://imgs.search.brave.com/_EsU0xDnN8UdPnYRbz7jhOa_HFnVzhDAwfxh74brWSA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA3LzUwLzAyLzk2/LzM2MF9GXzc1MDAy/OTY3OV92V2NjT1FI/SzRadlliR1VoVFBy/d0REbWpMUExHaDB3/US5qcGc', caption: 'Utility Trailer - Ready for Work' }
  ];

  currentIndex = 0;
  currentYear = new Date().getFullYear();
  minDate = new Date().toISOString().split('T')[0];
  searchForm = { pickup: '', dropoff: '', date: '' };
  private autoPlayInterval: any;

  // 2. INJECT THE AUTH SERVICE
  // We use 'public' so the HTML template can access 'auth.isLoggedIn()' directly
  constructor(public auth: AuthService) {}

  get currentSlide() {
    return this.slides[this.currentIndex];
  }

  onSearch() {
    console.log('Search:', this.searchForm);
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
