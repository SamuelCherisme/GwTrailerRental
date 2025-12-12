// src/pages/verify-email/verify-email.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-email.html',
  styleUrls: ['../../styles/auth.css']
})
export class VerifyEmail implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.status = 'error';
      this.message = 'Invalid verification link. No token provided.';
      return;
    }

    this.auth.verifyEmail(token).subscribe(response => {
      if (response.success) {
        this.status = 'success';
        this.message = response.message;
      } else {
        this.status = 'error';
        this.message = response.message;
      }
    });
  }
}
