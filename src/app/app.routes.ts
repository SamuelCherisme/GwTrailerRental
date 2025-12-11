import { Routes } from '@angular/router';
import { Home } from '../pages/home/home';
import { TrailersList } from '../pages/Trailers-list/trailers-list';
import { TrailerDetails } from '../pages/Trailers-details/trailers-details';
import { Pricing } from '../pages/Pricing/pricing';
import { Locations } from '../pages/locations/locations';
import { Login } from '../pages/Login/Login';
import { Signup } from '../pages/SignUp/SignUp';
import { Profile } from '../pages/Profile/Profile';
import { ForgotPassword } from '../pages/ForgotPassword/Forgot-password';

export const routes: Routes = [
    { path: '', component: Home, title: 'Home | Trailer Rentals' },

    // Auth Routes
    { path: 'login', component: Login, title: 'Sign In | Trailer Rentals' },
    { path: 'signup', component: Signup, title: 'Sign Up | Trailer Rentals' },
    { path: 'profile', component: Profile, title: 'User Profile | Trailer Rentals' },
    { path: 'forgot-password', component: ForgotPassword, title: 'Reset Password | Trailer Rentals' },

    // Existing App Routes
    { path: 'trailers', component: TrailersList, title: 'Our Fleet | Trailer Rentals' },
    { path: 'trailers/:id', component: TrailerDetails, title: 'Trailer Details | Trailer Rentals' },
    { path: 'pricing', component: Pricing, title: 'Pricing | Trailer Rentals' },
    { path: 'locations', component: Locations, title: 'Locations | Trailer Rentals' },

    // Wildcard Route
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
