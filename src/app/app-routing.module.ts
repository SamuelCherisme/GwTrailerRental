import { Routes, provideRouter } from '@angular/router';
import { Home } from '../pages/home/home';
import { TrailersList } from '../pages/trailers-list/trailers-list';
import { TrailerDetails } from '../pages/trailers-details/trailers-details';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'trailers', component: TrailersList },
  { path: 'trailers/:id', component: TrailerDetails },
  { path: '**', redirectTo: '' }
];

export const appRouterProviders = [
  provideRouter(routes)
];
