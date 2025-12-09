import { Routes, provideRouter } from '@angular/router';
import { Home } from './home/home';
import { TrailersList } from './trailers-list/trailers-list';
import { TrailerDetails } from './trailers-details/trailers-details';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'trailers', component: TrailersList },
  { path: 'trailers/:id', component: TrailerDetails },
  { path: '**', redirectTo: '' }
];

export const appRouterProviders = [
  provideRouter(routes)
];
