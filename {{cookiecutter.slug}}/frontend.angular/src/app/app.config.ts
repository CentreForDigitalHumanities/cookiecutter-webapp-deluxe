import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
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
        })),
        // The language is used as the base_path for finding the right
        // static-files. For example /nl/static/main.js
        // However the routing is done from a base path starting from
        // the root e.g. /home
        // The server should then switch index.html based on a language
        // cookie with a fallback to Dutch e.g. /nl/static/index.html
        { provide: APP_BASE_HREF, useValue: '/' }
    ]
};
