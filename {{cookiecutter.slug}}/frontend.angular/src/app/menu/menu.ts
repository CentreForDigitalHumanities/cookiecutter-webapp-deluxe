import {
    Component,
    DestroyRef,
    LOCALE_ID,
    Inject,
    inject,
    OnInit
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { DarkModeToggle } from "../dark-mode-toggle/dark-mode-toggle";
import { LanguageInfo, LanguageService } from "../services/language.service";
import { NgbCollapseModule, NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
{% - if cookiecutter.basic_authentication == "Yes, please!" -%}
import { UserMenu } from "./user-menu/user-menu";
import { ToastContainer } from "../toast-container/toast-container";
{% endif %}

@Component({
    selector: "{{cookiecutter.app_prefix}}-menu",
    templateUrl: "./menu.component.html",
    styleUrls: ["./menu.component.scss"],
    imports: [
        CommonModule,
        RouterLink,
        FontAwesomeModule,
        DarkModeToggle,
        NgbCollapseModule,
        RouterModule,
        NgbDropdownModule,
        {% - if cookiecutter.basic_authentication == "Yes, please!" -%}
        UserMenu,
    ToastContainer,
    {% endif %}
    ]
})
export class Menu implements OnInit {
    private destroyRef = inject(DestroyRef);
    private languageService = inject(LanguageService);

    burgerActive = false;
    currentLanguage: string;
    loading = false;

    faGlobe = faGlobe;

    /**
     * Use the target languages for displaying the respective language names
     */
    languages?: LanguageInfo["supported"];

    constructor(@Inject(LOCALE_ID) private localeId: string) {
        this.currentLanguage = this.localeId;
    }

    ngOnInit(): void {
        // allow switching even when the current locale is different
        // this should really only be the case in development:
        // then the instance is only running in a single language
        this.languageService.languageInfo$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((languageInfo) => {
            this.currentLanguage = languageInfo.current || this.localeId;
            this.languages = languageInfo.supported;
        });
    }

    toggleBurger() {
        this.burgerActive = !this.burgerActive;
    }

    setLanguage(language: string): void {
        if (this.currentLanguage === language) {
            return;
        }
        this.loading = true;
        this.languageService
            .set(language)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                // reload the application to make the server route
                // to the different language version
                document.location.reload();
            });
    }
}
