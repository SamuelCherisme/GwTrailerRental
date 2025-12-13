// src/pages/admin/payments/admin-payments/admin-payments.ts

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../../app/admin.service';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-payments.html',
  styleUrls: ['../../dashboard/admin-dashboard/admin-dashboard.css', './admin-payments.css']
})
export class AdminPayments implements OnInit {
  isLoading = signal(false);

  constructor(private adminService: AdminService) {}

  ngOnInit() {}
}
