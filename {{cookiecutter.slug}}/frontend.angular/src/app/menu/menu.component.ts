import { Component, LOCALE_ID, Inject, OnInit, NgZone, afterRender } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGlobe, faSync } from '@fortawesome/free-solid-svg-icons';
import { animations, showState } from '../animations';
import { DarkModeToggleComponent } from '../dark-mode-toggle/dark-mode-toggle.component';
import { LanguageInfo, LanguageService } from '../services/language.service';

@Component({
    animations,
    selector: '{{cookiecutter.app_prefix}}-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterLink, FontAwesomeModule, DarkModeToggleComponent]
})
export class MenuComponent implements OnInit {
    burgerShow: showState = 'show';
    burgerActive = false;
    currentLanguage: string;
    loading = false;

    faGlobe = faGlobe;
    faSync = faSync;

    /**
     * Use the target languages for displaying the respective language names
     */
    languages?: LanguageInfo['supported'];

    constructor(
        @Inject(DOCUMENT) private document: Document,
        @Inject(LOCALE_ID) private localeId: string,
        private ngZone: NgZone,
        private languageService: LanguageService) {
        this.currentLanguage = this.localeId;

        // Using the DOM API to only render on the browser instead of on the server
        afterRender(() => {
            const window = this.document.defaultView;
            const isDesktop = window ? window.matchMedia("screen and (min-width: 1024px)").matches : true;
            this.burgerShow = isDesktop ? 'show' : 'hide';
        });
    }

    async ngOnInit(): Promise<void> {
        // allow switching even when the current locale is different
        // this should really only be the case in development:
        // then the instance is only running in a single language
        const languageInfo = await this.languageService.get();
        this.currentLanguage = languageInfo.current || this.localeId;
        this.languages = languageInfo.supported;
    }

    toggleBurger() {
        this.burgerActive = !this.burgerActive;

        if (this.burgerActive) {
            // immediately hide it
            this.burgerShow = 'hide';
            setTimeout(() => {
                this.ngZone.run(() => {
                    // trigger the transition
                    this.burgerShow = 'show';
                });
            });
            return;
        }

        this.burgerShow = this.burgerShow === 'show' ? 'hide' : 'show';
    }

    async setLanguage(language: string): Promise<void> {
        if (this.currentLanguage !== language) {
            this.loading = true;
            await this.languageService.set(language);
            // reload the application to make the server route
            // to the different language version
            document.location.reload();
        }
    }
}
