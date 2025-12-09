import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TrailersList } from './app/trailers-list/trailers-list';
import { routes } from './app/app.routes';
import { appConfig } from './app/app.config';


bootstrapApplication(TrailersList, {
  providers: [provideRouter(routes), ...appConfig.providers],
}).catch((err) => console.error(err));
