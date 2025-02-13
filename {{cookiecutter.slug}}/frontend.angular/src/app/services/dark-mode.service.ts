import { DOCUMENT } from "@angular/common";
import { DestroyRef, Inject, Injectable, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
    BehaviorSubject,
    Observable,
    combineLatestWith,
    distinctUntilChanged,
    fromEvent,
    map,
    of,
    startWith,
} from "rxjs";

/**
 * Bulma theme
 */
type Theme = "dark" | "light";

@Injectable({
    providedIn: "root",
})
export class DarkModeService implements OnInit {
    /**
     * Whether the user's system is set to use dark or light mode.
     */
    private readonly systemTheme$ = new BehaviorSubject<Theme | null>("light");

    /**
     * Did the user override the system settings?
     */
    private readonly user = new BehaviorSubject<Theme | null>(null);

    public theme$ = this.user.pipe(
        combineLatestWith(this.systemTheme$),
        distinctUntilChanged(),
        map(([user, system]) => user ?? system)
    );

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private destroyRef: DestroyRef
    ) {}

    ngOnInit(): void {
        this.observeSystem$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((theme) => this.systemTheme$.next(theme));

        const userTheme = this.readUserTheme();
        if (userTheme) {
            this.user.next(userTheme);
        }
    }

    /**
     * Gets the current theme from the system settings
     * @returns
     */
    private observeSystem$(): Observable<Theme | null> {
        const window = this.document.defaultView;
        if (!window || !window.matchMedia) {
            return of(null);
        }
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        return fromEvent<MediaQueryList>(mediaQuery, "change").pipe(
            startWith(mediaQuery),
            map((list: MediaQueryList) => (list.matches ? "dark" : "light"))
        );
    }

    /**
     * Gets the user's theme or null if they did not set anything
     * @returns
     */
    private readUserTheme(): Theme | null {
        if (typeof localStorage == "undefined") {
            // localStorage is undefined on the server
            return null;
        }
        return localStorage.getItem("theme") as Theme | null;
    }

    /**
     * Sets the user's theme
     * @param value user setting or null if it should depend on the system
     */
    private writeUserTheme(value: Theme | null): void {
        if (value == null) {
            localStorage.removeItem("theme");
        } else {
            localStorage.setItem("theme", value);
        }
        this.user.next(value);
    }

    toggle() {
        const target: Theme =
            (this.user.value ?? this.systemTheme$.value) === "dark"
                ? "light"
                : "dark";
        if (target === this.systemTheme$.value) {
            // restore to system setting - if the user might change that
            // system's setting later on this application will follow
            this.writeUserTheme(null);
        } else {
            this.writeUserTheme(target);
        }
    }
}
