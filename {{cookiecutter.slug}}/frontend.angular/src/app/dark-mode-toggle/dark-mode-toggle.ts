import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { map } from "rxjs";
import { DarkModeService } from "../services/dark-mode.service";


@Component({
    selector: "{{cookiecutter.app_prefix}}-dark-mode-toggle",
    imports: [FontAwesomeModule, CommonModule],
    templateUrl: "./dark-mode-toggle.html",
    styleUrl: "./dark-mode-toggle.scss",
})
export class DarkModeToggle {
    private darkModeService = inject(DarkModeService);

    faSun = faSun;
    faMoon = faMoon;
    dark$ = this.darkModeService.theme$.pipe(map((theme) => theme === "dark"));

    constructor() { }

    toggle() {
        this.darkModeService.toggle();
    }
}
