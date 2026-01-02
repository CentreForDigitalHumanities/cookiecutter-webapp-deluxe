import { Injectable, inject } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { SessionStore } from "./session-store";
import {
    catchError,
    map,
    of,
    switchMap,
    merge,
    share,
    startWith,
    withLatestFrom,
    shareReplay,
} from "rxjs";
import {
    UserRegistration,
    UserResponse,
    UserLogin,
    PasswordForgottenData,
    ResetPasswordData,
    KeyInfo,
    UserSettingsData,
    KeyInfoResult,
} from "../user/models/user";
import { encodeUserData, parseUserData } from "../user/utils";
import { HttpClient } from "@angular/common/http";
import { HttpVerb, Request } from "../user/Request";

export interface AuthApiResult {
    detail: string;
}

@Injectable({
    providedIn: "root",
})
export class AuthApi {
    private sessionStore = inject(SessionStore);
    private http = inject(HttpClient);

    public login = this.createRequest<UserLogin, AuthApiResult>(
        this.authRoute("login/"),
        "post"
    );
    public registration = this.createRequest<UserRegistration, never>(
        this.authRoute("registration/"),
        "post"
    );
    public passwordForgotten = this.createRequest<
        PasswordForgottenData,
        AuthApiResult
    >(this.authRoute("password/reset/"), "post");
    public resetPassword = this.createRequest<ResetPasswordData, AuthApiResult>(
        this.authRoute("password/reset/confirm/"),
        "post"
    );
    public verifyEmail = this.createRequest<KeyInfo, AuthApiResult>(
        this.authRoute("registration/verify-email/"),
        "post"
    );
    public updateSettings = this.createRequest<
        Partial<UserSettingsData>,
        UserResponse
    >(this.authRoute("user/"), "patch");
    public keyInfo = this.createRequest<KeyInfo, KeyInfoResult>(
        this.authRoute("registration/key-info/"),
        "post"
    );
    public deleteUser = this.createRequest<void, AuthApiResult>(
        this.authRoute("delete/"),
        "delete"
    );
    public logout = this.createRequest<void, AuthApiResult>(
        this.authRoute("logout/"),
        "post"
    );

    public backendUser$ = this.login.result$.pipe(
        startWith(undefined),
        switchMap(() =>
            this.http.get<UserResponse>(this.authRoute("user/")).pipe(
                catchError(() => of(null)),
                map(parseUserData)
            )
        ),
        share()
    );

    private updateSettingsUser$ = this.updateSettings.result$.pipe(
        withLatestFrom(this.backendUser$),
        map(([userData, currentUser]) =>
            "error" in userData ? currentUser : parseUserData(userData)
        )
    );

    public currentUser$ = merge(
        this.login.subject.pipe(map(() => undefined)),
        this.logout.success$.pipe(map(() => null)),
        this.deleteUser.success$.pipe(map(() => null)),
        this.backendUser$,
        this.updateSettingsUser$
    ).pipe(startWith(undefined), shareReplay(1));

    public isAuthenticated$ = this.currentUser$.pipe(
        map((user) => (user === undefined ? undefined : user !== null))
    );

    constructor() {
        this.sessionStore.expired
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.logout.subject.next());
    }

    // Keeping track of the latest version of the username
    private currentUserName = toSignal<string | null>(
        this.currentUser$.pipe(map((user) => user?.username ?? null))
    );

    /**
     * Encodes the user settings and sends them to the server to be updated.
     *
     * Due to a quirk in dj-auth-rest, the username must only be sent along if it has changed.
     * If the username is not changed, it will be removed from the input.
     *
     * @param userSettings - The user settings to be submitted.
     * @returns void
     */
    public newUserSettings(userSettings: UserSettingsData): void {
        if (userSettings.username === this.currentUserName()) {
            delete userSettings.username;
        }
        const encoded = encodeUserData(userSettings);
        this.updateSettings.subject.next(encoded);
    }

    private authRoute(route: string): string {
        return `/users/${route}`;
    }

    private createRequest<Input, Result extends object | never = AuthApiResult>(
        route: string,
        verb: HttpVerb
    ): Request<Input, Result> {
        return new Request<Input, Result>(this.http, route, verb);
    }
}
