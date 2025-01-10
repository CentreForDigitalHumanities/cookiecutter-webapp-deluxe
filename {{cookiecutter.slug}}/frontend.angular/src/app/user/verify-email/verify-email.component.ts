import { AfterViewInit, Component, DestroyRef, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@services/auth.service";
import { ToastService } from "@services/toast.service";
import { map, share } from "rxjs";
import { KeyInfo } from "../models/user";

@Component({
    selector: "lc-verify-email",
    templateUrl: "./verify-email.component.html",
    styleUrls: ["./verify-email.component.scss"],
})
export class VerifyEmailComponent implements OnInit, AfterViewInit {
    private key: KeyInfo = { key: this.activatedRoute.snapshot.params["key"] };

    public userDetails$ = this.authService.keyInfo.result$.pipe(
        map((results) => ("error" in results ? null : results)),
        share(),
    );

    public loading$ = this.authService.verifyEmail.loading$;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private toastService: ToastService,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.authService.keyInfo.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (!result) {
                    return;
                }
                this.toastService.show({
                    header: "Email address verification failed.",
                    body: "Failed to verify email address.",
                    type: "danger",
                });
            });

        this.authService.verifyEmail.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.toastService.show({
                header: "Email verification failed",
                body: "Failed to verify email address.",
                type: "danger",
            }));

        this.authService.verifyEmail.success$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.toastService.show({
                    header: "Email verified",
                    body: "Email address has been verified.",
                    type: "success",
                });
                this.router.navigate(['/']);
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
