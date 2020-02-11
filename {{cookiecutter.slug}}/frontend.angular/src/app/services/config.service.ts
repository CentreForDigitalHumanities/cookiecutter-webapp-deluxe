import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

export interface Config {
    backendUrl: string;
}

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config: Promise<any>;

    constructor(private http: HttpClient) { }

    public get(): Promise<Config> {
        if (!this.config) {
            this.config = new Promise<Config>((resolve, reject) =>
                this.http.get(this.getConfigUrl()).subscribe(response => {
                    resolve(response as Config);
                }));
        }

        return this.config;
    }

    public getConfigUrl(): string {
        if (environment.production) {
            return '/static/frontend_config.json';
        }
        return '/assets/config.json';
    }
}
