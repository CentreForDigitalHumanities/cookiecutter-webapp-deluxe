import { Component, Inject, afterEveryRender } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { DarkModeService } from './services/dark-mode.service';
{%- if cookiecutter.basic_authentication == "Yes, please!" -%}
import { ToastContainerComponent } from './toast-container/toast-container.component';
{% endif %}

@Component({
    selector: '{{cookiecutter.app_prefix}}-root',
    standalone: true,
    imports: [
        RouterOutlet,
        MenuComponent,
        FooterComponent,
        {%- if cookiecutter.basic_authentication == "Yes, please!" -%}
        ToastContainerComponent
        {% endif %}
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    title = '{{cookiecutter.project_title}}';

    constructor(@Inject(DOCUMENT) private document: Document, private darkModeService: DarkModeService) {
        // Using the DOM API to only render on the browser instead of on the server
        afterEveryRender(() => {
            const style = this.document.createElement('link');
            style.rel = 'stylesheet';
            this.document.head.append(style);

            this.darkModeService.theme$.subscribe(theme => {
                this.document.documentElement.setAttribute('data-bs-theme', theme);
                style.href = `${theme}.css`;
            });
        });
    }

}
