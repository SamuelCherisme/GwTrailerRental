// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

// Existing pages
import { Home } from '../pages/home/home';
import { TrailersList } from '../pages/Trailers-list/trailers-list';
import { TrailerDetails } from '../pages/Trailers-details/trailers-details';
import { Pricing } from '../pages/Pricing/pricing';
import { Locations } from '../pages/locations/locations';
import { Login } from '../pages/Login/Login';
import { Signup } from '../pages/SignUp/SignUp';
import { Profile } from '../pages/Profile/Profile';
import { ForgotPassword } from '../pages/ForgotPassword/Forgot-password';
import { ResetPassword } from '../pages/reset-password/reset-password';
import { VerifyEmail } from '../pages/verify-email/verify-email';
import { Booking } from '../pages/booking/booking';
import { MyBookings } from '../pages/my-bookings/my-bookings';

// New payment pages
import { BookingSuccess } from '../pages/my-bookings/booking-success/booking-success';
import { BookingCancelled } from '../pages/my-bookings/booking-cancelled/booking-cancelled';

// Admin pages
import { AdminDashboard } from '../pages/admin/dashboard/admin-dashboard/admin-dashboard';
import { AdminBookings } from '../pages/admin/bookings/admin-bookings/admin-bookings';
import { AdminUsers } from '../pages/admin/users/admin-users/admin-users';
import { AdminTrailers } from '../pages/admin/trailers/admin-trailers/admin-trailers';
import { AdminPayments } from '../pages/admin/payments/admin-payments/admin-payments';

// Auth guard - SSR safe
const authGuard = () => {
  const platformId = inject(PLATFORM_ID);

  // Skip guard on server - allow through, client will handle redirect
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

// Admin guard - SSR safe
const adminGuard = () => {
  const platformId = inject(PLATFORM_ID);

  // Skip guard on server - allow through, client will handle redirect
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const auth = inject(AuthService);
  const router = inject(Router);

  const user: any = auth.currentUser();
  if (auth.isLoggedIn() && user?.role === 'admin') {
    return true;
  }

  router.navigate(['/']);
  return false;
};

export const routes: Routes = [
    { path: '', component: Home, title: 'Home | Trailer Rentals' },

    // Auth Routes
    { path: 'login', component: Login, title: 'Sign In | GW Trailer Rentals' },
    { path: 'signup', component: Signup, title: 'Sign Up | GW Trailer Rentals' },
    { path: 'profile', component: Profile, title: 'My Profile | GW Trailer Rentals', canActivate: [() => authGuard()] },
    { path: 'forgot-password', component: ForgotPassword, title: 'Reset Password | GW Trailer Rentals' },
    { path: 'verify-email', component: VerifyEmail, title: 'Verify Email | GW Trailer Rentals' },
    { path: 'reset-password', component: ResetPassword, title: 'Set New Password | GW Trailer Rentals' },

    // Booking Routes
    { path: 'booking', component: Booking, title: 'Book a Trailer | GW Trailer Rentals', canActivate: [() => authGuard()] },
    { path: 'my-bookings', component: MyBookings, title: 'My Bookings | GW Trailer Rentals', canActivate: [() => authGuard()] },

    // Payment Routes (NEW)
    { path: 'booking-success', component: BookingSuccess, title: 'Payment Successful | GW Trailer Rentals', canActivate: [() => authGuard()] },
    { path: 'booking-cancelled', component: BookingCancelled, title: 'Payment Cancelled | GW Trailer Rentals', canActivate: [() => authGuard()] },

    // Existing App Routes
    { path: 'trailers', component: TrailersList, title: 'Our Fleet | Trailer Rentals' },
    { path: 'trailers/:id', component: TrailerDetails, title: 'Trailer Details | Trailer Rentals' },
    { path: 'pricing', component: Pricing, title: 'Pricing | Trailer Rentals' },
    { path: 'locations', component: Locations, title: 'Locations | Trailer Rentals' },

    // Admin Routes (NEW)
    { path: 'admin', component: AdminDashboard, title: 'Admin Dashboard | GW Trailer Rentals', canActivate: [() => adminGuard()] },
    { path: 'admin/bookings', component: AdminBookings, title: 'Manage Bookings | GW Trailer Rentals', canActivate: [() => adminGuard()] },
    { path: 'admin/users', component: AdminUsers, title: 'Manage Users | GW Trailer Rentals', canActivate: [() => adminGuard()] },
    { path: 'admin/trailers', component: AdminTrailers, title: 'Manage Trailers | GW Trailer Rentals', canActivate: [() => adminGuard()] },
    { path: 'admin/payments', component: AdminPayments, title: 'Payments | GW Trailer Rentals', canActivate: [() => adminGuard()] },

    // Wildcard Route
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
