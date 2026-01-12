import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, EMPTY, map, Observable } from "rxjs";

export interface LanguageInfo {
    current: string;
    supported: {
        code: string;
        name: string;
    }[];
}

interface LanguageInfoResponse {
    current: string;
    supported: [string, string][];
}

@Injectable({
    providedIn: "root",
})
export class LanguageStore {
    private http = inject(HttpClient);

    public languageInfo$ = this.http
        .get<LanguageInfoResponse>("/api/i18n/")
        .pipe(
            map((response) => ({
                current: response.current,
                supported: response.supported.map(([code, name]) => ({
                    code,
                    name,
                })),
            }))
        );

    public set(language: string): Observable<void> {
        return this.http.post<void>("/api/i18n/", { language }).pipe(
            catchError((error) => {
                console.error(error.error);
                return EMPTY;
            })
        );
    }
}
