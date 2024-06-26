import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';

@Component({
    selector: '{{cookiecutter.app_prefix}}-root',
    standalone: true,
    imports: [RouterOutlet, MenuComponent, FooterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = '{{cookiecutter.project_title}}';
}
