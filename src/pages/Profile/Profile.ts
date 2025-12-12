import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './Profile.html',
  styleUrls: ['../../styles/profile.css']
})
export class Profile implements OnInit {
  isEditing = false;
  editName = '';

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Wait for auth to be ready, then check if logged in
    if (this.auth.isReady() && !this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
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
    // TODO: Implement update profile API call
    this.isEditing = false;
  }

  logout() {
    this.auth.logout();
  }
}
