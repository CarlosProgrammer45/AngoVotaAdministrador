import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter, Router, NavigationStart, NavigationEnd, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withHashLocation()), //hash routing
    provideHttpClient()
  ]
})
.then(appRef => {
  const router = appRef.injector.get(Router);

  router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      document.documentElement.classList.add('is-animating');
    }
    if (event instanceof NavigationEnd) {
      setTimeout(() => {
        document.documentElement.classList.remove('is-animating');
      }, 400); // tempo da animação em ms
    }
  });
})
.catch((err) => console.error(err));
