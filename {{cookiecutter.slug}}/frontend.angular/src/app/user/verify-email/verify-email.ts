import { AfterViewInit, Component, DestroyRef, OnInit, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { map, share } from "rxjs";
import { KeyInfo } from "../models/user";
import { AuthApi } from "../../services/auth-api";
import { CommonModule } from "@angular/common";
import { ToastStore } from "../../services/toast-store";

@Component({
    selector: "{{cookiecutter.app_prefix}}-verify-email",
    templateUrl: "./verify-email.html",
    styleUrls: ["./verify-email.scss"],
    imports: [CommonModule],
})
export class VerifyEmail implements OnInit, AfterViewInit {
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);
    private authService = inject(AuthApi);
    private toastService = inject(ToastStore);
    private destroyRef = inject(DestroyRef);

    private key: KeyInfo = { key: this.activatedRoute.snapshot.params["key"] };

    public userDetails$ = this.authService.keyInfo.result$.pipe(
        map((results) => ("error" in results ? null : results)),
        share()
    );

    public loading$ = this.authService.verifyEmail.loading$;

    ngOnInit(): void {
        this.authService.keyInfo.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (!result) {
                    return;
                }
                this.toastService.show({
                    header: $localize`Email address verification failed.`,
                    body: $localize`Failed to verify email address.`,
                    type: "danger",
                });
            });

        this.authService.verifyEmail.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastService.show({
                    header: $localize`Email verification failed`,
                    body: $localize`Failed to verify email address.`,
                    type: "danger",
                });
            });

        this.authService.verifyEmail.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastService.show({
                    header: $localize`Email verified`,
                    body: $localize`Email address has been verified.`,
                    type: "success",
                });
                this.router.navigate(["/"]);
            });
    }

    // We are subscribing to results of this call in the template, so we should
    // only start listening after the view has been initialized.
    ngAfterViewInit(): void {
        this.authService.keyInfo.subject.next(this.key);
    }

    public confirm(): void {
        this.authService.verifyEmail.subject.next(this.key);
    }
}
