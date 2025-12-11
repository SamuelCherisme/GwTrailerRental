// src/pages/profile/profile.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="profile-page">
      <div *ngIf="!auth.isReady()" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading...</p>
      </div>

      <div *ngIf="auth.isReady()" class="profile-container">
        <div *ngIf="!auth.isLoggedIn()" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <h2>Access Denied</h2>
          <p>Please sign in to view your profile</p>
          <a routerLink="/login" class="btn btn-primary">Sign In</a>
        </div>





          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon rentals">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <div class="stat-info"><span class="stat-value">0</span><span class="stat-label">Active Rentals</span></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon history">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div class="stat-info"><span class="stat-value">0</span><span class="stat-label">Past Rentals</span></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon savings">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div class="stat-info"><span class="stat-value">$0</span><span class="stat-label">Total Saved</span></div>
            </div>
          </div>

          <div class="details-card">
            <div class="card-header">
              <h2>Account Details</h2>
              <button class="btn-edit" (click)="toggleEdit()">
                <svg *ngIf="!isEditing" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                <span>{{ isEditing ? 'Cancel' : 'Edit' }}</span>
              </button>
            </div>
            <div class="details-grid">
              <div class="detail-item">
                <label>Full Name</label>
                <div *ngIf="!isEditing" class="detail-value">{{ auth.currentUser()?.name || 'Not set' }}</div>
                <input *ngIf="isEditing" type="text" [(ngModel)]="editName" placeholder="Enter your name">
              </div>
              <div class="detail-item">
                <label>Email Address</label>
                <div class="detail-value">{{ auth.currentUser()?.email }}</div>
              </div>
              <div class="detail-item">
                <label>Account Status</label>
                <div class="detail-value"><span class="status-badge"><span class="status-dot"></span>Active</span></div>
              </div>
              <div class="detail-item">
                <label>Member Since</label>
                <div class="detail-value">{{ getMemberDate() }}</div>
              </div>
            </div>
            <div *ngIf="isEditing" class="edit-actions">
              <button class="btn btn-primary" (click)="saveChanges()">Save Changes</button>
            </div>
          </div>

          <div class="actions-card">
            <h2>Quick Actions</h2>
            <div class="actions-grid">
              <a routerLink="/trailers" class="action-item">
                <div class="action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></div>
                <span>Browse Trailers</span>
              </a>
              <a routerLink="/locations" class="action-item">
                <div class="action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
                <span>Find Locations</span>
              </a>
              <a routerLink="/pricing" class="action-item">
                <div class="action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                <span>View Pricing</span>
              </a>
              <button class="action-item logout" (click)="auth.logout()">
                <div class="action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>



  `,
  styles: [
    `
      .profile-page {
        min-height: 100vh;
        background: #fef9f3;
        padding: 120px 20px 60px;
      }
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        color: #636e72;
      }
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #e0e0e0;
        border-top-color: #d63031;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-bottom: 16px;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .profile-container {
        max-width: 900px;
        margin: 0 auto;
      }
      .empty-state {
        text-align: center;
        padding: 80px 40px;
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
      }
      .empty-state svg {
        width: 80px;
        height: 80px;
        color: #b2bec3;
        margin-bottom: 24px;
      }
      .empty-state h2 {
        font-family: 'Syne', sans-serif;
        color: #1a1a2e;
        font-size: 24px;
        font-weight: 800;
        margin: 0 0 12px;
      }
      .empty-state p {
        color: #636e72;
        margin: 0 0 24px;
      }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.875rem 1.75rem;
        font-family: 'Outfit', sans-serif;
        font-size: 0.95rem;
        font-weight: 600;
        border-radius: 12px;
        border: none;
        cursor: pointer;
        transition: all 0.25s ease;
        text-decoration: none;
      }
      .btn-primary {
        background: linear-gradient(135deg, #d63031, #b71c1c);
        color: #fff;
        box-shadow: 0 4px 20px rgba(214, 48, 49, 0.35);
      }
      .btn-primary:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 30px rgba(214, 48, 49, 0.45);
      }
      .profile-header {
        display: flex;
        align-items: center;
        gap: 24px;
        margin-bottom: 32px;
      }
      .avatar {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #d63031, #b71c1c);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Syne', sans-serif;
        font-size: 28px;
        font-weight: 800;
        color: #fff;
        box-shadow: 0 8px 25px rgba(214, 48, 49, 0.35);
      }
      .header-info h1 {
        font-family: 'Syne', sans-serif;
        font-size: 28px;
        font-weight: 800;
        color: #1a1a2e;
        margin: 0 0 8px;
      }
      .header-info p {
        color: #636e72;
        margin: 0;
        font-size: 15px;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-bottom: 24px;
      }
      .stat-card {
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 16px;
        padding: 24px;
        display: flex;
        align-items: center;
        gap: 16px;
        transition: all 0.25s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      }
      .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      }
      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .stat-icon svg {
        width: 24px;
        height: 24px;
      }
      .stat-icon.rentals {
        background: rgba(214, 48, 49, 0.1);
        color: #d63031;
      }
      .stat-icon.history {
        background: rgba(255, 159, 67, 0.1);
        color: #ff9f43;
      }
      .stat-icon.savings {
        background: rgba(39, 174, 96, 0.1);
        color: #27ae60;
      }
      .stat-info {
        display: flex;
        flex-direction: column;
      }
      .stat-value {
        font-family: 'Syne', sans-serif;
        font-size: 24px;
        font-weight: 800;
        color: #1a1a2e;
      }
      .stat-label {
        font-size: 13px;
        color: #636e72;
        margin-top: 2px;
      }
      .details-card,
      .actions-card {
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 20px;
        padding: 28px;
        margin-bottom: 24px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      }
      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
      }
      .card-header h2,
      .actions-card h2 {
        font-family: 'Syne', sans-serif;
        font-size: 18px;
        font-weight: 700;
        color: #1a1a2e;
        margin: 0;
      }
      .actions-card h2 {
        margin-bottom: 20px;
      }
      .btn-edit {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: #fef9f3;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        color: #636e72;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .btn-edit:hover {
        border-color: #d63031;
        color: #d63031;
      }
      .btn-edit svg {
        width: 16px;
        height: 16px;
      }
      .details-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }
      .detail-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .detail-item label {
        font-size: 13px;
        color: #636e72;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 500;
      }
      .detail-value {
        font-size: 16px;
        color: #1a1a2e;
      }
      .detail-item input {
        padding: 12px 16px;
        background: #fef9f3;
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        color: #2d3436;
        font-size: 15px;
        transition: all 0.2s ease;
      }
      .detail-item input:focus {
        outline: none;
        border-color: #d63031;
        box-shadow: 0 0 0 4px rgba(214, 48, 49, 0.1);
      }
      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        background: rgba(39, 174, 96, 0.1);
        border: 1px solid rgba(39, 174, 96, 0.3);
        border-radius: 20px;
        font-size: 14px;
        color: #27ae60;
      }
      .status-dot {
        width: 8px;
        height: 8px;
        background: #27ae60;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
      .edit-actions {
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid #e0e0e0;
      }
      .actions-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }
      .action-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 24px 16px;
        background: #fef9f3;
        border: 1px solid #e0e0e0;
        border-radius: 16px;
        color: #2d3436;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.25s ease;
      }
      .action-item:hover {
        background: #fff;
        border-color: #d63031;
        transform: translateY(-4px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      }
      .action-item.logout {
        background: transparent;
        border-color: rgba(214, 48, 49, 0.2);
        color: #d63031;
      }
      .action-item.logout:hover {
        background: rgba(214, 48, 49, 0.05);
        border-color: #d63031;
      }
      .action-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: rgba(214, 48, 49, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .action-icon svg {
        width: 24px;
        height: 24px;
        color: #d63031;
      }
      .action-item.logout .action-icon {
        background: rgba(214, 48, 49, 0.1);
      }
      @media (max-width: 768px) {
        .profile-header {
          flex-direction: column;
          text-align: center;
        }
        .stats-grid {
          grid-template-columns: 1fr;
        }
        .details-grid {
          grid-template-columns: 1fr;
        }
        .actions-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class Profile implements OnInit {
  isEditing = false;
  editName = '';

  constructor(public auth: AuthService) {}

  ngOnInit() {
    if (this.auth.isReady() && !this.auth.isLoggedIn()) {
      this.auth.redirectToLogin();
    }
    const user = this.auth.currentUser();
    this.editName = user?.name || '';
  }

  getInitials(): string {
    const name = this.auth.currentUser()?.name;
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  getMemberDate(): string {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      const user = this.auth.currentUser();
      this.editName = user?.name || '';
    }
  }

  saveChanges() {
    this.isEditing = false;
  }
}
