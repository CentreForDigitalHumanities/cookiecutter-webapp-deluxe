import { Component, computed, inject, LOCALE_ID, signal } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { environment } from '../../environments/environment';
import { DarkModeStore } from '../services/dark-mode-store';
import { map } from 'rxjs';

@Component({
    selector: 'dh-footer',
    templateUrl: './footer.html',
    styleUrl: './footer.scss',
    imports: [CommonModule]
})
export class Footer {
    private darkModeStore = inject(DarkModeStore);
    private localeId = inject(LOCALE_ID);

    public environment = signal(environment);

    public buildTime = computed(() => formatDate(
        new Date(environment.buildTime),
        $localize`:@@dateFormat:MMMM dd, yyyy`,
        this.localeId
    ));

    public logoSrc = this.darkModeStore.theme$.pipe(
        map(theme => `${environment.assets}${theme === 'dark' ? '/uu-cdh-dark.svg' : '/uu-cdh.svg'}`)
    );
}
