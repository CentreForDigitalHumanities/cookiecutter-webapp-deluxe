import { Component } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { map } from "rxjs";
import { DarkModeService } from "../services/dark-mode.service";
import { CommonModule } from "@angular/common";
@Component({
    selector: "{{cookiecutter.app_prefix}}-dark-mode-toggle",
    standalone: true,
    imports: [FontAwesomeModule, CommonModule],
    templateUrl: "./dark-mode-toggle.component.html",
    styleUrl: "./dark-mode-toggle.component.scss",
})
export class DarkModeToggleComponent {
    faSun = faSun;
    faMoon = faMoon;
    dark$ = this.darkModeService.theme$.pipe(map((theme) => theme === "dark"));

    constructor(private darkModeService: DarkModeService) {}

    toggle() {
        this.darkModeService.toggle();
    }
}
