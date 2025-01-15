import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy, afterRender } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, combineLatestWith, distinctUntilChanged, fromEvent, map, startWith } from 'rxjs';

/**
 * Bootstrap theme
 */
type Theme = 'dark' | 'light';

@Injectable({
    providedIn: 'root'
})
export class DarkModeService implements OnDestroy {
    private initialized = false;
    private readonly subscriptions: Subscription[] = [];
    /**
     * Whether the user's system is set to use dark or light mode.
     */
    private readonly system = new BehaviorSubject<Theme>('light');

    /**
     * Did the user override the system settings?
     */
    private readonly user = new BehaviorSubject<Theme | null>(null);

    theme$: Observable<Theme>;

    constructor(@Inject(DOCUMENT) private document: Document) {
        const user = this.get();
        if (user) {
            this.user.next(user);
        }

        // set the active theme by the user or if this is
        // empty, listen to the system settings
        this.theme$ = this.user.pipe(
            combineLatestWith(this.system),
            distinctUntilChanged(),
            map(([user, system]) => {
                console.log({ user, system });
                return user ?? system
            }));

        afterRender(() => {
            this.initialize();
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    private initialize() {
        if (this.initialized) {
            return;
        }

        this.initialized = true;
        const system$ = this.observeSystem();
        if (system$) {
            this.subscriptions.push(system$.subscribe(theme => this.system.next(theme)));
        }
    }

    /**
     * Gets the current theme from the system settings
     * @returns
     */
    private observeSystem(): Observable<Theme> | null {
        const window = this.document.defaultView;
        if (!window || !window.matchMedia) {
            return null;
        }
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        return fromEvent<MediaQueryList>(mediaQuery, 'change').pipe(
            startWith(mediaQuery),
            map((list: MediaQueryList) => list.matches ? 'dark' : 'light')
        );
    }

    /**
     * Gets the user's theme or null if they did not set anything
     * @returns
     */
    private get(): Theme | null {
        if (typeof localStorage == 'undefined') {
            // localStorage is undefined on the server
            return null;
        }
        return <Theme | null>localStorage.getItem('theme');
    }

    /**
     * Sets the user's theme
     * @param value user setting or null if it should depend on the system
     */
    private set(value: Theme | null): void {
        if (value == null) {
            localStorage.removeItem('theme');
        } else {
            localStorage.setItem('theme', value);
        }

        this.user.next(value);
    }

    toggle() {
        const target: Theme = (this.user.value ?? this.system.value) === 'dark' ? 'light' : 'dark';
        if (target === this.system.value) {
            // restore to system setting - if the user might change that
            // system's setting later on this application will follow
            this.set(null);
        } else {
            this.set(target);
        }
    }
}
