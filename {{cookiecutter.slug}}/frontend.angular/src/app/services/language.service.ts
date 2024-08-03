import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { BackendService } from './backend.service';

export interface LanguageInfo {
    current: string;
    supported: {
        code: string,
        name: string
    }[];
}

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    baseApiUrl = '/api';

    constructor(private http: HttpClient, private backendService: BackendService) {
    }

    async get(): Promise<LanguageInfo> {
        const response: {
            current: string,
            supported: [string, string][]
        } = await this.backendService.get('i18n')

        return {
            current: response.current,
            supported: response.supported.map(([code, name]) => ({ code, name }))
        };
    }

    /***
     * @throws ValidationErrors
     */
    async set(language: string): Promise<void> {
        const response = lastValueFrom(this.http.post<void>(
            this.baseApiUrl + '/i18n/', {
            language
        }));

        try {
            return await response;
        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                console.error(error.error);
            }
            throw error;
        }
    }
}
