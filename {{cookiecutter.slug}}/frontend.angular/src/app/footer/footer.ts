import { Component, inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { formatDate } from '@angular/common';
import { environment } from '../../environments/environment';
import { DarkModeStore } from '../services/dark-mode-store';

@Component({
    selector: '{{cookiecutter.app_prefix}}-footer',
    templateUrl: './footer.html',
    styleUrl: './footer.scss',
})
export class Footer implements OnDestroy {
    private darkModeStore = inject(DarkModeStore);
    private localeId = inject(LOCALE_ID);

    public buildTime = formatDate(
        new Date(environment.buildTime),
        $localize`:@@dateFormat:MMMM dd, yyyy`,
        this.localeId
    );

    public dark$ = this.darkModeStore.theme$.pipe(
        map(theme => theme === 'dark')
    );
}
