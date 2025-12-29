import { Component, afterRender, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Menu } from './menu/menu';
import { Footer } from './footer/footer';
{%- if cookiecutter.basic_authentication == "Yes, please!" -%}
import { ToastContainer } from './toast-container/toast-container';
import { DarkModeStore } from './services/dark-mode-store';
{% endif %}

@Component({
    selector: '{{cookiecutter.app_prefix}}-root',
    imports: [
        RouterOutlet,
        Menu,
        Footer,
        {%- if cookiecutter.basic_authentication == "Yes, please!" -%}
        ToastContainer
        {% endif %}
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    private darkModeStore = inject(DarkModeStore);
    private document = inject(DOCUMENT);

    private readonly title = '{{cookiecutter.project_title}}';

    constructor() {
        // Using the DOM API to only render on the browser instead of on the server
        afterRender(() => {
            const style = this.document.createElement('link');
            style.rel = 'stylesheet';
            this.document.head.append(style);

            this.darkModeStore.theme$.subscribe(theme => {
                this.document.documentElement.setAttribute('data-bs-theme', theme);
                style.href = `${theme}.css`;
            });
        });
    }

}
