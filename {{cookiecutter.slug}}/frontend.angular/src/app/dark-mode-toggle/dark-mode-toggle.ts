import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { map } from "rxjs";
import { DarkModeStore } from "../services/dark-mode-store";


@Component({
    selector: "{{cookiecutter.app_prefix}}-dark-mode-toggle",
    imports: [FontAwesomeModule, CommonModule],
    templateUrl: "./dark-mode-toggle.html",
    styleUrl: "./dark-mode-toggle.scss",
})
export class DarkModeToggle {
    private darkModeStore = inject(DarkModeStore);

    faSun = faSun;
    faMoon = faMoon;
    dark$ = this.darkModeStore.theme$.pipe(map((theme) => theme === "dark"));

    toggle(): void {
        this.darkModeStore.toggle();
    }
}
