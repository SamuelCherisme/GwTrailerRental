import { Routes } from '@angular/router';
import { Home } from '../pages/home/home';
import { TrailersList } from '../pages/trailers-list/trailers-list';
import { TrailerDetails } from '../pages/trailers-details/trailers-details';
import { Pricing } from '../pages/pricing/pricing';
import { Locations } from '../pages/locations/locations';

export const routes: Routes = [
    { path: '', component: Home, title: 'Home | Trailer Rentals' },
    { path: 'trailers', component: TrailersList, title: 'Our Fleet | Trailer Rentals' },
    { path: 'trailers/:id', component: TrailerDetails, title: 'Trailer Details | Trailer Rentals' },
    { path: 'pricing', component: Pricing, title: 'Pricing | Trailer Rentals' },
    { path: 'locations', component: Locations, title: 'Locations | Trailer Rentals' },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
