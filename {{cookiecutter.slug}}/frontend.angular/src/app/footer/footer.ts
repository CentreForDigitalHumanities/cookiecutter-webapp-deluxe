import { Component, inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { formatDate } from '@angular/common';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { DarkModeStore } from '../services/dark-mode-store';

@Component({
    selector: '{{cookiecutter.app_prefix}}-footer',
    templateUrl: './footer.html',
    styleUrls: ['./footer.scss'],
})
export class Footer implements OnDestroy {
    private darkModeStore = inject(DarkModeStore);
    private localeId = inject(LOCALE_ID);

    environment = environment;
    buildTime!: string;
    dark = false;
    subscriptions!: Subscription[];

    constructor() {
        this.buildTime = formatDate(new Date(environment.buildTime), $localize`:@@dateFormat:MMMM dd, yyyy`, this.localeId);
        this.subscriptions = [
            this.darkModeStore.theme$.subscribe(theme => this.dark = theme === 'dark')];
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
