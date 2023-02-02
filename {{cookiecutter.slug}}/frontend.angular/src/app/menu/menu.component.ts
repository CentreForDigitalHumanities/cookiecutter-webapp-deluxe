import { Component, LOCALE_ID, Inject, OnInit, NgZone } from '@angular/core';
import { faGlobe, faSync } from '@fortawesome/free-solid-svg-icons';
import { animations, showState } from '../animations';
import { LanguageInfo, LanguageService } from '../services/language.service';

@Component({
    animations,
    selector: '{{cookiecutter.app_prefix}}-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
    burgerShow: showState = 'show';
    burgerActive = false;
    currentLanguage: string;
    loading = false;

    faGlobe = faGlobe;
    faSync = faSync;

    // use the target languages for displaying the respective language names
    languages?: LanguageInfo['supported'];

    constructor(
        @Inject(LOCALE_ID) private localeId: string,
        private ngZone: NgZone,
        private languageService: LanguageService) {
        this.currentLanguage = this.localeId;
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
        if (!this.burgerActive) {
            // make it active to make it visible (add a class to
            // override it being hidden for smaller screens)
            this.burgerActive = true;
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
