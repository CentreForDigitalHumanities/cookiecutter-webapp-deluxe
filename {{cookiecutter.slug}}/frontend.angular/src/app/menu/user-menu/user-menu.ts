import { Component, DestroyRef, OnInit, inject } from "@angular/core";
import { filter, map } from "rxjs";
import { AuthApi } from "../../services/auth-api";
import { Router, RouterModule } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CommonModule } from "@angular/common";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ToastService } from "../../services/toast.service";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "{{cookiecutter.app_prefix}}-user-menu",
    templateUrl: "./user-menu.component.html",
    styleUrls: ["./user-menu.component.scss"],
    imports: [RouterModule, CommonModule, FontAwesomeModule, NgbDropdownModule],
})
export class UserMenu implements OnInit {
    private authService = inject(AuthApi);
    private toastService = inject(ToastService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);

    public authLoading$ = this.authService.currentUser$.pipe(
        map((user) => user === undefined)
    );

    public user$ = this.authService.currentUser$;

    public showSignIn$ = this.authService.currentUser$.pipe(
        map((user) => user === null)
    );

    public logoutLoading$ = this.authService.logout.loading$;

    public currentPath$ = this.router.routerState.root.url.pipe(
        map((url) => url.pop() ?? null),
        filter((url) => url?.toString() !== "")
    );

    public faUser = faUser;

    ngOnInit(): void {
        this.authService.logout.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastService.show({
                    header: $localize`Sign out failed`,
                    body: $localize`There was an error signing you out. Please try again.`,
                    type: "danger",
                });
            });

        this.authService.logout.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastService.show({
                    header: $localize`Sign out successful`,
                    body: $localize`You have been successfully signed out.`,
                    type: "success",
                });
                this.router.navigate(["/"]);
            });
    }

    public logout(): void {
        this.authService.logout.subject.next();
    }
}
