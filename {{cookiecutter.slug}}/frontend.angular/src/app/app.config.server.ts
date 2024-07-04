import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { BACKEND_URL, appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
    providers: [
        provideServerRendering(),
        { provide: BACKEND_URL, useValue: 'http://localhost:8000' }
    ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
