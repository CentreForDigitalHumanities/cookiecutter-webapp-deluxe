import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { BACKEND_URL_OVERRIDE, appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
    providers: [
        provideServerRendering(),
        { provide: BACKEND_URL_OVERRIDE, useValue: 'http://localhost:{{cookiecutter.backend_port}}/api/' }
    ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
