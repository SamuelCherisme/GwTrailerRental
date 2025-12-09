
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-trailer-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
    templateUrl: './trailers-details.html',
})
export class TrailerDetails implements OnInit {
  trailer: any = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.http.get(`http://localhost:3000/api/trailers/${id}`)
      .subscribe(data => this.trailer = data);
  }
}
