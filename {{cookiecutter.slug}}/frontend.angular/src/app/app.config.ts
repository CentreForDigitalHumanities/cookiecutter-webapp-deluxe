import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideClientHydration(),
        provideHttpClient(withXsrfConfiguration({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFToken'
        }))
    ]
};
