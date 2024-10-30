import { Component, Inject, afterRender } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { DarkModeService } from './services/dark-mode.service';

@Component({
    selector: '{{cookiecutter.app_prefix}}-root',
    standalone: true,
    imports: [RouterOutlet, MenuComponent, FooterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = '{{cookiecutter.project_title}}';

    constructor(@Inject(DOCUMENT) private document: Document, private darkModeService: DarkModeService) {
        // Using the DOM API to only render on the browser instead of on the server
        afterRender(() => {
            const style = this.document.createElement('link');
            style.rel = 'stylesheet';
            this.document.head.append(style);

            this.darkModeService.theme$.subscribe(theme => {
                this.document.documentElement.classList.remove(theme === 'dark' ? 'theme-light' : 'theme-dark');
                this.document.documentElement.classList.add('theme-' + theme);

                style.href = `${theme}.css`;
            });
        });
    }

}
