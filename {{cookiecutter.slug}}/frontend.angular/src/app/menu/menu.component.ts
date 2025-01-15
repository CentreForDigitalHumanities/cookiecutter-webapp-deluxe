import { Component, LOCALE_ID, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { DarkModeToggleComponent } from '../dark-mode-toggle/dark-mode-toggle.component';
import { LanguageInfo, LanguageService } from '../services/language.service';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: '{{cookiecutter.app_prefix}}-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        FontAwesomeModule,
        DarkModeToggleComponent,
        NgbCollapseModule,
        RouterModule,
        NgbDropdownModule,
    ]
})
export class MenuComponent implements OnInit {
    burgerActive = false;
    currentLanguage: string;
    loading = false;

    faGlobe = faGlobe;

    /**
     * Use the target languages for displaying the respective language names
     */
    languages?: LanguageInfo['supported'];

    constructor(
        @Inject(LOCALE_ID) private localeId: string,
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
        this.burgerActive = !this.burgerActive;
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
